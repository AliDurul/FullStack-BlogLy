import NextAuth from 'next-auth';
import authConfig from './auth.config';


export const { auth, handlers, signIn, signOut } = NextAuth({
    pages: {
        signIn: '/sign-in',
        signOut: '/sign-out',
        error: '/auth-error',
    },
    secret: process.env.AUTH_SECRET,
    session: { strategy: 'jwt', maxAge: 1 * 24 * 60 * 60 },
    ...authConfig,
})