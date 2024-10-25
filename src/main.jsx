import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthProvider } from './context/auth-context.jsx'
import UploadImagesContextProvider from './context/upload-image-context.jsx'
import SelectImageContextProvider from './context/select-image-context.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <UploadImagesContextProvider>
          <SelectImageContextProvider>
            <Routes>
              <Route path="/*" element={<App />} />
            </Routes>
          </SelectImageContextProvider>
        </UploadImagesContextProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
)
