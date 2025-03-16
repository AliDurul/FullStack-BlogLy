import { createContext, useContext, useEffect, useState } from "react";


const ThemeContext = createContext({ theme: "light", setTheme: (theme: string) => { } });

const getInitialTheme = () => {
    if (typeof window !== 'undefined') {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light'; // Default theme for SSR
};

const ThemeProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    // const [theme, setTheme] = useState(() => getInitialTheme());
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');


    useEffect(() => {
        document.body.setAttribute('data-theme', theme);
    }, [])


    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    )
};

export const useThemeContext = () => {
    return useContext(ThemeContext)
};

export default ThemeProvider;