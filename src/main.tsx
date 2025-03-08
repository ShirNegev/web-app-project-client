import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import App from './App.tsx';
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')!).render(
  <GoogleOAuthProvider clientId="737068141049-0d4o1tjsld1meirsqqj66c1e7u3mh6u2.apps.googleusercontent.com">
    <StrictMode>
      <App />
    </StrictMode>
  </GoogleOAuthProvider>
);
