import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { UserContextProvider } from './contexts/UserContexts.jsx'
import { CourseContextProvider } from './contexts/CourseContext.jsx'

export const server = 'https://e-learning-server-5w5h.onrender.com'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserContextProvider>
      <CourseContextProvider>
        <App />
      </CourseContextProvider>
    </UserContextProvider>
  </StrictMode>,
)
