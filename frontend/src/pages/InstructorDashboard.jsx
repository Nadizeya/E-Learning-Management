import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './InstructorDashboard.css'
import CourseManagement from '../components/CourseManagement'

export default function InstructorDashboard() {
  const navigate = useNavigate()
  const [instructor, setInstructor] = useState(null)
  const [activeTab, setActiveTab] = useState('courses')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')
    const userData = localStorage.getItem('user')
    
    if (!token || userRole !== 'INSTRUCTOR' || !userData) {
      navigate('/instructor/signin')
      return
    }
    
    setInstructor(JSON.parse(userData))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    navigate('/')
  }

  return (
    <div className="instructor-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="brand">
            <span className="brand-icon">🎓</span>
            <span className="brand-name">LearnHub Instructor</span>
          </div>
          <div className="header-actions">
            <div className="user-info">
              <div className="user-avatar">
                <span>{instructor?.firstName?.charAt(0) || 'I'}</span>
              </div>
              <div className="user-details">
                <span className="user-name">{instructor?.firstName} {instructor?.lastName}</span>
                <span className="user-role">Instructor</span>
              </div>
            </div>
            <button className="btn-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </header>

      <div className="dashboard-container">
        <aside className="dashboard-sidebar">
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'courses' ? 'active' : ''}`}
              onClick={() => setActiveTab('courses')}
            >
              <span className="nav-icon">📚</span>
              My Courses
            </button>
            <button 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              <span className="nav-icon">📊</span>
              Analytics
            </button>
          </nav>
        </aside>

        <main className="dashboard-main">
          {activeTab === 'courses' && <CourseManagement />}
          {activeTab === 'analytics' && (
            <div className="analytics-tab">
              <h1>Analytics</h1>
              <p>Coming soon...</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
