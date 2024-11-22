import { createAppSlice } from "@/lib/createAppSlice";
import type { PayloadAction } from "@reduxjs/toolkit";
import themeConfig from '@/theme.config';


/* Types */
export interface ThemeConfigSliceState {
    isDarkMode: boolean
    sidebar: boolean
    theme: string
    menu: string
    layout: string
    rtlClass: string
    animation: string
    navbar: string
    semidark: boolean

}

const initialState: ThemeConfigSliceState = {
    isDarkMode: false,
    sidebar: false,
    theme: themeConfig.theme, // light | dark | system
    menu: themeConfig.menu,// vertical, collapsible-vertical, horizontal
    layout: themeConfig.layout,// full, boxed-layout
    rtlClass: themeConfig.rtlClass, // rtl, ltr
    animation: themeConfig.animation,// animate__fadeIn, animate__fadeInDown, animate__fadeInUp, animate__fadeInLeft, animate__fadeInRight, animate__slideInDown, animate__slideInLeft, animate__slideInRight, animate__zoomIn
    navbar: themeConfig.navbar,// navbar-sticky, navbar-floating, navbar-static
    semidark: themeConfig.semidark,

};

export const themeConfigSlice = createAppSlice({
    name: 'theme',
    initialState,
    reducers: (create) => ({
        toggleTheme: create.reducer((state, action: PayloadAction<string>) => {
            action.payload = action.payload || state.theme;
            localStorage.setItem('theme', action.payload);
            state.theme = action.payload;
            if (action.payload === 'light') { // light | dark | system
                state.isDarkMode = false;
            } else if (action.payload === 'dark') {
                state.isDarkMode = true;
            } else if (action.payload === 'system') {
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    state.isDarkMode = true;
                } else {
                    state.isDarkMode = false;
                }
            }

            if (state.isDarkMode) {
                document.querySelector('body')?.classList.add('dark');
            } else {
                document.querySelector('body')?.classList.remove('dark');
            }
        }),
        toggleMenu: create.reducer((state, action: PayloadAction<string>) => {
            action.payload = action.payload || state.menu; // vertical, collapsible-vertical, horizontal
            state.sidebar = false; // reset sidebar state
            localStorage.setItem('menu', action.payload);
            state.menu = action.payload;
        }),
        toggleLayout: create.reducer((state, action: PayloadAction<string>) => {
            action.payload = action.payload || state.layout; // full, boxed-layout
            localStorage.setItem('layout', action.payload);
            state.layout = action.payload;
        }),
        toggleRTL: create.reducer((state, action: PayloadAction<string>) => {
            action.payload = action.payload || state.rtlClass; // rtl, ltr
            localStorage.setItem('rtlClass', action.payload);
            state.rtlClass = action.payload;
            document.querySelector('html')?.setAttribute('dir', state.rtlClass || 'ltr');
        }),
        toggleAnimation: create.reducer((state, action: PayloadAction<string>) => {
            action.payload = action.payload || state.animation; // animate__fadeIn, animate__fadeInDown, animate__fadeInUp, animate__fadeInLeft, animate__fadeInRight, animate__slideInDown, animate__slideInLeft, animate__slideInRight, animate__zoomIn
            action.payload = action.payload?.trim();
            localStorage.setItem('animation', action.payload);
        }),
        toggleNavbar: create.reducer((state, action: PayloadAction<string>) => {
            action.payload = action.payload || state.navbar; // navbar-sticky, navbar-floating, navbar-static
            localStorage.setItem('navbar', action.payload);
            state.navbar = action.payload;
        }),
        toggleSemidark: create.reducer((state, action: PayloadAction<boolean | string>) => {
            action.payload = action.payload === true || action.payload === 'true' ? true : false;
            // @ts-ignore
            localStorage.setItem('semidark', action.payload);
            state.semidark = action.payload;
        }),
        toggleSidebar: create.reducer((state) => {
            state.sidebar = !state.sidebar;
        }),
        setPageTitle: create.reducer((state, action: PayloadAction<string>) => {
            document.title = `${action.payload} | VRISTO - Multipurpose Tailwind Dashboard Template`;
        }),
    }),
    selectors: {
        selectThemeConfig: (theme) => theme,
        selectIsDarkMode: (theme) => theme.isDarkMode,
        selectRtlClass: (theme) => theme.rtlClass,
        selectSidebar: (theme) => theme.sidebar,
    }
})

export const { toggleTheme, toggleMenu, toggleLayout, toggleRTL, toggleAnimation, toggleNavbar, toggleSemidark, toggleSidebar, setPageTitle } = themeConfigSlice.actions;


export const { selectThemeConfig, selectIsDarkMode, selectRtlClass, selectSidebar } = themeConfigSlice.selectors;






