import TopPageNavigation from "@/app/components/TopPageNavigation";
import ChatMain from "./_components/ChatMain";



export default async function ChatLayout({ children, }: { children: React.ReactNode; }) {

    return (
        <>
            <TopPageNavigation />
            <ChatMain>
                {children}
            </ChatMain>
        </>
    );
}
