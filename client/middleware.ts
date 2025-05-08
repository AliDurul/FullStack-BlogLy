import { auth } from "@/auth"
import { NextResponse } from 'next/server';
import { apiAuthPrefix, authRoutes, publicRoutes } from "./lib/routes";

export default auth(async function middleware(req) {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth;
    const userInfo = req.auth?.user;

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname) || nextUrl.pathname.startsWith('/blog') || nextUrl.pathname.startsWith('/user');
    const isAuthRoute = authRoutes.some(route => nextUrl.pathname.startsWith(route));

    if (isApiAuthRoute) return;

    if (isAuthRoute) {
        if (isLoggedIn) return NextResponse.redirect(new URL('/', nextUrl));
        return;
    }

    if (!isLoggedIn && !isPublicRoute) {
        return NextResponse.redirect(new URL('/auth/sign-in', nextUrl));
    }

    return;
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};