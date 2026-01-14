import { useEffect, useRef, useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

export interface WebSocketMessage {
    type: string;
    message?: string;
    data?: any;
    timestamp?: string;
    connection_id?: string;
    [key: string]: any;
}

interface UseWebSocketOptions {
    onMessage?: (message: WebSocketMessage) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
    autoReconnect?: boolean;
    reconnectInterval?: number;
}

export const useWebSocket = (options: UseWebSocketOptions = {}) => {
    const { data: session } = useSession();
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const {
        onMessage,
        onConnect,
        onDisconnect,
        autoReconnect = true,
        reconnectInterval = 5000,
    } = options;

    const connect = useCallback(() => {
        if (!session?.accessToken) return;

        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // Use the same port as backend (8081 by default for WS)
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || `${protocol}//localhost:8081/ws`;

        console.log('🔌 [Admin] Connecting to WebSocket:', wsUrl);

        try {
            const urlWithToken = `${wsUrl}?token=${session.accessToken}`;
            const socket = new WebSocket(urlWithToken);

            socket.onopen = () => {
                console.log('✅ [Admin] WebSocket Connected');
                setIsConnected(true);
                if (onConnect) onConnect();

                if (reconnectTimeoutRef.current) {
                    clearTimeout(reconnectTimeoutRef.current);
                    reconnectTimeoutRef.current = null;
                }
            };

            socket.onmessage = (event) => {
                try {
                    const data: WebSocketMessage = JSON.parse(event.data);
                    setLastMessage(data);
                    if (onMessage) onMessage(data);
                } catch (err) {
                    console.error('❌ [Admin] Failed to parse WebSocket message:', err);
                }
            };

            socket.onclose = (event) => {
                console.log('🔌 [Admin] WebSocket Disconnected:', event.code, event.reason);
                setIsConnected(false);
                if (onDisconnect) onDisconnect();

                if (autoReconnect && event.code !== 1000) {
                    console.log(`🔄 [Admin] Attempting to reconnect in ${reconnectInterval}ms...`);
                    reconnectTimeoutRef.current = setTimeout(() => {
                        connect();
                    }, reconnectInterval);
                }
            };

            socket.onerror = (err) => {
                console.error('❌ [Admin] WebSocket Error:', err);
            };

            socketRef.current = socket;
        } catch (err) {
            console.error('❌ [Admin] Failed to establish WebSocket connection:', err);
        }
    }, [session?.accessToken, onMessage, onConnect, onDisconnect, autoReconnect, reconnectInterval]);

    useEffect(() => {
        connect();

        return () => {
            if (socketRef.current) {
                socketRef.current.close(1000, 'Component unmounting');
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connect]);

    const sendMessage = useCallback((message: any) => {
        if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify(message));
        } else {
            console.warn('⚠️ [Admin] Cannot send message: WebSocket is not open');
        }
    }, []);

    return { isConnected, lastMessage, sendMessage };
};
