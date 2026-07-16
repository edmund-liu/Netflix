import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AuthProvider } from './auth/AuthContext';
import { DownloadsProvider } from './offline/DownloadsContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <DownloadsProvider>
          <App />
        </DownloadsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
