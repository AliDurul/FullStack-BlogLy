import NextAuth from 'next-auth';
import authConfig from './auth.config';


export const { auth, handlers, signIn, signOut } = NextAuth({
    pages: {
        signIn: '/auth/sign-in',
        signOut: '/',
        error: '/auth-error',
    },
    secret: process.env.AUTH_SECRET,
    session: { strategy: 'jwt', maxAge:  3 * 24 * 60 * 60 }, // 3 days in seconds
    ...authConfig,
})