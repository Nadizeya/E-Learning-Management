import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Landing.css'

export default function Landing() {
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="landing-navbar">
        <div className="container-fluid px-4">
          <div className="navbar-content">
            <a className="navbar-brand" href="/">
              <span className="brand-icon">🎓</span>
              LearnHub
            </a>
            <div className="nav-actions">
              <div className="signin-dropdown-wrapper">
                <button 
                  className="btn btn-signin"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                  Sign In
                  <span className="dropdown-arrow">{showDropdown ? '▲' : '▼'}</span>
                </button>
                {showDropdown && (
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
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="hero-background">
          <div className="hero-shape shape-1"></div>
          <div className="hero-shape shape-2"></div>
          <div className="hero-shape shape-3"></div>
        </div>
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Welcome to <span className="highlight">LearnHub</span>
            </h1>
            <p className="hero-subtitle">
              Your gateway to unlimited learning opportunities. Join thousands of students and instructors worldwide.
            </p>
            <div className="hero-buttons">
              <button 
                className="btn btn-primary-large"
                onClick={() => navigate('/student/signup')}
              >
                Get Started as Student
              </button>
              <button 
                className="btn btn-secondary-large"
                onClick={() => navigate('/instructor/signup')}
              >
                Teach on LearnHub
              </button>
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
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose LearnHub?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📚</div>
              <h3>Vast Course Library</h3>
              <p>Access thousands of courses across multiple disciplines</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🎯</div>
              <h3>Expert Instructors</h3>
              <p>Learn from industry professionals and experienced educators</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">⚡</div>
              <h3>Learn at Your Pace</h3>
              <p>Flexible learning schedules that fit your lifestyle</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🏆</div>
              <h3>Certificates</h3>
              <p>Earn recognized certificates upon course completion</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
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
