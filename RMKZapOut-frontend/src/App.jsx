import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import LoginPassword from "./pages/LoginPassword";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/password" element={<LoginPassword />} />
      </Routes>
    </BrowserRouter>
  );
}
