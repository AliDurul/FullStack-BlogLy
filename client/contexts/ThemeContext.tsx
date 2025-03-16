import { createContext, useContext, useEffect, useState } from "react";


const ThemeContext = createContext({ theme: "light", setTheme: (theme: string) => { } });

const darkThemePreference = window.matchMedia('(prefers-color-scheme: dark)').matches;

const ThemeProvider = ({ children }: Readonly<{ children: React.ReactNode }>) => {
    // const [theme, setTheme] = useState(() => darkThemePreference ? 'dark' : 'light');
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