
export const SingleMail = () => {
    return (
        <>
            <div role="status" className="space-y-8 animate-pulse md:space-y-0 md:space-x-8 rtl:space-x-reverse w-full ">

                <div className="h-10 m-4 bg-gray-200 rounded-md dark:bg-gray-700 "></div>

                <div className="md:flex md:items-center pt-5 gap-4 p-10">
                    <div className="flex items-center justify-center w-full h-48 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                        <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                        </svg>
                    </div>
                    <div className="w-full">
                        <div className="h-4 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                        <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                        <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                        <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                        <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
                    </div>
                </div>

                <span className="sr-only">Loading...</span>
            </div>

        </>

    )
}


export function MailBoxSkeleton() {
    const messages = 15;
    return (
        // <div className="p-4 w-full mx-auto">
        //     <div className="animate-pulse space-x-4">
        //         <div className="flex-1 justify-between ">
        //             <div className="h-3 bg-slate-700"></div>
        //             <div className="h-3 bg-slate-700"></div>
        //         </div>
        //         <div className="flex-1 space-y-6 py-1">

        //             <div className="h-2 bg-slate-700 rounded"></div>

        //             <div className="space-y-3">
        //                 <div className="grid grid-cols-7 gap-4">
        //                     <div className="h-4 bg-slate-700 rounded col-span-2"></div>
        //                     <div className="h-4 bg-slate-700 rounded col-span-4"></div>
        //                     <div className="h-4 bg-slate-700 rounded col-span-1"></div>
        //                 </div>
        //                 <div className="h-2 bg-slate-700 rounded">c</div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className=" animate-pulse rounded-lg overflow-hidden">
            {/* Message list skeleton */}
            <div className="flex flex-col gap-1 p-4">
                {
                    Array.from({ length: messages }).map((_, index) => (
                        <div key={index} className="h-12 flex p-2 gap-1 border-b-2">
                            <div className=" bg-gray-300 w-6 rounded-md "></div>
                            <div className=" bg-gray-300 w-6 rounded-md "></div>
                            <div className=" bg-gray-300 w-6 rounded-md "></div>
                            <div className=" bg-gray-300 w-3/12 rounded-lg"></div>
                            <div className=" bg-gray-300 w-8/12 rounded-lg"></div>
                            <div className=" bg-gray-300 w-2/12 rounded-lg"></div>
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

