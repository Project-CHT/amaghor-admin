/**
 * BFF Proxy Layer for Amaghor Admin
 * Proxies all API requests to the Go backend server
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth.config';

const GO_SERVER_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9090';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return handleProxyRequest(request, path, 'GET');
}

export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return handleProxyRequest(request, path, 'POST');
}

export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return handleProxyRequest(request, path, 'PUT');
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return handleProxyRequest(request, path, 'DELETE');
}

export async function PATCH(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    const { path } = await params;
    return handleProxyRequest(request, path, 'PATCH');
}

async function handleProxyRequest(
    request: NextRequest,
    pathArray: string[],
    method: string
) {
    try {
        // Get session for authentication
        const session = await getServerSession(authOptions);

        // Construct the target URL
        const path = pathArray.join('/');
        const searchParams = request.nextUrl.searchParams.toString();
        const targetUrl = `${GO_SERVER_URL}/${path}${searchParams ? `?${searchParams}` : ''}`;

        console.log(`[BFF Proxy] ${method} ${path} -> ${targetUrl}`);

        // Check if the request is multipart/form-data
        const contentType = request.headers.get('content-type');
        const isMultipart = contentType?.includes('multipart/form-data');

        // Prepare headers
        const headers: Record<string, string> = {};

        // For multipart, DON'T set Content-Type - let fetch() set it with correct boundary
        // For JSON, set Content-Type
        if (!isMultipart) {
            headers['Content-Type'] = 'application/json';
        }

        // Add authentication token from session
        if (session?.accessToken) {
            headers['Authorization'] = `Bearer ${session.accessToken}`;
        }

        // Prepare request body for POST/PUT/PATCH
        let body: any;
        if (['POST', 'PUT', 'PATCH'].includes(method)) {
            if (isMultipart) {
                // For multipart/form-data, forward the FormData as-is
                body = await request.formData();
            } else {
                try {
                    const requestBody = await request.json();
                    body = JSON.stringify(requestBody);
                } catch (error) {
                    // No body or invalid JSON, ignore
                }
            }
        }

        // Make the proxied request to Go server
        const response = await fetch(targetUrl, {
            method,
            headers,
            body,
            cache: 'no-store',
        });

        // Handle 204 No Content
        if (response.status === 204) {
            return new NextResponse(null, { status: 204 });
        }

        // Get response data
        const responseText = await response.text();
        let responseData;

        try {
            responseData = responseText ? JSON.parse(responseText) : {};
        } catch (error) {
            responseData = responseText;
        }

        // Return the response
        return NextResponse.json(responseData, {
            status: response.status,
            headers: {
                'Content-Type': 'application/json',
            }
        });

    } catch (error: any) {
        console.error('[BFF Proxy] Error:', error);
        return NextResponse.json(
            {
                success: false,
                error: {
                    message: error.message || 'Proxy request failed',
                    code: 'PROXY_ERROR'
                }
            },
            { status: 500 }
        );
    }
}
