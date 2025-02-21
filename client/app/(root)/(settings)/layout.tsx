import SideNavBar from "@/components/settings/SideNavBar";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
    return (
        <div className="relative flex gap-10 px-6 py-0 m-0 max-md:flex-col">
            <SideNavBar />
            <div className="max-md:-mt-8 mt-5 w-full">
                {children}
            </div>
        </div>
    )
}
