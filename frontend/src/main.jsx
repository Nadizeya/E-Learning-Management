import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SignIn from './pages/SignIn.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import StudentHome from './pages/StudentHome.jsx'
import StudentSettings from './pages/StudentSettings.jsx'
import Enroll from './pages/Enroll.jsx'
import CoursePlayer from './pages/CoursePlayer.jsx'
import { AuthProvider } from './state/AuthContext.jsx'

const router = createBrowserRouter([
  { path: '/', element: <StudentHome /> },
  { path: '/signin', element: <SignIn /> },
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/enroll/:id', element: <Enroll /> },
  { path: '/course/:id', element: <CoursePlayer /> },
  { path: '/settings', element: <StudentSettings /> },
  { path: '/app', element: <App /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
