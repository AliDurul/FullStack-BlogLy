import { ToggleHamburgerHorizontalIcon } from "@/app/icons"
import { toggleSidebar } from "@/lib/features/themeConfig/themeConfigSlice";
import { useAppDispatch } from "@/lib/hooks";
import Image from "next/image"
import Link from "next/link"

const NavbarLogo = () => {
    const dispatch = useAppDispatch();
    return (
        <div className="horizontal-logo flex items-center justify-between ltr:mr-2 rtl:ml-2 lg:hidden">
            <Link href="/" className="flex shrink-0 items-center">

                {/* One-life */}
                {/* <Image width={100} height={50} className="inline ltr:-ml-1 rtl:-mr-1" src="/assets/images/onelife-logo.png" alt="logo" /> */}
                {/* <span className="hidden align-middle text-base  font-semibold  transition-all duration-300 ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light md:inline">Own every moment</span> */}

                {/* Client-link */}
                <Image width={100} height={50} className="inline ltr:-ml-1 rtl:-mr-1" src="/assets/images/client-link.png" alt="logo" />

            </Link>
            <button
                type="button"
                className="collapse-icon  flex flex-none rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary ltr:ml-2 rtl:mr-2 dark:bg-dark/40 dark:text-[#d0d2d6] dark:hover:bg-dark/60 dark:hover:text-primary lg:hidden"
                onClick={() => dispatch(toggleSidebar())}
            >
                <ToggleHamburgerHorizontalIcon />
            </button>
        </div>
    )
}

export default NavbarLogo