import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SignIn from './pages/SignIn.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import StudentSignIn from './pages/StudentSignIn.jsx'
import StudentSignUp from './pages/StudentSignUp.jsx'
import InstructorSignIn from './pages/InstructorSignIn.jsx'
import InstructorSignUp from './pages/InstructorSignUp.jsx'
import InstructorDashboard from './pages/InstructorDashboard.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import StudentHome from './pages/StudentHome.jsx'
import Enroll from './pages/Enroll.jsx'
import CoursePlayer from './pages/CoursePlayer.jsx'
import MyCourses from './pages/MyCourses.jsx'
import Accomplishments from './pages/Accomplishments.jsx'
import CertificateViewPage from './pages/CertificateViewPage.jsx'
import VerifyCertificate from './pages/VerifyCertificate.jsx'
import { AuthProvider } from './state/AuthContext.jsx'
import ForgotPassword from './pages/ForgotPassword.jsx'
import ResetPassword from './pages/ResetPassword.jsx'
import StudentSettings from './pages/StudentSettings.jsx'

const router = createBrowserRouter([
  { path: '/', element: <StudentHome /> },
  { path: '/signin', element: <SignIn /> },
  { path: '/admin/login', element: <AdminLogin /> },
  { path: '/student/signin', element: <StudentSignIn /> },
  { path: '/student/signup', element: <StudentSignUp /> },
  { path: '/instructor/signin', element: <InstructorSignIn /> },
  { path: '/instructor/signup', element: <InstructorSignUp /> },
  { path: '/instructor/dashboard', element: <InstructorDashboard /> },
  { path: '/admin', element: <AdminDashboard /> },
  { path: '/enroll/:id', element: <Enroll /> },
  { path: '/course-player/:id', element: <CoursePlayer /> },
  { path: '/my-courses', element: <MyCourses /> },
  { path: '/accomplishments', element: <Accomplishments /> },
  { path: '/student/settings', element: <StudentSettings /> },
  { path: '/forgot-password', element: <ForgotPassword /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/certificate/:id', element: <CertificateViewPage /> },
  { path: '/verify-certificate/:code', element: <VerifyCertificate /> },
  { path: '/verify-certificate', element: <VerifyCertificate /> },
  { path: '/app', element: <App /> },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>,
)
