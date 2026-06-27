import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { LuxeProvider } from './context/LuxeContext.jsx'

import { BrowserRouter } from 'react-router-dom'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <LuxeProvider>
        <App />
      </LuxeProvider>
    </BrowserRouter>
  </StrictMode>,
)

