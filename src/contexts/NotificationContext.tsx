'use client';

import React, { createContext, useContext, useState } from 'react';
import { toast, Toaster } from 'sonner';
import { useWebSocket, WebSocketMessage } from '../hooks/useWebSocket';

interface NotificationContextType {
    isConnected: boolean;
    notifications: WebSocketMessage[];
    clearNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<WebSocketMessage[]>([]);

    const handleMessage = (message: WebSocketMessage) => {
        console.log('📬 [Admin] Notification:', message);

        setNotifications((prev) => [message, ...prev].slice(0, 50));

        // Admin level toasts
        switch (message.type) {
            case 'payment_received':
                toast.success(message.message || 'Payment received!', {
                    description: `Amount: ${message.data?.amount} ${message.data?.currency}`,
                });
                break;
            case 'payment_pending_approval':
                toast.warning(message.message || 'Manual payment needs approval', {
                    description: `Booking: ${message.data?.booking_id}`,
                    action: {
                        label: 'View',
                        onClick: () => window.location.href = `/payments`,
                    },
                });
                break;
            case 'welcome':
                console.log('👋 [Admin] Welcome to Amaghor WebSocket');
                break;
            default:
                toast(message.message || 'Admin Update', {
                    description: message.type,
                });
        }
    };

    const { isConnected, sendMessage } = useWebSocket({
        onMessage: handleMessage,
        onConnect: () => {
            console.log('📡 [Admin] Joining admin_notifications channel');
            sendMessage({
                type: 'join_channel',
                channel: 'admin_notifications',
            });
        },
    });

    const clearNotifications = () => {
        setNotifications([]);
    };

    return (
        <NotificationContext.Provider value={{ isConnected, notifications, clearNotifications }}>
            {children}
            <Toaster position="bottom-right" richColors closeButton />
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotifications must be used within a NotificationProvider');
    }
    return context;
};
