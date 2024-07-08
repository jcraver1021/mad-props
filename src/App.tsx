import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Example from "./pages/example";
import Home from "./pages/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/example" element={<Example />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
