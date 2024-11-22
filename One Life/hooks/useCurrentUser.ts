import { useSession } from "next-auth/react";

export const useCurrentUser = () => {
    const { data: session } = useSession();
    const userInfo = session?.user
    const accessToken = session?.accessToken;
    const refreshToken = session?.refreshToken;

    return { userInfo, accessToken, refreshToken };
}