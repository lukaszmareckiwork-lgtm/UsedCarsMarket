import { StrictMode } from 'react'
import ReactDOM from "react-dom/client";
// import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.tsx'
import { MakesProvider } from './context/MakesContext.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <MakesProvider>
        <App />
      </MakesProvider>
    </BrowserRouter>
  </StrictMode>,
)
