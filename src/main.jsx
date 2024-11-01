import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/auth-context.jsx'
import './index.css'
import StoreContextProvider from './context/store-context.jsx'
import { ThemeProvider } from './context/theme-context.jsx'
import { Toaster } from './components/ui/toaster.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <StoreContextProvider>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </StoreContextProvider>
        </AuthProvider>
        <Toaster />
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
