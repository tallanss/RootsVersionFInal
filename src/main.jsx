import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import { ContentProvider } from './context/ContentContext'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <HelmetProvider>
      <ContentProvider>
        <App />
      </ContentProvider>
    </HelmetProvider>
  </StrictMode>,
)
