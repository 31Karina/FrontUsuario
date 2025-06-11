import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { InitialRoute } from './routers/initial.routes';
import 'bootstrap-icons/font/bootstrap-icons.css';


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <InitialRoute />
  </React.StrictMode>
);
