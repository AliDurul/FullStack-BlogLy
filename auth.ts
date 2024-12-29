import NextAuth from 'next-auth';
import authConfig from './auth.config';


export const { auth, handlers, signIn, signOut } = NextAuth({
    pages: {
        // signIn: '/auth/sign-in',
        // signOut: '/auth/sign-out',
        // error: '/auth-error',
    },
    secret: process.env.AUTH_SECRET,
    session: { strategy: 'jwt', maxAge: 1 * 24 * 60 * 60 },
    ...authConfig,
})