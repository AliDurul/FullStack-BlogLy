import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { CredentialsSignin, Profile, User } from "next-auth"
import type { NextAuthConfig, Session } from 'next-auth';
import { JWT } from "next-auth/jwt"
import { jwtDecode } from "jwt-decode"
import CredentialsProvider from "next-auth/providers/credentials";
import { TCredentials, userInfo } from './types/next-auth';


const API_BASE_URL = process.env.API_BASE_URL;

// error for authorize
class CustomError extends CredentialsSignin {
    constructor(message: string) {
        super(message)
        this.message = message || "Custom Message: Authentication failed"
    }
    code = "custom_error"
};

// error for signin
class SignInError extends Error {
    constructor(message: string, public code: string = "signin_error") {
        super(message);
        this.name = "SignInError";
    }
};

const authenticateUser = async (url: string, body: object) => {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store'
    });

    if (!res.ok) {
        const errorBody = await res.json();
        console.log('object', errorBody);
        throw new CustomError(errorBody.message);
    };

    const user = await res.json();

    if (!user.success) throw new CustomError(user.message || 'Custom Message: Authentication failed');

    return user;


};

const refreshAccessToken = async (token: JWT) => {

    try {
        const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refresh: token.refresh })
        })

        const tokensOrError = await res.json()

        if (!res.ok) throw tokensOrError

        const newTokens = tokensOrError as {
            access: string
            refresh: string | null
            success: boolean
        }

        return {
            ...token,
            access: newTokens.access,
            userInfo: jwtDecode<userInfo>(newTokens.access),
            refresh: newTokens.refresh ? newTokens.refresh : token.refresh,
        }

    } catch (error: unknown) {
        console.error("Error: refreshing access token ", (error as Error).message)
        return { ...token, error: "RefreshTokenError" };
    }

}

export default {
    trustHost: true,
    providers: [
        GitHub,
        Google,
        CredentialsProvider({
            name: 'Credentials',
            authorize: async (credentials) => {

                if (!credentials) return null;

                const { email, password } = credentials as TCredentials;

                return await authenticateUser(`${API_BASE_URL}/auth/login`, { email, password });

            }
        })
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user) return false

            try {
                if (account?.provider !== 'credentials') {
                    let res;
                    let payload;

                    switch (account?.provider) {
                        case 'google': {
                            const { sub, email, name, picture } = profile as Profile;
                            payload = { email, sub, fullname: name, picture };
                            break;
                        }
                        case 'github': {
                            // console.log('profule', profile);
                            const { node_id, email, name, avatar_url } = profile as Profile;
                            payload = { email, sub: node_id, fullname: name, picture: avatar_url };
                            break;
                        }
                        default:
                            throw new SignInError('Unsupported provider', 'unsupported_provider');
                    };

                    // cheking if user exist dont create new user return user info
                    res = await fetch(`${API_BASE_URL}/auth/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });

                    if (!res.ok) {
                        const errorBody = await res.json();
                        // console.error('Failed to register user. Response:', errorBody);
                        throw new SignInError(errorBody?.message || 'Something went wrong, Failed to register user.', 'registration_failed');
                    }

                    const userTokens = await res.json();

                    // console.log('userTokens--', userTokens);
                    user.access = userTokens.access;
                    user.refresh = userTokens.refresh;
                }
            } catch (error) {
                if (error instanceof SignInError) {
                    return `/auth-error?error=${encodeURIComponent(error.message)}&code=${error.code}`;
                }
                return `/auth-error?error=An unexpected error occurred`;
            }

            return true
        },

        async jwt({ token, user, trigger, session }) {

            // Updating Session 
            if (trigger === 'update' && session?.user) {
                Object.keys(session.user).forEach(key => {
                    token.userInfo[key] = session.user[key];
                });
                console.log('update working');
            };

            if (user) {
                return {
                    ...token,
                    access: user?.access,
                    refresh: user?.refresh,
                    userInfo: jwtDecode<userInfo>(user?.access)
                }

            } else if (Date.now() < token.userInfo.exp * 1000) {
                return token

            } else {
                if (!token.refresh) throw new TypeError("Missing refresh_token");

                return await refreshAccessToken(token)
            };


        },

        // @ts-ignore
        async session({ session, token, user }) {

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
        }
    }
} satisfies NextAuthConfig;