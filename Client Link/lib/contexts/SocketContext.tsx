import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from "@socket.io/component-emitter"

interface SocketContextProps {
    socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
}

const SocketContext = createContext<SocketContextProps | undefined>(undefined);

export const useSocket = () => {
    const context = useContext(SocketContext);
    if (!context) {
        throw new Error('useSocket must be used within a SocketProvider');
    }
    return context.socket;
};

export const SocketProvider: React.FC<{ url: string | undefined, children: React.ReactNode }> = ({ url, children }) => {
    const [socket, setSocket] = useState<Socket<DefaultEventsMap, DefaultEventsMap> | null>(null);

    useEffect(() => {
        const socketInstance = io(url);
        setSocket(socketInstance);

        socketInstance.on('connect', () => {
        });

        socketInstance.on('disconnect', () => {
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [url]);

    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    );
};