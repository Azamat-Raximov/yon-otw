import { useEffect } from 'react';
import { useTheme } from 'next-themes';

const THEME_AUTO_SET_KEY = 'yon-theme-auto-set';

export const useAutoTheme = () => {
  const { setTheme, theme } = useTheme();

  useEffect(() => {
    // Check if we've already auto-set the theme this session
    const hasAutoSet = sessionStorage.getItem(THEME_AUTO_SET_KEY);
    
    // Only auto-set on first visit of the session
    if (hasAutoSet) return;

    const hour = new Date().getHours();
    
    // 6 AM to 5:59 PM = light mode
    // 6 PM to 5:59 AM = dark mode
    const shouldBeDark = hour < 6 || hour >= 18;
    const targetTheme = shouldBeDark ? 'dark' : 'light';

    setTheme(targetTheme);
    sessionStorage.setItem(THEME_AUTO_SET_KEY, 'true');
  }, [setTheme]);

  return { theme };
};
