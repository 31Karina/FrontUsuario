import React, { useState } from 'react';
import '../static/css/Login.css';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          correo_electronico: correo,  // <- corregido aquí
          contrasena: contrasena
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Puedes guardar el nombre del usuario si no usas token:
        localStorage.setItem('usuario', data.usuario);
        navigate('/home'); // Asegúrate de tener esta ruta protegida
      } else {
        setMensaje('Correo o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error en login:', error);
      setMensaje('Error al conectar con el servidor');
    }
  };

  return (
    <div className="login-wrapper">
      <h1>BIENVENIDOS A SYNCHRON IA</h1>
      <div className="login-box">
        <h2>Iniciar Sesion</h2>
        <p className="subtext">Ingresa tus datos para acceder a SynchronIA</p>
        <form onSubmit={handleLogin}>
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />

          <label>Contraseña:</label>
          <input
            type="password"
            value={contrasena}
            onChange={(e) => setContrasena(e.target.value)}
            required
          />

          <button type="submit">Iniciar Sesion</button>
        </form>
        {mensaje && <p className="mensaje-error">{mensaje}</p>}
        <p>¿No tienes cuenta? <a href="/registro">Registrarse</a></p>
      </div>
    </div>
  );
}     