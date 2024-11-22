import { JwtPayload } from "jwt-decode";
import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    refreshToken: string;
    expireAt: string;
    error?: string;
    user: {
      token_type: string;
      exp: number;
      iat: number;
      jti: string;
      user_id: number;
      payload: {
        id: number;
        email: string;
        phone: string | null;
        first_name: string;
        last_name: string;
        dob: string | null;
        profile_pic: string | null
      };
    };
  }

  // interface User {
  //   access: string;
  //   refresh: string;
  //   error?: string
  //   expiresAt: number
  // }
}

declare module "next-auth/jwt" {
  interface JWT {
    access: string;
    refresh: string;
    error?: string;
    expiresAt: string | undefined;
    userInfo: {
      token_type: string;
      exp: number;
      iat: number;
      jti: string;
      user_id: number;
      payload: {
        id: number;
        email: string;
        phone: string | null;
        first_name: string;
        last_name: string;
        dob: string | null;
        profile_pic: string | null
      };
    };
    iat: number;
    exp: number;
    jti: string;
  }

}

interface userInfo extends JwtPayload {
  token_type: string;
  exp: number;
  iat: number;
  jti: string;
  user_id: number;
  payload: {
    id: number;
    email: string;
    phone: string | null;
    first_name: string;
    last_name: string;
    dob: string | null;
    profile_pic: string | null
  };
}

