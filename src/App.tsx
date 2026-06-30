import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/home";
import MinuteMath from "./pages/minute-math";
import Ouija from "./pages/ouija";
import { theme } from "./theme";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/minute-math" element={<MinuteMath />} />
          <Route path="/ouija" element={<Ouija />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
