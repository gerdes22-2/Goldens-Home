import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ImageEditProvider } from './components/ImageEditContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ImageEditProvider>
      <App />
    </ImageEditProvider>
  </StrictMode>,
);
