// src/routers/initial.routes.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { App } from "../pages/App";
import { Login } from "../components/Login";
import { Register } from "../components/Register"; 

export function InitialRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<App />} />
        <Route path="/registro" element={<Register />} /> {/* <--- Nueva ruta */}
      </Routes>
    </BrowserRouter>
  );
}