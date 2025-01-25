import { auth } from "@/auth"
import { apiAuthPrefix, authRoutes, publicRoutes } from "./lib/routes";

export default auth(async function middleware(req) {
    const { nextUrl } = req;
    const isLoggedIn = !!req.auth
    const userInfo = req.auth?.user;
    // console.log('path==>', nextUrl.pathname);

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname) || nextUrl.pathname.startsWith('/search');
    const isAuthRoute = authRoutes.includes(nextUrl.pathname);

    if (isApiAuthRoute) return;

    if (isAuthRoute) {
        
        // if (isLoggedIn) return Response.redirect(new URL('/', nextUrl));

        return;
    }

    // if (!isLoggedIn && !isPublicRoute) return Response.redirect(new URL('/auth/sign-in', nextUrl));


    return;

});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};