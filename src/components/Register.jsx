import React, { useState } from 'react';            
import '../static/css/Register.css';
import { useNavigate } from 'react-router-dom';
export function Register() {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (contrasena !== confirmar) {
      setMensaje('Las contraseñas no coinciden');
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/registro/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nombre_usuario: nombre,
          correo_electronico: correo,
          contrasena: contrasena,
        }),
      });

      if (response.ok) {
        setMensaje('Usuario registrado exitosamente');
        setNombre('');
        setCorreo('');
        setContrasena('');
        setConfirmar('');
        setTimeout(() => navigate('/'), 1500); 
      } else {
        const errorData = await response.json();
        setMensaje('Error: ' + JSON.stringify(errorData));
      }
    } catch (error) {
      console.error('Error en la petición:', error);
      setMensaje('Error al conectar con el servidor');
    }
  };

  return (
    <div className="register-wrapper">
      <h1>BIENVENIDOS A SYNCHRON IA</h1>
      <div className="register-box">
        <h2>Crear una cuenta</h2>
        <p className="subtext">Registra tus datos para acceder a SynchronIA</p>
        <form onSubmit={handleSubmit}>
          <label>Nombre completo:</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} required />

          <label>Correo electrónico:</label>
          <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} required />

          <label>Contraseña:</label>
          <input type="password" value={contrasena} onChange={(e) => setContrasena(e.target.value)} required />

          <label>Confirmar contraseña:</label>
          <input type="password" value={confirmar} onChange={(e) => setConfirmar(e.target.value)} required />

          <button type="submit">Registrarse</button>
        </form>
        <p className="mensaje">{mensaje}</p>
        <p>¿Ya tienes cuenta? <a href="/">Iniciar Sesion</a></p>
      </div>
    </div>
  );
}
