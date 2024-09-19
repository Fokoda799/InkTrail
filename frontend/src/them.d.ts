import '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    custom: {
      paper: string;
    };
  }
  // allow configuration using `createTheme`
  interface ThemeOptions {
    custom?: {
      paper?: string;
    };
  }
}
