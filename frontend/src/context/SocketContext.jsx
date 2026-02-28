import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { io } from 'socket.io-client';

// Strip /api (and any trailing slash) from the API URL to get the socket server root
const getSocketUrl = () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) return 'http://localhost:5000';
    return apiUrl.replace(/\/api\/?$/, '').replace(/\/$/, '');
};

const SOCKET_URL = getSocketUrl();

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
    const socketRef = useRef(null);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const socket = io(SOCKET_URL, {
            transports: ['websocket', 'polling'],
            reconnectionAttempts: 5,
            reconnectionDelay: 2000,
            timeout: 10000,
        });

        socketRef.current = socket;

        socket.on('connect', () => setConnected(true));
        socket.on('disconnect', () => setConnected(false));
        socket.on('connect_error', (err) => {
            // Silently handle connection errors — real-time is non-critical
            if (import.meta.env.DEV) {
                console.warn('[Socket] Connection error:', err.message);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <SocketContext.Provider value={{ socket: socketRef.current, connected }}>
            {children}
        </SocketContext.Provider>
    );
};

export const useSocket = () => useContext(SocketContext);
