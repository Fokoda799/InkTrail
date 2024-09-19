// src/mui-theme.d.ts
import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    palette: {
      primary: {
        main: string;
      };
      background: {
        default: string;
      };
    };
  }
  // Allow configuration using `createTheme`
  interface ThemeOptions {
    palette?: {
      primary?: {
        main?: string;
      };
      background?: {
        default?: string;
      };
    };
  }
}
