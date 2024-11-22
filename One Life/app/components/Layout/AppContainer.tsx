"use client";
// import { selectThemeConfig,themeConfigSlice,} from "@/lib/redux/slices/themeConfigSlice";
import { PropsWithChildren, useEffect } from "react";
// import { useTranslation } from 'react-i18next';
// import { useDispatch, useAppSelector } from 'react-redux';
// import { IRootState } from './store';
// import { toggleRTL, toggleTheme, toggleLocale, toggleMenu, toggleLayout, toggleAnimation, toggleNavbar, toggleSemidark } from './store/themeConfigSlice';
// import { MantineProvider } from '@mantine/core';
import { selectThemeConfig, toggleAnimation, toggleLayout, toggleMenu, toggleNavbar, toggleRTL, toggleSemidark, toggleTheme } from "@/lib/features/themeConfig/themeConfigSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

function AppContainer({ children }: PropsWithChildren) {

    const themeConfig = useAppSelector(selectThemeConfig)
    // const themeConfig = useAppSelector((state: IRootState) => state.themeConfig);
    const dispatch = useAppDispatch();
    // const { i18n } = useTranslation();

    useEffect(() => {
        dispatch(toggleTheme(localStorage.getItem('theme') || themeConfig.theme));
        dispatch(toggleMenu(localStorage.getItem('menu') || themeConfig.menu));
        dispatch(toggleLayout(localStorage.getItem('layout') || themeConfig.layout));
        dispatch(toggleRTL(localStorage.getItem('rtlClass') || themeConfig.rtlClass));
        dispatch(toggleAnimation(localStorage.getItem('animation') || themeConfig.animation));
        dispatch(toggleNavbar(localStorage.getItem('navbar') || themeConfig.navbar));
        dispatch(toggleSemidark(localStorage.getItem('semidark') || themeConfig.semidark));
        // locale



    }, [dispatch, themeConfig.theme, themeConfig.menu, themeConfig.layout, themeConfig.rtlClass, themeConfig.animation, themeConfig.navbar, themeConfig.semidark]);

    return (
        <div
            className={`${(themeConfig.sidebar && 'toggle-sidebar') || ''} ${themeConfig.menu} ${themeConfig.layout} ${themeConfig.rtlClass} main-section relative font-nunito text-sm font-normal antialiased`}>
            {children}
        </div>
    );
}

export default AppContainer;
