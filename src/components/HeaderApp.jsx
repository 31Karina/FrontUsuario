import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../static/css/HeaderApp.css';

export function HeaderApp() {
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const navigate = useNavigate();

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <header className="header-app">
      <h1 className="titulo-app">SYNCHRON IA</h1>
      <div className="menu-container">
        <button className="boton-menu" onClick={() => setMostrarMenu(!mostrarMenu)}>
          &#x25B2;
        </button>
        {mostrarMenu && (
          <div className="dropdown-menu">
            <button onClick={cerrarSesion}>Cerrar sesión</button>
          </div>
        )}
      </div>
    </header>
  );
}
