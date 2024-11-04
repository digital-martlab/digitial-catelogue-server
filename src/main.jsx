import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import CustomCarousal from './components/custom-carousel.jsx'
import { Toaster } from './components/ui/toaster.jsx'
import { AuthProvider } from './context/auth-context.jsx'
import CarousalContextProvider from './context/carousel-context.jsx'
import StoreContextProvider from './context/store-context.jsx'
import { ThemeProvider } from './context/theme-context.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <CarousalContextProvider>
            <StoreContextProvider>
              <Routes>
                <Route path="/*" element={<App />} />
              </Routes>
              <CustomCarousal />
              <Toaster />
            </StoreContextProvider>
          </CarousalContextProvider>
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
)
