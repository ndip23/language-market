import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import axios from 'axios'; 
import './index.css'
import App from './App.jsx'

// --- THE HANDSHAKE ---
// This tells the whole app to use your Render URL when live, 
// and localhost when you are developing.
axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
console.log("Elite Handshake Active. Connecting to:", axios.defaults.baseURL);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)