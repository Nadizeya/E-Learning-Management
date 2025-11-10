import { useEffect, useState } from 'react'
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { courseAPI, enrollmentAPI } from '../services/api.js'

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
      } catch (error) {
        console.error('Failed to fetch course:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseAndEnrollmentStatus()
  }, [id])

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
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 400px at 50% -50%, rgba(59,130,246,0.12), transparent), #f7f8fa' }}>
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
      
      <div className="container" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="row justify-content-center">
          <div className="col-xxl-9 col-xl-10 col-lg-11">
            <div className="card" style={{ border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>
              <div className="row g-0">
                <div className="col-md-5" style={{ 
                  background: courseThumbnail && courseThumbnail.startsWith('data:image') 
                    ? 'none' 
                    : `linear-gradient(135deg, ${courseColor} 0%, ${courseColor}99 100%)`, 
                  color: 'white', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  padding: 36,
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  {courseThumbnail && courseThumbnail.startsWith('data:image') ? (
                    <>
                      <img 
                        src={courseThumbnail} 
                        alt={course.title}
                        style={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%', 
                          height: '100%', 
                          objectFit: 'cover' 
                        }} 
                      />
                      {/* Dark overlay for better text visibility */}
                      <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        zIndex: 1
                      }} />
                    </>
                  ) : null}
                  <div style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
                    {!courseThumbnail.startsWith('data:image') && (
                      <div style={{ fontSize: 68, lineHeight: 1 }}>{courseThumbnail}</div>
                    )}
                    <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 999, padding: '6px 12px', fontWeight: 700, letterSpacing: 0.5 }}>{courseCategory}</span>
                      <span style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 999, padding: '6px 12px', fontWeight: 700, letterSpacing: 0.5 }}>{courseLevel}</span>
                      <span style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 999, padding: '6px 12px', fontWeight: 700, letterSpacing: 0.5 }}>{courseDuration}</span>
                    </div>
                    <div style={{ marginTop: 18, background: 'rgba(255,255,255,0.28)', height: 1 }} />
                    <div style={{ marginTop: 18, fontWeight: 700, fontSize: 20 }}>Status: {course.status}</div>
                    <div style={{ opacity: 0.95 }}>Course ID: {course.courseId}</div>
                  </div>
                </div>
                <div className="col-md-7" style={{ padding: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
                    <div>
                      <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.25 }}>{course.title}</h1>
                      <p style={{ color: '#6b7280', marginTop: 6 }}>by {course.instructor?.firstName} {course.instructor?.lastName}</p>
                    </div>
                    <Link to="/" className="btn btn-outline-secondary" style={{ height: 38, padding: '6px 14px', borderRadius: 10 }}>Back</Link>
                  </div>

                  <div style={{ marginTop: 14, padding: 16, background: '#f3f4f6', borderRadius: 12 }}>
                    <p style={{ margin: 0, color: '#1f2937' }}>{course.description || 'No description available'}</p>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
                    <Badge text="Projects" />
                    <Badge text="Certificate" />
                    <Badge text="Self-paced" />
                  </div>

                  <div className="row" style={{ marginTop: 14 }}>
                    <div className="col-sm-6">
                      <ul style={{ marginTop: 0, color: '#4b5563' }}>
                        <li>Hands-on projects and quizzes</li>
                        <li>Real-world case studies</li>
                        <li>Downloadable resources</li>
                      </ul>
                    </div>
                    <div className="col-sm-6">
                      <ul style={{ marginTop: 0, color: '#4b5563' }}>
                        <li>Certificate of completion</li>
                        <li>Self-paced learning</li>
                        <li>Lifetime access</li>
                      </ul>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 18, paddingTop: 16, borderTop: '1px solid #e5e7eb' }}>
                    {!isLoggedIn ? (
                      <div>
                        <button 
                          type="button" 
                          className="btn btn-primary" 
                          style={{ padding: '10px 18px', borderRadius: 10, fontWeight: 700 }} 
                          onClick={() => navigate('/student/signin')}
                        >
                          Sign In to Enroll
                        </button>
                        <p style={{ marginTop: 8, color: '#6b7280', fontSize: 14 }}>You need to be signed in to enroll in courses</p>
                      </div>
                    ) : !enrolled ? (
                      <button 
                        type="button" 
                        className="btn btn-primary" 
                        style={{ padding: '10px 18px', borderRadius: 10, fontWeight: 700 }} 
                        onClick={onEnroll} 
                        disabled={enrolling}
                      >
                        {enrolling ? 'Enrolling…' : 'Confirm Enrollment'}
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: 10 }}>
                        <Link to={`/course/${course.courseId}`} className="btn btn-success" style={{ padding: '10px 18px', borderRadius: 10, fontWeight: 700 }}>Start Learning</Link>
                        <button className="btn btn-outline-secondary" style={{ padding: '10px 18px', borderRadius: 10 }} onClick={() => navigate(-1)}>Go Back</button>
                      </div>
                    )}
                  </div>

                  <div style={{ marginTop: 18, paddingTop: 14, borderTop: '1px dashed #e5e7eb', display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span role="img" aria-label="shield">🛡️</span>
                      <span style={{ color: '#6b7280' }}>7-day money-back guarantee</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span role="img" aria-label="clock">⏱️</span>
                      <span style={{ color: '#6b7280' }}>Learn at your own pace</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span role="img" aria-label="sparkles">✨</span>
                      <span style={{ color: '#6b7280' }}>Great for beginners to intermediate</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


