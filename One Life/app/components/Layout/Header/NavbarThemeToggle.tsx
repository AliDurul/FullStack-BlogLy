import React from 'react'
// import { selectThemeConfig, themeConfigSlice } from '@/lib/redux/slices/themeConfigSlice';
// import { useDispatch, useAppSelector } from 'react-redux';
import { ToggleThemeDarkIcon, ToggleThemeLightIcon, ToggleThemeSystemIcon } from '@/app/icons';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectThemeConfig, toggleTheme } from '@/lib/features/themeConfig/themeConfigSlice';


const NavbarThemeToggle = () => {
 const themeConfig = useAppSelector(selectThemeConfig)
 const dispatch = useAppDispatch();
  return (
   <div>
   {themeConfig.theme === 'light' ? (
    <button
     className={`${themeConfig.theme === 'light' &&
      'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
      }`}
     onClick={() => dispatch(toggleTheme('dark'))}
    >
     <ToggleThemeLightIcon />
    </button>
   ) : (
    ''
   )}
   {themeConfig.theme === 'dark' && (
    <button
     className={`${themeConfig.theme === 'dark' &&
      'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
      }`}
     onClick={() => dispatch(toggleTheme('system'))}
    >
     <ToggleThemeDarkIcon />
    </button>
   )}
   {themeConfig.theme === 'system' && (
    <button
     className={`${themeConfig.theme === 'system' &&
      'flex items-center rounded-full bg-white-light/40 p-2 hover:bg-white-light/90 hover:text-primary dark:bg-dark/40 dark:hover:bg-dark/60'
      }`}
     onClick={() => dispatch(toggleTheme('light'))}
    >
     <ToggleThemeSystemIcon />
    </button>
   )}
  </div>
  )
}

export default NavbarThemeToggle