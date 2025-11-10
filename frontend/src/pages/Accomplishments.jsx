import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { courseAPI, enrollmentAPI } from '../services/api.js'

export default function Accomplishments() {
  const navigate = useNavigate()
  const [certificates, setCertificates] = useState([])
  const [badges, setBadges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadAccomplishments = async () => {
      try {
        setLoading(true)
        setError('')
        
        // Load user profile from localStorage
        const userData = localStorage.getItem('user')
        if (userData) {
          const parsedUser = JSON.parse(userData)
          
          // Load enrolled courses if we have a studentId
          if (parsedUser.studentId) {
            try {
              // Try to get enrollments from API
              const enrollments = await enrollmentAPI.getEnrollmentsByStudentId(parsedUser.studentId)
              
              if (enrollments && enrollments.length > 0) {
                // Fetch full course details for each enrollment
                const coursesPromises = enrollments.map(enrollment => 
                  courseAPI.getCourseById(enrollment.courseId)
                )
                
                const enrolledCoursesData = await Promise.all(coursesPromises)
                
                // Generate certificates for completed courses (mock data)
                // In a real app, this would come from the backend
                const completedCourses = enrolledCoursesData.filter((_, index) => index % 2 === 0) // Mock: every other course is completed
                setCertificates(completedCourses.map(course => ({
                  id: `cert-${course.courseId}`,
                  courseId: course.courseId,
                  courseTitle: course.title,
                  issueDate: new Date().toLocaleDateString(),
                  certId: `LH-${Math.random().toString(36).slice(2, 10).toUpperCase()}`
                })))
                
                // Set mock badges
                setBadges([
                  { id: 'badge1', name: 'Starter', color: '#1d4ed8' },
                  { id: 'badge2', name: 'Streak 7d', color: '#0ea5a6' },
                  { id: 'badge3', name: 'Top Learner', color: '#fbbf24', textDark: true }
                ])
              }
            } catch (err) {
              console.error('Failed to fetch enrollments:', err)
              // Fall back to localStorage if API fails
              const storedCertificates = localStorage.getItem('certificates')
              if (storedCertificates) {
                setCertificates(JSON.parse(storedCertificates))
              }
            }
          }
        } else {
          // No user data found, redirect to login
          navigate('/student/signin')
        }
      } catch (err) {
        console.error('Error loading accomplishments:', err)
        setError('Failed to load your accomplishments. Please try again.')
      } finally {
        setLoading(false)
      }
    }
    
    loadAccomplishments()
  }, [navigate])

  const generateCertificateSvg = (courseTitle, studentName, issuedOn, certId) => {
    const safeCourse = (courseTitle || '').replace(/&/g, '&amp;')
    const safeName = (studentName || '').replace(/&/g, '&amp;')
    const safeDate = (issuedOn || '').replace(/&/g, '&amp;')
    const safeId = (certId || '').replace(/&/g, '&amp;')
    return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1120" height="792" viewBox="0 0 1120 792">
  <defs>
    <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
      <stop offset="0%" stop-color="#e8f0ff"/>
      <stop offset="100%" stop-color="#f6fffb"/>
    </linearGradient>
  </defs>
  <rect width="1120" height="792" fill="url(#g)"/>
  <rect x="32" y="32" width="1056" height="728" rx="24" fill="#fff" stroke="#e5e7eb"/>
  <text x="560" y="160" font-family="Segoe UI, Roboto, Arial" font-size="44" font-weight="700" fill="#111827" text-anchor="middle">Certificate of Completion</text>
  <text x="560" y="230" font-family="Segoe UI, Roboto, Arial" font-size="20" fill="#6b7280" text-anchor="middle">This certifies that</text>
  <text x="560" y="300" font-family="Segoe UI, Roboto, Arial" font-size="40" font-weight="700" fill="#0f766e" text-anchor="middle">${safeName}</text>
  <text x="560" y="360" font-family="Segoe UI, Roboto, Arial" font-size="18" fill="#6b7280" text-anchor="middle">has successfully completed the course</text>
  <text x="560" y="410" font-family="Segoe UI, Roboto, Arial" font-size="28" font-weight="700" fill="#111827" text-anchor="middle">${safeCourse}</text>
  <text x="560" y="470" font-family="Segoe UI, Roboto, Arial" font-size="16" fill="#6b7280" text-anchor="middle">Issued on ${safeDate}  •  ID: ${safeId}</text>
  <g transform="translate(380,520)">
    <rect width="360" height="80" rx="12" fill="#eef2ff" stroke="#e5e7eb"/>
    <text x="180" y="48" font-family="Segoe UI, Roboto, Arial" font-size="18" fill="#1f2937" text-anchor="middle">LearnHub Academy</text>
  </g>
</svg>`
  }

  const downloadCertificate = (cert) => {
    // Get user name from localStorage
    const userData = localStorage.getItem('user')
    const studentName = userData ? `${JSON.parse(userData).firstName} ${JSON.parse(userData).lastName}` : 'Student'
    
    const svg = generateCertificateSvg(cert.courseTitle, studentName, cert.issueDate, cert.certId)
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${cert.courseTitle.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}-certificate.svg`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    a.remove()
  }

  const viewCertificate = (cert) => {
    // Get user name from localStorage
    const userData = localStorage.getItem('user')
    const studentName = userData ? `${JSON.parse(userData).firstName} ${JSON.parse(userData).lastName}` : 'Student'
    
    const svg = generateCertificateSvg(cert.courseTitle, studentName, cert.issueDate, cert.certId)
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    // URL will be reclaimed when the tab closes; keeping it open allows preview
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa', paddingTop: 80 }}>
      <div className="container" style={{ paddingTop: 24, paddingBottom: 32 }}>
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            {/* Page Title */}
            <div className="d-flex align-items-center mb-4">
              <div style={{ width: 48, height: 48, display: 'grid', placeItems: 'center', borderRadius: 12, background: '#eef2ff', color: '#3b82f6', fontSize: 24 }}>🏆</div>
              <div className="ms-3">
                <h2 className="mb-0" style={{ lineHeight: 1.2 }}>Accomplishments</h2>
                <div style={{ color: '#6b7280', fontSize: 14 }}>Your certificates and badges</div>
              </div>
            </div>

            {/* Loading state */}
            {loading && (
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
            
            {/* Error state */}
            {!loading && error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}
            
            {/* Certificates Section */}
            {!loading && !error && (
              <div className="card" style={{ borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 10px 28px rgba(0,0,0,0.06)' }}>
                <div className="card-body">
                  <h5 className="card-title mb-4">Certificates</h5>
                  
                  {certificates.length === 0 ? (
                    <div className="text-center py-5" style={{ background: '#f9fafb', borderRadius: 12 }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#d1d5db' }}>🎓</div>
                      <h4>No certificates yet</h4>
                      <p className="text-muted">Complete courses to earn certificates</p>
                    </div>
                  ) : (
                    <div className="row g-4">
                      {certificates.map(cert => (
                        <div key={cert.id} className="col-12">
                          <div className="card" style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}>
                            <div className="card-body">
                              <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                                <div className="d-flex align-items-center gap-3">
                                  <div style={{ width: 60, height: 60, display: 'grid', placeItems: 'center', borderRadius: 8, background: '#eef2ff', color: '#3b82f6', fontSize: 28 }}>🎓</div>
                                  <div>
                                    <div className="fw-bold" style={{ fontSize: '1.1rem' }}>{cert.courseTitle}</div>
                                    <div style={{ color: '#6b7280', fontSize: '0.85rem' }}>
                                      Issued on {cert.issueDate} • ID: {cert.certId}
                                    </div>
                                  </div>
                                </div>
                                <div className="d-flex gap-2">
                                  <button 
                                    className="btn btn-outline-secondary" 
                                    style={{ borderRadius: 8 }} 
                                    onClick={() => viewCertificate(cert)}
                                  >
                                    View
                                  </button>
                                  <button 
                                    className="btn btn-primary" 
                                    style={{ borderRadius: 8 }} 
                                    onClick={() => downloadCertificate(cert)}
                                  >
                                    Download
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* Badges Section */}
            {!loading && !error && (
              <div className="card mt-4" style={{ borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 10px 28px rgba(0,0,0,0.06)' }}>
                <div className="card-body">
                  <h5 className="card-title mb-4">Badges</h5>
                  
                  {badges.length === 0 ? (
                    <div className="text-center py-5" style={{ background: '#f9fafb', borderRadius: 12 }}>
                      <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#d1d5db' }}>🏅</div>
                      <h4>No badges yet</h4>
                      <p className="text-muted">Complete activities to earn badges</p>
                    </div>
                  ) : (
                    <div className="row g-4">
                      {badges.map(badge => (
                        <div key={badge.id} className="col-12 col-md-4">
                          <div className="card h-100" style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}>
                            <div className="card-body text-center">
                              <div style={{ 
                                width: 80, 
                                height: 80, 
                                borderRadius: '50%', 
                                background: badge.color,
                                color: badge.textDark ? '#111827' : 'white',
                                fontSize: '2.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px auto'
                              }}>
                                🏅
                              </div>
                              <h5 className="fw-bold">{badge.name}</h5>
                              <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                                Earned for your achievements
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
