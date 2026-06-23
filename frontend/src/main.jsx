import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LuxeProvider } from './context/LuxeContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <LuxeProvider>
      <App />
    </LuxeProvider>
  </StrictMode>,
)

