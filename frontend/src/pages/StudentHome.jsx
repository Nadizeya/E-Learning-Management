import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './StudentHome.css'
import { COURSES } from '../data/courses.js'
import { courseAPI, categoryAPI } from '../services/api.js'


const CATEGORIES = ['All', 'Computer Science', 'Data Science', 'Business', 'Design']

export default function StudentHome() {
  const navigate = useNavigate()
  const [student, setStudent] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showSignInDropdown, setShowSignInDropdown] = useState(false)
  const [courses, setCourses] = useState(COURSES) // Start with mock data as fallback
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token')
    const userRole = localStorage.getItem('userRole')
    const userData = localStorage.getItem('user')
    
    if (token && userRole === 'STUDENT' && userData) {
      setIsLoggedIn(true)
      setStudent(JSON.parse(userData))
    }

    // Fetch courses from API
    const fetchCourses = async () => {
      try {
        setLoading(true)
        // Try to fetch all courses first, then filter by status
        const allCourses = await courseAPI.getAllCourses()
        console.log('Fetched courses:', allCourses)
        
        if (allCourses && allCourses.length > 0) {
          // Filter published courses
          const publishedCourses = allCourses.filter(c => c.status === 'Published')
          
          // Map backend courses to frontend format
          const mappedCourses = publishedCourses.map(course => ({
            id: course.courseId,
            title: course.title,
            instructor: course.instructor ? `${course.instructor.firstName} ${course.instructor.lastName}` : 'Instructor',
            rating: 4.5,
            students: 1000,
            price: 'Free',
            level: course.level || 'Beginner',
            duration: '6 weeks',
            category: course.category?.name || 'Computer Science',
            thumbnail: '🎓',
            color: '#667eea',
            summary: course.description || 'Learn and master new skills'
          }))
          
          console.log('Mapped courses:', mappedCourses)
          
          // Use mapped courses if available, otherwise keep mock data
          if (mappedCourses.length > 0) {
            setCourses(mappedCourses)
          } else {
            console.log('No published courses found, using mock data')
          }
        }
      } catch (error) {
        console.error('Failed to fetch courses:', error)
        console.log('Using mock data as fallback')
        // Keep using mock data on error
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    setIsLoggedIn(false)
    setStudent(null)
    navigate('/')
  }

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="student-home">
      {/* Navigation */}
      <nav className={`navbar navbar-expand-lg navbar-dark fixed-top ${isScrolled ? 'navbar-scrolled' : ''}`}>
        <div className="container-fluid px-4">
          <a className="navbar-brand" href="#">
            <span className="brand-icon">🎓</span>
            LearnHub
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="#">Explore</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">My Learning</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Career Goals</a>
              </li>
            </ul>
            <div className="d-flex align-items-center gap-3">
              {isLoggedIn ? (
                <>
                  <Link to="/settings" className="btn btn-outline-light">Settings</Link>
                  <div className="user-avatar">
                    <span>{student?.firstName?.charAt(0) || 'G'}</span>
                  </div>
                  <span className="user-name">Hi, {student?.firstName || 'Guest'}!</span>
                  <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
                </>
              ) : (
                <div className="signin-dropdown-wrapper">
                  <button 
                    className="btn btn-signin-nav"
                    onClick={() => setShowSignInDropdown(!showSignInDropdown)}
                  >
                    Sign In
                    <span className="dropdown-arrow">{showSignInDropdown ? '▲' : '▼'}</span>
                  </button>
                  {showSignInDropdown && (
                    <div className="signin-dropdown">
                      <button 
                        className="dropdown-item"
                        onClick={() => navigate('/student/signin')}
                      >
                        <span className="item-icon">👨‍🎓</span>
                        Sign in as Student
                      </button>
                      <button 
                        className="dropdown-item"
                        onClick={() => navigate('/instructor/signin')}
                      >
                        <span className="item-icon">👨‍🏫</span>
                        Sign in as Instructor
                      </button>
                    </div>
                  )}
                </div>
              )}
              <Link to="/signin" className="btn btn-outline-light">Admin Sign In</Link>
              <Link to="/admin" className="btn btn-primary">Admin Dashboard</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        <div className="container">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <div className="hero-content">
                <h1 className="hero-title">
                  Learn <span className="highlight">Without Limits</span>
                </h1>
                <p className="hero-subtitle">
                  Start, switch, or advance your career with thousands of courses from world-class instructors
                </p>
                <div className="search-container">
                  <div className="input-group search-input-group">
                    <span className="input-group-text">
                      <i className="search-icon">🔍</i>
                    </span>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="What do you want to learn today?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="btn btn-search">Search</button>
                  </div>
                </div>
                <div className="hero-stats">
                  <div className="stat-item">
                    <span className="stat-number">10K+</span>
                    <span className="stat-label">Courses</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">50K+</span>
                    <span className="stat-label">Students</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-number">200+</span>
                    <span className="stat-label">Instructors</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Course Catalog */}
      <section className="section course-catalog">
        <div className="container">
          {/* Quick Links */}
          <div className="row g-3 mb-3">
            <div className="col-12 col-md-4">
              <div className="card" style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div>
                    <div className="text-muted" style={{ fontSize: 12 }}>Account</div>
                    <div className="fw-bold">Student Settings</div>
                  </div>
                  <Link to="/settings" className="btn btn-outline-secondary" style={{ borderRadius: 10 }}>Open</Link>
                </div>
              </div>
            </div>
          </div>
          <div className="section-header">
            <h2 className="section-title">
              <span className="section-icon">📚</span>
              {selectedCategory === 'All' ? 'All Courses' : selectedCategory}
            </h2>
          </div>

          {/* Categories */}
          <div className="categories-filter">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`category-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
                {selectedCategory === cat && <span className="active-indicator"></span>}
              </button>
            ))}
          </div>

          <div className="row g-4">
            {filteredCourses.map(course => (
              <div key={course.id} className="col-12 col-sm-6 col-lg-4">
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section cta-section">
        <div className="container">
          <div className="cta-content text-center">
            <h2>Ready to Start Learning?</h2>
            <p>Join thousands of students achieving their goals</p>
            <button className="btn btn-cta">Get Started Today</button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-brand">
              <span className="brand-icon">🎓</span>
              <span className="brand-name">LearnHub</span>
            </div>
            <p className="footer-tagline">Empowering learners worldwide ✨</p>
            <div className="footer-links">
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Help</a>
              <a href="#">Privacy</a>
            </div>
            <p className="footer-copyright">© 2025 LearnHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Course Card Component
function CourseCard({ course }) {
  const [isHovered, setIsHovered] = useState(false)
  const navigate = useNavigate()

  return (
    <div 
      className="card course-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="card-inner">
        <div 
          className="course-thumbnail"
          style={{ background: `linear-gradient(135deg, ${course.color} 0%, ${course.color}99 100%)` }}
        >
          <span className="thumbnail-emoji">{course.thumbnail}</span>
          <span className={`badge level-badge ${course.level.toLowerCase()}`}>{course.level}</span>
          <div className={`hover-overlay ${isHovered ? 'active' : ''}`}>
            <button className="btn-preview">Quick Preview</button>
          </div>
        </div>
        <div className="card-body">
          <span className="category-tag">{course.category}</span>
          <h5 className="card-title">{course.title}</h5>
          <p className="instructor">{course.instructor}</p>
          <div className="course-meta">
            <div className="rating">
              <span className="stars">⭐</span>
              <span className="rating-value">{course.rating}</span>
            </div>
            <div className="students">
              <span className="student-icon">👥</span>
              <span className="student-count">{(course.students / 1000).toFixed(1)}k</span>
            </div>
            <div className="duration">
              <span className="duration-icon">⏱️</span>
              <span className="duration-value">{course.duration}</span>
            </div>
          </div>
          <div className="card-footer">
            <span className="price">{course.price}</span>
            <button className="btn-enroll" onClick={() => navigate(`/enroll/${course.id}`)}>
              Enroll Now
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}