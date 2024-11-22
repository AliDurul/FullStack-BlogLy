'use client'
import PerfectScrollbar from 'react-perfect-scrollbar'
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { useState, useEffect } from 'react';
import { ContactIcon, DoubleArrowIcon, FaqIcon, InvoiceIcon, MailBox, NotesIcon, ProductIcon, TicketIcon, TodoIcon } from '@/app/icons'
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectThemeConfig, toggleSidebar } from '@/lib/features/themeConfig/themeConfigSlice';
import AnimateHeight from 'react-animate-height';



const Sidebar = () => {
    const pathname: string = usePathname()
    const [currentMenu, setCurrentMenu] = useState<string>('');
    const themeConfig = useAppSelector(selectThemeConfig)
    const semidark = themeConfig.semidark
    const toggleMenu = (value: string) => {
        setCurrentMenu((oldValue) => {
            return oldValue === value ? '' : value;
        });
    };

    useEffect(() => {
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        if (selector) {
            selector.classList.add('active');
            const ul: any = selector.closest('ul.sub-menu');
            if (ul) {
                let ele: any = ul.closest('li.menu').querySelectorAll('.nav-link') || [];
                if (ele.length) {
                    ele = ele[0];
                    setTimeout(() => {
                        ele.click();
                    });
                }
            }
        }
    }, []);

    useEffect(() => {
        setActiveRoute();
        if (window.innerWidth < 1024 && themeConfig.sidebar) {
            dispatch(toggleSidebar());
        }
    }, [pathname]);

    const setActiveRoute = () => {
        let allLinks = document.querySelectorAll('.sidebar ul a.active');
        for (let i = 0; i < allLinks.length; i++) {
            const element = allLinks[i];
            element?.classList.remove('active');
        }
        const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]');
        selector?.classList.add('active');
    };

    const dispatch = useAppDispatch();

    return (
        <div className={semidark ? 'dark' : ''}>
            <nav className={`sidebar fixed top-0 bottom-0 z-50 h-full min-h-screen w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? 'text-white-dark' : ''}`}>
                <div className="h-full bg-white dark:bg-black">
                    
                    {/* One-Life */}
                    <div className="flex items-center justify-between px-4 py-3 overflow-hidden">
                        <Link href="/" className="flex shrink-0 items-center">
                            <Image className="flex-none" src="/assets/images/onelife-logo.png" alt="logo" width={80} height={80} />
                            <span className=" px-1 align-middle text-base font-semibold ltr:ml-1.5 rtl:mr-1.5 dark:text-white-light lg:inline">Assurance</span>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <DoubleArrowIcon />
                        </button>
                    </div>

                    {/* Client-Link */}
                   {/*  <div className="flex items-center justify-between px-2 py-3 overflow-hidden">
                        <Link href="/" className="flex shrink-0 items-center">
                            <Image className="flex-none" src="/assets/images/client-link.png" alt="logo" width={60} height={80} />
                            <span className=" px-1 align-middle text-base font-semibold ml-1  dark:text-white-light lg:inline">Software Company</span>
                        </Link>
                        <button
                            type="button"
                            className="collapse-icon flex h-8 w-8 items-center rounded-full transition duration-300 hover:bg-gray-500/10 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
                            onClick={() => dispatch(toggleSidebar())}
                        >
                            <DoubleArrowIcon />
                        </button>
                    </div> */}
                    
                    <PerfectScrollbar className="relative h-[calc(100vh-80px)]">
                        <ul className="relative space-y-0.5 p-4 py-0 ">

                            {/* Dashboard */}
                            <li className="menu nav-item">
                                <button type="button" className={`${currentMenu === 'dashboard' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('dashboard')}>
                                    <div className="flex items-center">
                                        <svg className="group-hover:!text-primary" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                opacity="0.5"
                                                d="M2 12.2039C2 9.91549 2 8.77128 2.5192 7.82274C3.0384 6.87421 3.98695 6.28551 5.88403 5.10813L7.88403 3.86687C9.88939 2.62229 10.8921 2 12 2C13.1079 2 14.1106 2.62229 16.116 3.86687L18.116 5.10812C20.0131 6.28551 20.9616 6.87421 21.4808 7.82274C22 8.77128 22 9.91549 22 12.2039V13.725C22 17.6258 22 19.5763 20.8284 20.7881C19.6569 22 17.7712 22 14 22H10C6.22876 22 4.34315 22 3.17157 20.7881C2 19.5763 2 17.6258 2 13.725V12.2039Z"
                                                fill="currentColor"
                                            />
                                            <path
                                                d="M9 17.25C8.58579 17.25 8.25 17.5858 8.25 18C8.25 18.4142 8.58579 18.75 9 18.75H15C15.4142 18.75 15.75 18.4142 15.75 18C15.75 17.5858 15.4142 17.25 15 17.25H9Z"
                                                fill="currentColor"
                                            />
                                        </svg>
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-white dark:group-hover:text-primary-light ">Dashboard</span>
                                    </div>

                                    <div className={currentMenu === 'dashboard' ? 'rotate-90' : 'rtl:rotate-180'}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                </button>

                                <AnimateHeight duration={300} height={currentMenu === 'dashboard' ? 'auto' : 0}>
                                    <ul className="sub-menu text-gray-500">
                                        <li>
                                            <Link href="/">Owerview</Link>
                                        </li>
                                        <li>
                                            <Link href="/analytics">Analytics</Link>
                                        </li>
                                        <li>
                                            <Link href="/finance">Finance</Link>
                                        </li>
                                    </ul>
                                </AnimateHeight>
                            </li>

                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 py-3 px-7 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <svg className="hidden h-5 w-4 flex-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                <span>Modules</span>
                            </h2>

                            {/* Modules */}
                            <li className="nav-item  ">
                                <ul>
                                    <li className="nav-item">
                                        <Link href="/invoice" className="group">
                                            <div className="flex items-center">
                                                <InvoiceIcon />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-white dark:group-hover:text-primary-light">Invoices</span>
                                            </div>
                                        </Link>
                                    </li>

                                    {/* Inbox */}
                                    <li className="menu nav-item" >
                                        <button type="button" className={`${currentMenu === 'social-media' ? 'active' : ''} nav-link group w-full`} onClick={() => toggleMenu('social-media')}>
                                            <div className="flex items-center">
                                                <MailBox />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-white dark:group-hover:text-primary-light ">Inbox</span>
                                            </div>

                                            <div className={currentMenu === 'social-media' ? 'rotate-90' : 'rtl:rotate-180'}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M9 5L15 12L9 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </div>
                                        </button>

                                        <AnimateHeight duration={300} height={currentMenu === 'social-media' ? 'auto' : 0}>
                                            <ul className="sub-menu text-gray-500">
                                                <li>
                                                    <Link href="/mailbox">Emails</Link>
                                                </li>
                                                <li>
                                                    <Link href="/chats">Chats</Link>
                                                </li>
                                                <li>
                                                    <Link href="/facebook">Facebook</Link>
                                                </li>
                                                <li>
                                                    <Link href="/instagram">Instagram</Link>
                                                </li>

                                            </ul>
                                        </AnimateHeight>
                                    </li>

                                    <li className="nav-item">
                                        <Link href="/ticket" className="group">
                                            <div className="flex items-center">
                                                <TicketIcon />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-white dark:group-hover:text-primary-light">Tickets</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/kyc" className="group">
                                            <div className="flex items-center">
                                                <ContactIcon />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-white dark:group-hover:text-primary-light">KYC</span>
                                            </div>
                                        </Link>
                                    </li>
                                    <li className="nav-item">
                                        <Link href="/product" className="group">
                                            <div className="flex items-center">
                                                <ProductIcon />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-white dark:group-hover:text-primary-light">Products</span>
                                            </div>
                                        </Link>
                                    </li>

                                    <li className="nav-item">
                                        <Link href="/voice-records" className="group">
                                            <div className="flex items-center">
                                                <ProductIcon />
                                                <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-white dark:group-hover:text-primary-light">Voice Records</span>
                                            </div>
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <h2 className="-mx-4 mb-1 flex items-center bg-white-light/30 py-3 px-7 font-extrabold uppercase dark:bg-dark dark:bg-opacity-[0.08]">
                                <svg className="hidden h-5 w-4 flex-none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                </svg>
                                <span>Apps</span>
                            </h2>
                            <li className="nav-item">
                                <Link href="/tasks" className="group">
                                    <div className="flex items-center">
                                        <TodoIcon />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-white dark:group-hover:text-primary-light">Task List</span>
                                    </div>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/notes" className="group">
                                    <div className="flex items-center">
                                        <NotesIcon />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-white dark:group-hover:text-primary-light">Notes</span>
                                    </div>
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link href="/faq" className="group">
                                    <div className="flex items-center">
                                        <FaqIcon />
                                        <span className="text-black ltr:pl-3 rtl:pr-3 dark:text-white dark:group-hover:text-primary-light">FAQ</span>
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </PerfectScrollbar>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
