'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { verifyEmail } from '@/lib/actions/authActions';
import toast from 'react-hot-toast';
import Link from 'next/link';

const VerifyEmail = () => {
    const searchParams = useSearchParams();
    const verificationCode = searchParams.get("verification-code");
    const router = useRouter();

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState("");

    useEffect(() => {
        if (!verificationCode) return;

        let timer: NodeJS.Timeout;

        const handleVerification = async () => {
            try {
                const response = await verifyEmail(verificationCode);
                timer = setTimeout(() => {
                    if (response.success) {
                        toast.success(response.message);
                        setStatus("success");
                        router.replace("/auth/sign-in");
                    } else {
                        setStatus("error");
                        setErrorMessage(response.message);
                    }
                }, 500);

            } catch (err: unknown) {
                setStatus("error");
                setErrorMessage((err as Error).message || "Something went wrong.");
            }
        };

        handleVerification();

        return () => {
            clearTimeout(timer);
            setStatus("loading");
            setErrorMessage("");
        };
    }, [verificationCode, router]);

    // const resendVerificationCode = () => {
    //     toast.success("Verification code sent to your email!", { position: "top-right" });
    //     // TODO: Trigger actual resend logic if available
    // };

    if (status === "loading") {
        return (
            <div className="text-center">
                <span className="animate-spin border-4 border-success border-l-transparent rounded-full w-16 h-16 inline-block mb-4" />
                <p className="text-lg font-medium">Verifying your email...</p>
            </div>
        );
    }

    if (status === "error") {
        return (
            <div className="text-center">
                <h4 className="text-xl font-semibold text-primary mb-4">Verification Failed</h4>
                <p className="text-red-500 mb-4">{errorMessage}</p>
                <Link href='/auth/sign-up' className='btn-dark center mt-14'>
                    Sign up with correct email
                </Link>
            </div>
        );
    }

    return null;
};

export default VerifyEmail;
