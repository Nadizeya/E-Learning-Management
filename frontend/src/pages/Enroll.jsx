import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { courseAPI, enrollmentAPI, courseModuleAPI, courseContentAPI, instructorAPI } from '../services/api.js'

export default function Enroll() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [loading, setLoading] = useState(true)
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(searchParams.get('enrolled') === '1')
  const [showSuccess, setShowSuccess] = useState(false)
  const [showSignInPrompt, setShowSignInPrompt] = useState(false)
  const [modules, setModules] = useState([])
  const [moduleLoading, setModuleLoading] = useState(false)
  const [courseContents, setCourseContents] = useState({})
  const [contentLoading, setContentLoading] = useState(false)
  const [instructor, setInstructor] = useState(null)
  const [instructorLoading, setInstructorLoading] = useState(false)

  // State to track if user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const fetchCourseAndEnrollmentStatus = async () => {
      try {
        setLoading(true)
        const courseData = await courseAPI.getCourseById(id)
        console.log('Fetched course:', courseData)
        setCourse(courseData)

        // Check if user is already enrolled
        const userData = localStorage.getItem('user')
        const token = localStorage.getItem('token')
        
        if (userData && token) {
          setIsLoggedIn(true)
          const user = JSON.parse(userData)
          try {
            const isEnrolled = await enrollmentAPI.checkEnrollment(user.studentId, id)
            console.log('Enrollment status:', isEnrolled)
            setEnrolled(isEnrolled)
          } catch (error) {
            console.error('Failed to check enrollment status:', error)
          }
        } else {
          setIsLoggedIn(false)
        }

        // Fetch course modules
        fetchCourseModules(id)
        
        // Fetch instructor if instructorId is available
        if (courseData.instructorId) {
          fetchInstructor(courseData.instructorId)
        }
      } catch (error) {
        console.error('Failed to fetch course:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseAndEnrollmentStatus()
  }, [id])

  // Function to fetch course modules
  const fetchCourseModules = async (courseId) => {
    try {
      setModuleLoading(true)
      const moduleData = await courseModuleAPI.getModulesByCourseId(courseId)
      console.log('Fetched modules:', moduleData)
      
      if (moduleData && moduleData.length > 0) {
        // Sort modules by order
        const sortedModules = [...moduleData].sort((a, b) => a.moduleOrder - b.moduleOrder)
        setModules(sortedModules)
        
        // Fetch content for each module
        for (const module of sortedModules) {
          fetchModuleContents(module.moduleId)
        }
      } else {
        setModules([])
      }
    } catch (error) {
      console.error('Failed to fetch modules:', error)
      setModules([])
    } finally {
      setModuleLoading(false)
    }
  }

  // Function to fetch instructor details
  const fetchInstructor = async (instructorId) => {
    try {
      setInstructorLoading(true)
      const instructorData = await instructorAPI.getInstructorById(instructorId)
      console.log(`Fetched instructor for ID ${instructorId}:`, instructorData)
      setInstructor(instructorData)
    } catch (error) {
      console.error(`Failed to fetch instructor for ID ${instructorId}:`, error)
      setInstructor(null)
    } finally {
      setInstructorLoading(false)
    }
  }

  // Function to fetch module contents
  const fetchModuleContents = async (moduleId) => {
    try {
      setContentLoading(true)
      const contentData = await courseContentAPI.getContentsByModuleId(moduleId)
      console.log(`Fetched contents for module ${moduleId}:`, contentData)
      
      if (contentData && contentData.length > 0) {
        // Sort contents by order
        const sortedContents = [...contentData].sort((a, b) => a.contentOrder - b.contentOrder)
        setCourseContents(prev => ({
          ...prev,
          [moduleId]: sortedContents
        }))
      } else {
        setCourseContents(prev => ({
          ...prev,
          [moduleId]: []
        }))
      }
    } catch (error) {
      console.error(`Failed to fetch contents for module ${moduleId}:`, error)
      setCourseContents(prev => ({
        ...prev,
        [moduleId]: []
      }))
    } finally {
      setContentLoading(false)
    }
  }

  if (!course) {
    return (
      <div style={{ maxWidth: 900, margin: '10vh auto', textAlign: 'left' }}>
        <h2>Course not found</h2>
        <p>The course you are looking for does not exist.</p>
        <Link to="/" className="btn btn-primary">Back to Home</Link>
      </div>
    )
  }

  const onEnroll = async () => {
    // Check authentication first before setting loading state
    const userData = localStorage.getItem('user')
    if (!userData) {
      // Show sign-in prompt instead of alert
      setShowSignInPrompt(true)
      return
    }
    
    setEnrolling(true)
    
    try {
      const user = JSON.parse(userData)
      
      console.log('Enrolling student:', user.studentId, 'in course:', id)
      const result = await enrollmentAPI.enrollInCourse(user.studentId, id)
      console.log('Enrollment result:', result)
      
      // Update state immediately without alert
      setEnrolled(true)
      setShowSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => setShowSuccess(false), 3000)
    } catch (error) {
      console.error('Failed to enroll:', error)
      // Only show alert on error
      alert('Failed to enroll in the course. ' + (error.message || 'Please try again.'))
    } finally {
      setEnrolling(false)
    }
  }

  const Badge = ({ text }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', height: 28, padding: '0 10px',
      borderRadius: 999, background: '#111827', color: '#fff', fontWeight: 600,
      fontSize: 12, letterSpacing: 0.25
    }}>{text}</span>
  )

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  const courseColor = course.color || '#667eea'
  const courseThumbnail = course.thumbnail || '🎓'
  const courseCategory = course.category?.name || 'General'
  const courseLevel = course.level || 'Beginner'
  const courseDuration = course.duration || '6 weeks'

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa' }}>
      {/* Success Message */}
      {showSuccess && (
        <div style={{
          position: 'fixed',
          top: 20,
          right: 20,
          zIndex: 9999,
          background: '#10b981',
          color: 'white',
          padding: '16px 24px',
          borderRadius: 12,
          boxShadow: '0 10px 40px rgba(16, 185, 129, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          fontWeight: 600,
          animation: 'slideIn 0.3s ease-out'
        }}>
          <span style={{ fontSize: 24 }}>✓</span>
          <span>Successfully enrolled in the course!</span>
        </div>
      )}
      
      {/* Sign In Prompt Modal */}
      {showSignInPrompt && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 24,
            maxWidth: 400,
            width: '90%',
            boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
            textAlign: 'center',
          }}>
            <h3 style={{ marginTop: 0, color: '#111827' }}>Sign In Required</h3>
            <p style={{ color: '#4b5563', marginBottom: 24 }}>Please sign in to enroll in this course.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button 
                onClick={() => setShowSignInPrompt(false)} 
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: 8, 
                  border: '1px solid #d1d5db',
                  backgroundColor: 'white',
                  color: '#4b5563',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Cancel
              </button>
              <button 
                onClick={() => navigate('/student/signin')} 
                style={{ 
                  padding: '8px 16px', 
                  borderRadius: 8, 
                  border: 'none',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 500,
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="container" style={{ paddingTop: 40, paddingBottom: 40, maxWidth: 1000 }}>
        {/* Header with logo and back button - simplified */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
          <div>
            {course.thumbnail && course.thumbnail.startsWith('data:image') ? (
              <img 
                src={course.thumbnail} 
                alt={course.title} 
                style={{ height: 60, width: 120, objectFit: 'contain' }}
              />
            ) : (
              <div style={{ 
                height: 60, 
                width: 120, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                fontSize: 24,
                color: '#4361ee',
                border: '1px solid #e5e7eb',
                borderRadius: 8
              }}>
                {course.thumbnail || '🎓'}
              </div>
            )}
          </div>
          <Link to="/" className="btn btn-outline-secondary" style={{ 
            height: 38, 
            padding: '6px 14px', 
            borderRadius: 6,
            border: '1px solid #e5e7eb',
            color: '#4b5563',
            background: 'white'
          }}>Back to Home</Link>
        </div>

        {/* Course Title and Info */}
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: 12, color: '#111827' }}>
            {course.title}
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#4b5563', marginBottom: 16, maxWidth: 800 }}>
            {course.description || 'No description available'}
          </p>
          
          {/* Course Stats - simplified */}
          <div style={{ display: 'flex', flexWrap: 'wrap', marginBottom: 24 }}>
            <div style={{ marginRight: 24 }}>
              <span style={{ color: '#6b7280' }}>Beginner level</span>
            </div>
            
            <div style={{ marginRight: 24 }}>
              <span style={{ color: '#6b7280' }}>2 weeks</span>
            </div>
            
            <div>
              <span style={{ color: '#6b7280' }}>Learn at your own pace</span>
            </div>
          </div>

          {/* Enroll/Start Learning Button */}
          <div style={{ marginBottom: 40 }}>
            {!isLoggedIn ? (
              <button 
                className="btn" 
                style={{ 
                  padding: '12px 24px', 
                  borderRadius: 6, 
                  fontWeight: 600,
                  fontSize: '1rem',
                  background: '#4361ee',
                  color: 'white',
                  border: 'none'
                }} 
                onClick={() => navigate('/student/signin')}
              >
                Sign In to Enroll
              </button>
            ) : !enrolled ? (
              <button 
                className="btn" 
                style={{ 
                  padding: '12px 24px', 
                  borderRadius: 6, 
                  fontWeight: 600,
                  fontSize: '1rem',
                  background: '#4361ee',
                  color: 'white',
                  border: 'none'
                }} 
                onClick={onEnroll} 
                disabled={enrolling}
              >
                {enrolling ? 'Enrolling...' : 'Enroll'}
              </button>
            ) : (
              <button 
                className="btn" 
                style={{ 
                  padding: '12px 24px', 
                  borderRadius: 6, 
                  fontWeight: 600,
                  fontSize: '1rem',
                  background: '#2e7d32',
                  color: 'white',
                  border: 'none'
                }}
                onClick={() => navigate(`/course/${course.courseId}`)}
              >
                Start Learning
              </button>
            )}
            <p style={{ marginTop: 8, color: '#6b7280', fontSize: 14 }}>
              {enrolled ? 'You are enrolled in this course' : ''}
            </p>
          </div>
        </div>

        {/* Course Content */}
        <div className="row">
          <div className="col-lg-8">
            {/* Course Series */}
            <div style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>
                {moduleLoading ? 'Loading modules...' : 
                 modules.length === 0 ? 'No modules available' : 
                 modules.length === 1 ? '1 module' : 
                 `${modules.length} modules`}
              </h2>
              <p style={{ color: '#4b5563', marginBottom: 24 }}>Course content and materials</p>
              
              {/* Module List */}
              <div style={{ background: 'white', borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                {moduleLoading ? (
                  <div style={{ padding: 24, textAlign: 'center' }}>
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p style={{ marginTop: 12, color: '#6b7280' }}>Loading course modules...</p>
                  </div>
                ) : modules.length === 0 ? (
                  <div style={{ padding: 24, textAlign: 'center' }}>
                    <p style={{ color: '#6b7280' }}>No modules available for this course yet.</p>
                  </div>
                ) : (
                  <div>
                    {modules.map((module, index) => (
                      <div key={module.moduleId} style={{ 
                        padding: '16px 24px', 
                        borderBottom: index < modules.length - 1 ? '1px solid #e5e7eb' : 'none',
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 4 }}>
                              {index + 1}. {module.title}
                            </h3>
                            <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
                              {courseContents[module.moduleId]?.length || 0} {courseContents[module.moduleId]?.length === 1 ? 'lesson' : 'lessons'}
                            </p>
                          </div>
                          <button 
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: '#4361ee', 
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                            onClick={() => {
                              if (enrolled) {
                                // If already enrolled, navigate to the course player
                                navigate(`/course/${course.courseId}`);
                              } else {
                                // If not enrolled, show enrollment prompt
                                alert('Please enroll to view content details');
                              }
                            }}
                          >
                            Details
                          </button>
                        </div>
                        
                        {/* Show first 2 contents as preview */}
                        {courseContents[module.moduleId] && courseContents[module.moduleId].slice(0, 2).map((content, i) => (
                          <div key={content.contentId} style={{ 
                            marginTop: 12,
                            marginLeft: 16,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 8,
                            color: '#6b7280',
                            fontSize: '0.9rem'
                          }}>
                            <span style={{ 
                              width: 20, 
                              height: 20, 
                              borderRadius: '50%', 
                              background: '#e5e7eb',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: 12,
                              color: '#4b5563'
                            }}>
                              {content.contentType === 'VIDEO' ? '▶' : content.contentType === 'QUIZ' ? 'Q' : 'T'}
                            </span>
                            <span>{content.title}</span>
                          </div>
                        ))}
                        
                        {/* Show more indicator if there are more contents */}
                        {courseContents[module.moduleId] && courseContents[module.moduleId].length > 2 && (
                          <div style={{ 
                            marginTop: 12,
                            marginLeft: 16,
                            color: '#6b7280',
                            fontSize: '0.9rem'
                          }}>
                            + {courseContents[module.moduleId].length - 2} more items
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            {/* What You'll Learn */}
            {modules.length > 0 && (
              <div style={{ marginBottom: 40 }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 16 }}>What you'll learn</h2>
                <div style={{ background: '#f9fafb', padding: 20, borderRadius: 12 }}>
                  <p style={{ color: '#4b5563' }}>
                    {course.description || 'This course will provide you with the skills and knowledge needed to succeed.'}
                  </p>
                  
                  {modules.length > 0 && (
                    <div style={{ marginTop: 16 }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 12 }}>Course modules include:</h3>
                      <ul style={{ paddingLeft: 20 }}>
                        {modules.slice(0, 4).map(module => (
                          <li key={module.moduleId} style={{ marginBottom: 8, color: '#4b5563' }}>
                            {module.title}
                          </li>
                        ))}
                        {modules.length > 4 && (
                          <li style={{ marginBottom: 8, color: '#4b5563' }}>And {modules.length - 4} more modules</li>
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <div className="col-lg-4">
            {/* Course Info Card */}
            <div style={{ 
              background: 'white', 
              borderRadius: 12, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              padding: 24,
              marginBottom: 24
            }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 16 }}>Course Information</h3>
              
              {course.category && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>Category</h4>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>{course.category.name || 'General'}</p>
                </div>
              )}
              
              {course.status && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>Status</h4>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>{course.status}</p>
                </div>
              )}
              
              {course.createdAt && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>Created</h4>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>
                    {new Date(course.createdAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>
            
            {/* Course Stats */}
            <div style={{ 
              background: 'white', 
              borderRadius: 12, 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              padding: 24
            }}>
              {course.level && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>Level</h4>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>{course.level}</p>
                </div>
              )}
              
              {course.duration && (
                <div style={{ marginBottom: 16 }}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>Duration</h4>
                  <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>{course.duration}</p>
                </div>
              )}
              
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 8 }}>Learning Style</h4>
                <p style={{ color: '#6b7280', margin: 0, fontSize: '0.9rem' }}>Self-paced learning</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


