import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Global tokens/base must load before the section stylesheets imported by App.
import './styles/global.css'
import App from './App.tsx'

// Wait for web fonts (max 2.5s) so SplitText measures the real serif lines.
const fontsReady = Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 2500))])

fontsReady.then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})
