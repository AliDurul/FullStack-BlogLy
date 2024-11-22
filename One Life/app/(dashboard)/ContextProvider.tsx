'use client';

import { SocketProvider } from "@/lib/contexts/SocketContext";


const BASE_URL = process.env.NEXT_PUBLIC_APIBASE_URL + '/';

interface Props {
    readonly children: React.ReactNode;
}

export default function ContextProvider({ children }: Props) {
    return (
        <SocketProvider url={BASE_URL}>{children}</SocketProvider>
    )
}



