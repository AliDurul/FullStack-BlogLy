import { JwtPayload } from "jwt-decode";
import NextAuth from "next-auth";

export interface userInfo {

    profile_img: string,
    username: string,
    fullname: string,
    iat: number,
    exp: number
}

declare module "next-auth" {

    interface Session {
        access: string;
        refresh: string;
        error?: string;
        user: userInfo;
    }
    interface User {
        error: boolean;
        access: string;
        refresh: string;
    }

}

declare module "next-auth/jwt" {
    interface JWT {
        access: string;
        refresh: string;
        error?: string;
        userInfo: userInfo;
        iat: number;
        exp: number;
        jti: string;
    }

}



