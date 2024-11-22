export const ChatListSkeleton = () => {


    return (
        <div className="animate-pulse flex flex-col gap-4">
            <div className="h-8 bg-gray-200  w-full mb-2 relative">
                <svg className="absolute top-1/2 -translate-y-1/2 right-2 size-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="11.5" cy="11.5" r="9.5" stroke="#000" strokeWidth="1.5" opacity="0.5"></circle>
                    <path d="M18.5 18.5L22 22" stroke="#000" strokeWidth="1.5" strokeLinecap="round"></path>
                </svg>
            </div>

            {Array(10).fill(null).map((_, index) => (
                <div key={index} className="flex gap-2 justify-between items-center">
                    <div className="bg-gray-300 size-12 rounded-full" />
                    <div className="h-10 bg-gray-300 flex-1 rounded-md" />
                </div>
            ))}
        </div>
    );
};

