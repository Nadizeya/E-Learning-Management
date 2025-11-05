import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SignIn from './pages/SignIn.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import { AuthProvider } from './state/AuthContext.jsx'

const router = createBrowserRouter([
  { path: '/', element: <SignIn /> },
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/app', element: <App /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
