'use client'
import { createContext, ReactNode } from "react";

const MailContext = createContext({});

interface Props {
    readonly children: ReactNode;
}

export function MailProvider({ children }: Props) {



    const value = {};

    return <MailContext.Provider value={value}>{children}</MailContext.Provider>;
}