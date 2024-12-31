import { NextRequest } from "next/server";
import authConfig from "./auth.config";
import NextAuth from "next-auth";

// const { auth } = NextAuth(authConfig);

import { auth } from "@/auth"

export default auth(async function middleware(req: NextRequest) {
    const { nextUrl } = req;

    // console.log(nextUrl);

    
});

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};