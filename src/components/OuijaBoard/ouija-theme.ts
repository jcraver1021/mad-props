import { createTheme } from "@mui/material/styles";

export const ouijaTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#2c1810",
      light: "#4a2818",
      dark: "#1a0f08",
    },
    secondary: {
      main: "#8b4513",
      light: "#a0522d",
      dark: "#654321",
    },
    background: {
      default: "#1a0f08",
      paper: "#2a1810",
    },
    text: {
      primary: "#d4a574",
      secondary: "#c89f6f",
    },
  },
  typography: {
    fontFamily: "'Cinzel', 'Georgia', serif",
    h3: {
      fontWeight: 700,
      letterSpacing: "0.1em",
    },
  },
});
