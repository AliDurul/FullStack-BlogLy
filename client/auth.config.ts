import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { CredentialsSignin, Profile, User } from "next-auth";
import type { Account, NextAuthConfig, Session } from 'next-auth';
import { JWT } from "next-auth/jwt";
import { jwtDecode } from "jwt-decode";
import CredentialsProvider from "next-auth/providers/credentials";
import { TCredentials, userInfo } from './types/next-auth';

const API_BASE_URL = process.env.API_BASE_URL;

// Custom Errors
class CustomError extends CredentialsSignin {
    constructor(message: string) {
        super(message);
        this.message = message || "Custom Message: Authentication failed";
    }
    code = "custom_error";
}

class SignInError extends Error {
    constructor(message: string, public code: string = "signin_error") {
        super(message);
        this.name = "SignInError";
    }
}

// Utility Functions
const fetchWithErrorHandling = async (url: string, body: object) => {

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store',
    });
    const data = await res.json();

    if (!res.ok || !data.success) throw new CustomError(data.message || 'Custom Message: Authentication failed');

    return data;
};

const refreshAccessToken = async (token: JWT) => {
    try {
        const newTokens = await fetchWithErrorHandling(`${API_BASE_URL}/auth/refresh`, { refresh: token.refresh });

        return {
            ...token,
            access: newTokens.access,
            userInfo: jwtDecode<userInfo>(newTokens.access),
            refresh: newTokens.refresh || token.refresh,
        };
    } catch (error: unknown) {
        console.error("Error: refreshing access token", (error as Error).message);
        return { ...token, error: "RefreshTokenError" };
    }
};

const registerOrFetchUser = async (account: Account, profile: Profile) => {
    let payload;
    switch (account.provider) {
        case 'google':
            const { sub, email, name, picture } = profile;
            payload = { email, sub, fullname: name, picture };
            break;
        case 'github':
            const { node_id, email: ghEmail, name: ghName, avatar_url, html_url, bio } = profile;
            payload = { email: ghEmail, sub: node_id, fullname: ghName, picture: avatar_url, github_link: html_url, bio };
            break;
        default:
            throw new SignInError('Unsupported provider', 'unsupported_provider');
    }

    return fetchWithErrorHandling(`${API_BASE_URL}/auth/register`, payload);
};

export default {
    trustHost: true,
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
            authorization: {
                params: {
                    prompt: "consent",
                    access_type: "offline",
                    response_type: "code",
                },
            },
        }),
        GitHub({
            clientId: process.env.AUTH_GITHUB_ID,
            clientSecret: process.env.AUTH_GITHUB_SECRET,
        }),
        CredentialsProvider({
            name: 'Credentials',
            authorize: async (credentials) => {
                if (!credentials) return null;
                const { email, password } = credentials as TCredentials;
                return fetchWithErrorHandling(`${API_BASE_URL}/auth/login`, { email, password });
            }
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user) return false;

            try {
                if (account?.provider !== 'credentials') {
                    const userTokens = await registerOrFetchUser(account as Account, profile as Profile);
                    user.access = userTokens.access;
                    user.refresh = userTokens.refresh;
                }
            } catch (error) {
                if (error instanceof SignInError) return `/auth-error?error=${encodeURIComponent(error.message)}&code=${error.code}`;

                return `/auth-error?error=An unexpected error occurred`;
            }

            return true;
        },

        async jwt({ token, user, trigger, session }) {

            if (trigger === 'update' && session?.user) Object.assign(token.userInfo, session.user);

            if (user) return { ...token, access: user.access, refresh: user.refresh, userInfo: jwtDecode<userInfo>(user.access) };

            if (Date.now() < token.userInfo.exp * 1000) return token;

            if (!token.refresh) throw new TypeError("Missing refresh_token");

            return refreshAccessToken(token);
        },

        async session({ session, token }) {

            // if (token.error === "RefreshTokenError") {
            //     console.log("Token refresh failed. Logging out user...");
            //     return { ...session, error: 'RefreshTokenError' };
            // };

            if (token.access) {
                const { access, refresh, userInfo, error } = token as JWT;
                session.user = userInfo as any;
                session.access = access;
                session.refresh = refresh;
                session.error = error;
            }
            return session as Session;
        },
    },
} satisfies NextAuthConfig;