import Image from "next/image";
import LoginForm from "./comonents/LoginForm";

const Login = () => {
  return (
    <div className="flex min-h-screen">
      <div className="hidden lg:flex bg-primary  min-h-screen w-1/2 flex-col  items-center justify-center  text-white dark:text-black ">
        {/* <div className="mx-auto mb-5 w-full flex justify-center">
          ---
        </div> */}
        <video autoPlay muted loop className="" src="/assets/records/onelife.mp4" />
      </div>
      <div className="relative flex flex-col w-full items-center justify-between lg:w-1/2">
        <div className="max-w-[480px] my-auto p-5 md:p-10">
          <div className="flex w-full justify-center mb-9">
            <Image src="/assets/images/onelife-logo.png" alt="logo" width={300} height={25} />
          </div>
          <h2 className="mb-3 text-3xl font-bold">Sign In</h2>
          <p className="mb-7">Enter your email and password to login</p>
          <LoginForm />
        </div>
        <div className="border-t p-5 w-full border-gray-900/10 md:flex md:items-center md:justify-between ">
          <div className="flex space-x-6 md:order-2">

            <a href={'#'} className="text-gray-500 hover:text-gray-400">
              {/* <span className="sr-only">{item.name}</span> */}
              <Image src="/assets/images/paylink-logo.png" alt="facebook" width={100} height={100} />
            </a>

          </div>
          <p className="mt-8 text-xs leading-5 text-gray-400 md:order-1 md:mt-0">
            &copy; {new Date().getFullYear()} Paylink, Inc. All rights reserved.
          </p>
        </div>
      </div>

    </div>

  );
};

export default Login;
