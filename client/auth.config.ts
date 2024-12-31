import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';
import { CredentialsSignin, Profile, User } from "next-auth"
import type { NextAuthConfig } from 'next-auth';
import { JWT } from "next-auth/jwt"
import { jwtDecode } from "jwt-decode"
import CredentialsProvider from "next-auth/providers/credentials";
import { userInfo } from './types/next-auth';

class CustomError extends CredentialsSignin {
    constructor(message: string) {
        super(message)
        this.message = message || "Custom Message: Authentication failed"
    }
    code = "custom_error"
}

type TCredentials = {
    email: string;
    password: string;
    fullname: string;
    callbackUrl: string;
};

const API_BASE_URL = process.env.API_BASE_URL;

const authenticateUser = async (url: string, body: object) => {

    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        cache: 'no-store'
    });
    // console.log('line 36-->', res);

    if (!res.ok) {
        const errorBody = await res.json();
        throw new CustomError('Response not ok. Status code: ' + res.status + '. Message: ' + errorBody.message);
    }

    const user = await res.json();

    // console.log('line 46-->', user);


    if (user.error) throw new CustomError(user.message || 'Custom Message: Authentication failed');

    return user;
};

export default {
    trustHost: true,
    providers: [
        GitHub,
        Google,
        CredentialsProvider({
            name: 'Credentials',

            authorize: async (credentials) => {

                if (!credentials) return null;

                const { email, password, fullname, callbackUrl } = credentials as TCredentials;

                const url = callbackUrl.endsWith('sign-in')
                    ? `${API_BASE_URL}/auth/login`
                    : `${API_BASE_URL}/auth/register`;

                const body = callbackUrl.endsWith('sign-in')
                    ? { email, password }
                    : { email, password, fullname };

                return await authenticateUser(url, body);

            }
        })
    ],
    callbacks: {

        async signIn({ user, account, profile, email, credentials }) {
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
                            const { node_id, email, name, avatar_url } = profile as Profile;
                            payload = { email, sub: node_id, fullname: name, picture: avatar_url };
                            break;
                        }
                        default:
                            throw new Error('Unsupported provider');
                    }
                    // cheking if user exist dont create new user return user info
                    res = await fetch(`${API_BASE_URL}/auth/register`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    });

                    if (!res.ok) {
                        const errorBody = await res.text();
                        console.error('Failed to register user. Response:', errorBody);
                        throw new Error('Something went wrong, Failed to register user.');
                    }

                    const userTokens = await res.json();

                    // console.log('userTokens--', userTokens);
                    user.access = userTokens.access;
                    user.refresh = userTokens.refresh;
                }
            } catch (error) {
                console.error("Error signing in==>", error);
                return false
            }

            return true
        },


        async jwt({ token, user }: { token: JWT, user: User }) {

            if (user) {
                token.access = user?.access
                token.refresh = user?.refresh
                token.userInfo = jwtDecode<userInfo>(user?.access);
                // console.log('jwt token==>', token);

                return token

            } else if (Date.now() < token.userInfo.exp * 1000) {

                return token

            } else {
                try {

                    const res = await fetch(`${API_BASE_URL}/auth/refresh`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ refresh: token.refresh })
                    })

                    const tokens = await res.json()

                    if (!res.ok) throw tokens

                    token.access = tokens.access

                    return token

                } catch (error) {
                    console.error("Error refreshing ==>", error);
                    return { ...token, error: "RefreshAccessTokenError" as const };
                }
            }
        },

        async session({ session, token }) {

            if (token.access) {
                const { access, refresh, userInfo, error } = token as JWT
                session.user = userInfo as any
                session.access = access
                session.refresh = refresh
                session.error = error
            }

            // console.log('session==> ', session);
            return session
        }
    }
} satisfies NextAuthConfig;