import React, { createContext, useState, useMemo, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
const ThemeContext = createContext();
export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState(() => localStorage.getItem('themeMode') || 'light');
  const toggleTheme = () => {
    const next = mode === 'light' ? 'dark' : 'light';
    setMode(next); localStorage.setItem('themeMode', next);
  };
  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      ...(mode === 'light'
        ? { primary:{main:'#ff9800',icon:'#757575'}, secondary:{main:'#ff5722'}, background:{default:'#f5f5f5',paper:'#fff',nav:'#fff',gray:'#2f302f'} }
        : { primary:{main:'#ff9800',icon:'#ffcc80'}, secondary:{main:'#ff5722'}, background:{default:'#2d2d2d',paper:'#424242',nav:'#333',gray:'#e0e0e0'}, text:{primary:'#ffffff',secondary:'#e0e0e0'} }),
    },
  }), [mode]);
  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
export const useThemeContext = () => useContext(ThemeContext);
