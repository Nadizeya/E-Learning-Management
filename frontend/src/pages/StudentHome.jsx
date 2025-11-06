import { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './StudentHome.css'

// Mock course data
const MOCK_COURSES = [
  {
    id: 1,
    title: 'Web Application Development',
    instructor: 'Dr. Sarah Johnson',
    rating: 4.8,
    students: 12500,
    price: 'Free',
    level: 'Beginner',
    duration: '6 weeks',
    category: 'Computer Science',
    thumbnail: '🌐',
    color: '#667eea',
  },
  {
    id: 2,
    title: 'Machine Learning Fundamentals',
    instructor: 'Prof. Michael Chen',
    rating: 4.9,
    students: 25000,
    price: 'Free',
    level: 'Intermediate',
    duration: '8 weeks',
    category: 'Data Science',
    thumbnail: '🤖',
    color: '#f093fb',
  },
  {
    id: 3,
    title: 'Digital Marketing Strategy',
    instructor: 'Emma Williams',
    rating: 4.7,
    students: 8900,
    price: 'Free',
    level: 'Beginner',
    duration: '4 weeks',
    category: 'Business',
    thumbnail: '📱',
    color: '#4facfe',
  },
  {
    id: 4,
    title: 'Python for Data Science',
    instructor: 'Dr. James Lee',
    rating: 4.8,
    students: 18000,
    price: 'Free',
    level: 'Beginner',
    duration: '5 weeks',
    category: 'Data Science',
    thumbnail: '🐍',
    color: '#43e97b',
  },
  {
    id: 5,
    title: 'UI/UX Design Principles',
    instructor: 'Lisa Anderson',
    rating: 4.9,
    students: 15000,
    price: 'Free',
    level: 'Beginner',
    duration: '6 weeks',
    category: 'Design',
    thumbnail: '🎨',
    color: '#fa709a',
  },
  {
    id: 6,
    title: 'Cloud Computing with AWS',
    instructor: 'Robert Martinez',
    rating: 4.7,
    students: 10500,
    price: 'Free',
    level: 'Advanced',
    duration: '10 weeks',
    category: 'Computer Science',
    thumbnail: '☁️',
    color: '#a8edea',
  },
  {
    id: 7,
    title: 'Financial Markets',
    instructor: 'Prof. David Brown',
    rating: 4.8,
    students: 22000,
    price: 'Free',
    level: 'Beginner',
    duration: '7 weeks',
    category: 'Business',
    thumbnail: '💰',
    color: '#ffecd2',
  },
  {
    id: 8,
    title: 'Mobile App Development',
    instructor: 'Jennifer Taylor',
    rating: 4.6,
    students: 9800,
    price: 'Free',
    level: 'Intermediate',
    duration: '8 weeks',
    category: 'Computer Science',
    thumbnail: '📱',
    color: '#ff9a9e',
  }
]

const CATEGORIES = ['All', 'Computer Science', 'Data Science', 'Business', 'Design']

export default function StudentHome() {
  const [student] = useState({ firstName: 'Alex' })
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    setEnrolledCourses([MOCK_COURSES[0], MOCK_COURSES[3]])
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const filteredCourses = MOCK_COURSES.filter(course => {
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
              <div className="user-avatar">
                <span>{student?.firstName?.charAt(0) || 'G'}</span>
              </div>
              <span className="user-name">Hi, {student?.firstName || 'Guest'}!</span>
              <button className="btn btn-logout">Logout</button>
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

      {/* Continue Learning */}
      {enrolledCourses.length > 0 && (
        <section className="section enrolled-courses">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                <span className="section-icon">⚡</span>
                Continue Learning
              </h2>
              <a href="#" className="view-all">View All</a>
            </div>
            <div className="row g-4">
              {enrolledCourses.map(course => (
                <div key={course.id} className="col-md-6 col-lg-4">
                  <EnrolledCourseCard course={course} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Course Catalog */}
      <section className="section course-catalog">
        <div className="container">
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
              <div key={course.id} className="col-sm-6 col-md-4 col-lg-3">
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
            <button className="btn-enroll">
              Enroll Now
              <span className="btn-arrow">→</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Enrolled Course Card Component
function EnrolledCourseCard({ course }) {
  const progress = Math.floor(Math.random() * 100)
  
  return (
    <div className="card enrolled-course-card">
      <div className="enrolled-thumbnail">
        <div 
          className="thumbnail-background"
          style={{ background: `linear-gradient(135deg, ${course.color} 0%, ${course.color}99 100%)` }}
        >
          <span className="thumbnail-emoji">{course.thumbnail}</span>
        </div>
        <div className="progress-overlay">
          <div className="progress-text">{progress}% Complete</div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
      <div className="card-body">
        <h6 className="card-title">{course.title}</h6>
        <p className="instructor">{course.instructor}</p>
        <div className="course-info">
          <span className="info-item">{course.duration}</span>
          <span className="info-item">{course.level}</span>
        </div>
        <button className="btn-continue">
          Continue Learning
          <span className="btn-icon">→</span>
        </button>
      </div>
    </div>
  )
}