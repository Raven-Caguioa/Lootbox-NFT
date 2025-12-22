import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { SuiProvider } from './providers/SuiProvider';
import '@mysten/dapp-kit/dist/index.css';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <SuiProvider>
      <App />
    </SuiProvider>
  </React.StrictMode>
);