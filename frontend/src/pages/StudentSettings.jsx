import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { COURSES } from '../data/courses.js'

export default function StudentSettings() {
  const [profile, setProfile] = useState({ firstName: 'Alex', lastName: 'Morgan', email: 'alex@example.com' })
  const [passwords, setPasswords] = useState({ current: '', next: '', confirm: '' })
  const [notif, setNotif] = useState({ courseUpdates: true, reminders: true, promotions: false })
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeTab, setActiveTab] = useState('profile') // 'profile' | 'courses' | 'certificates' | 'progress'

  useEffect(() => {
    // Mock: pick a few enrolled courses
    setEnrolledCourses([COURSES[0], COURSES[2], COURSES[4]].filter(Boolean))
  }, [])

  const studentFullName = `${profile.firstName} ${profile.lastName}`.trim()

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

  const downloadCertificate = (courseTitle) => {
    const issued = new Date().toLocaleDateString()
    const certId = `LH-${Math.random().toString(36).slice(2, 10).toUpperCase()}`
    const svg = generateCertificateSvg(courseTitle, studentFullName, issued, certId)
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${courseTitle.replace(/[^a-z0-9]+/gi,'-').toLowerCase()}-certificate.svg`
    document.body.appendChild(a)
    a.click()
    URL.revokeObjectURL(url)
    a.remove()
  }

  const viewCertificate = (courseTitle) => {
    const issued = new Date().toLocaleDateString()
    const certId = `LH-${Math.random().toString(36).slice(2, 10).toUpperCase()}`
    const svg = generateCertificateSvg(courseTitle, studentFullName, issued, certId)
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    // URL will be reclaimed when the tab closes; keeping it open allows preview
  }

  const saveProfile = (e) => {
    e.preventDefault()
    // Persist profile to backend here
    alert('Profile saved!')
  }

  const changePassword = (e) => {
    e.preventDefault()
    if (!passwords.next || passwords.next !== passwords.confirm) {
      alert('Passwords do not match')
      return
    }
    // Persist password to backend here
    alert('Password updated!')
    setPasswords({ current: '', next: '', confirm: '' })
  }

  const saveNotifications = (e) => {
    e.preventDefault()
    // Persist notifications to backend here
    alert('Notification preferences saved!')
  }

  const Menu = () => (
    <div>
      <div className="d-flex d-md-none mb-2">
        <button className="btn btn-outline-secondary w-100" style={{ borderRadius: 10 }} onClick={() => setIsMenuOpen(v => !v)}>
          ☰ Menu
        </button>
      </div>
      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="card d-md-none mb-3" style={{ borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <div className="list-group list-group-flush">
            <button className={`list-group-item list-group-item-action ${activeTab==='profile' ? 'active' : ''}`} onClick={() => { setActiveTab('profile'); setIsMenuOpen(false) }}>Profile</button>
            <button className={`list-group-item list-group-item-action ${activeTab==='courses' ? 'active' : ''}`} onClick={() => { setActiveTab('courses'); setIsMenuOpen(false) }}>Courses</button>
            <button className={`list-group-item list-group-item-action ${activeTab==='certificates' ? 'active' : ''}`} onClick={() => { setActiveTab('certificates'); setIsMenuOpen(false) }}>Certificates</button>
            <button className={`list-group-item list-group-item-action ${activeTab==='progress' ? 'active' : ''}`} onClick={() => { setActiveTab('progress'); setIsMenuOpen(false) }}>Progress</button>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="d-none d-md-block">
        <div className="card" style={{ borderRadius: 12, border: '1px solid #e5e7eb', position: 'sticky', top: 16 }}>
          <div className="list-group list-group-flush">
            <button className={`list-group-item list-group-item-action ${activeTab==='profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>Profile</button>
            <button className={`list-group-item list-group-item-action ${activeTab==='courses' ? 'active' : ''}`} onClick={() => setActiveTab('courses')}>Courses</button>
            <button className={`list-group-item list-group-item-action ${activeTab==='certificates' ? 'active' : ''}`} onClick={() => setActiveTab('certificates')}>Certificates</button>
            <button className={`list-group-item list-group-item-action ${activeTab==='progress' ? 'active' : ''}`} onClick={() => setActiveTab('progress')}>Progress</button>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa' }}>
      {/* Page header - compact hero to match home aesthetics */}
      <div style={{ background: 'radial-gradient(900px 320px at 50% -30%, rgba(59,130,246,0.08), transparent), #ffffff', borderBottom: '1px solid #e5e7eb' }}>
        <div className="container" style={{ paddingTop: 28, paddingBottom: 20 }}>
          <div className="d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <div style={{ width: 44, height: 44, display: 'grid', placeItems: 'center', borderRadius: 12, background: '#eef2ff', color: '#3b82f6', fontSize: 22 }}>🎓</div>
              <div>
                <h2 className="mb-0" style={{ lineHeight: 1.1 }}>Settings</h2>
                <div style={{ color: '#6b7280', fontSize: 14 }}>Manage your profile, courses and achievements</div>
              </div>
            </div>
            <Link to="/" className="btn btn-outline-secondary" style={{ borderRadius: 10 }}>Back to Home</Link>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 24, paddingBottom: 32 }}>

        <div className="row g-3">
          {/* Sidebar / Hamburger */}
          <div className="col-12 col-md-3 col-lg-3">
            <Menu />
          </div>

          {/* Content area */}
          <div className="col-12 col-md-9 col-lg-9">
            {activeTab === 'profile' && (
              <div>
                <div className="card" style={{ borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 10px 28px rgba(0,0,0,0.06)' }}>
                  <div className="card-body">
                    <h5 className="card-title">Profile</h5>
                    <form onSubmit={saveProfile} className="mt-3">
                      <div className="row g-3">
                        <div className="col-12 col-sm-6">
                          <label className="form-label">First name</label>
                          <input className="form-control" value={profile.firstName} onChange={e => setProfile({ ...profile, firstName: e.target.value })} />
                        </div>
                        <div className="col-12 col-sm-6">
                          <label className="form-label">Last name</label>
                          <input className="form-control" value={profile.lastName} onChange={e => setProfile({ ...profile, lastName: e.target.value })} />
                        </div>
                        <div className="col-12">
                          <label className="form-label">Email</label>
                          <input type="email" className="form-control" value={profile.email} onChange={e => setProfile({ ...profile, email: e.target.value })} />
                        </div>
                      </div>
                      <div className="d-flex justify-content-end mt-3">
                        <button type="submit" className="btn btn-primary" style={{ borderRadius: 10 }}>Save Profile</button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="card mt-3" style={{ borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 10px 28px rgba(0,0,0,0.06)' }}>
                  <div className="card-body">
                    <h5 className="card-title">Security</h5>
                    <form onSubmit={changePassword} className="mt-2">
                      <div className="row g-3">
                        <div className="col-12 col-sm-4">
                          <label className="form-label">Current</label>
                          <input type="password" className="form-control" value={passwords.current} onChange={e => setPasswords({ ...passwords, current: e.target.value })} />
                        </div>
                        <div className="col-12 col-sm-4">
                          <label className="form-label">New</label>
                          <input type="password" className="form-control" value={passwords.next} onChange={e => setPasswords({ ...passwords, next: e.target.value })} />
                        </div>
                        <div className="col-12 col-sm-4">
                          <label className="form-label">Confirm</label>
                          <input type="password" className="form-control" value={passwords.confirm} onChange={e => setPasswords({ ...passwords, confirm: e.target.value })} />
                        </div>
                      </div>
                      <div className="d-flex justify-content-end mt-3">
                        <button type="submit" className="btn btn-primary" style={{ borderRadius: 10 }}>Update Password</button>
                      </div>
                    </form>
                  </div>
                </div>

                <div className="card mt-3" style={{ borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 10px 28px rgba(0,0,0,0.06)' }}>
                  <div className="card-body">
                    <h5 className="card-title">Notifications</h5>
                    <form onSubmit={saveNotifications} className="mt-2">
                      <div className="form-check form-switch mb-2">
                        <input className="form-check-input" type="checkbox" role="switch" id="courseUpdates" checked={notif.courseUpdates} onChange={e => setNotif({ ...notif, courseUpdates: e.target.checked })} />
                        <label className="form-check-label" htmlFor="courseUpdates">Course updates</label>
                      </div>
                      <div className="form-check form-switch mb-2">
                        <input className="form-check-input" type="checkbox" role="switch" id="reminders" checked={notif.reminders} onChange={e => setNotif({ ...notif, reminders: e.target.checked })} />
                        <label className="form-check-label" htmlFor="reminders">Study reminders</label>
                      </div>
                      <div className="form-check form-switch mb-2">
                        <input className="form-check-input" type="checkbox" role="switch" id="promotions" checked={notif.promotions} onChange={e => setNotif({ ...notif, promotions: e.target.checked })} />
                        <label className="form-check-label" htmlFor="promotions">Promotions and offers</label>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary" style={{ borderRadius: 10 }}>Save Preferences</button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'courses' && (
              <div className="card" style={{ borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 10px 28px rgba(0,0,0,0.06)' }}>
                <div className="card-body">
                  <h5 className="card-title">Enrolled Courses</h5>
                  {enrolledCourses.length === 0 && (
                    <div className="text-muted">You have not enrolled in any courses yet.</div>
                  )}
                  <div className="row g-3 mt-1">
                    {enrolledCourses.map(course => (
                      <div key={course.id} className="col-12 col-md-6">
                        <div className="card" style={{ borderRadius: 16, border: '1px solid #e5e7eb' }}>
                          <div className="card-body">
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center gap-2">
                                <div style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', borderRadius: 8, background: `linear-gradient(135deg, ${course.color} 0%, ${course.color}99 100%)`, color: '#fff', fontSize: 18 }}>{course.thumbnail}</div>
                                <div>
                                  <div className="fw-semibold" style={{ lineHeight: 1.2 }}>{course.title}</div>
                                  <div className="text-muted" style={{ fontSize: 12 }}>{course.instructor}</div>
                                </div>
                              </div>
                              <Link to={`/enroll/${course.id}`} className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8 }}>Details</Link>
                            </div>
                            <div className="mt-2" style={{ fontSize: 12 }}>
                              Progress
                            </div>
                            <div className="progress" style={{ height: 10, borderRadius: 999, background: '#e9edf2' }}>
                              <div className="progress-bar" role="progressbar" style={{ width: `${Math.floor(Math.random()*60)+20}%`, backgroundColor: '#0ea5a6' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'certificates' && (
              <div className="card" style={{ borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 10px 28px rgba(0,0,0,0.06)' }}>
                <div className="card-body">
                  <h5 className="card-title">Certificates & Badges</h5>
                  <div className="row g-3">
                    <div className="col-12 col-lg-7">
                      <h6>Certificates</h6>
                      <div className="text-muted" style={{ fontSize: 13 }}>You have 2 certificates</div>
                      <div className="mt-2 d-grid gap-2">
                        {['Intro to Computer Science', 'Data Visualization Basics'].map(title => (
                          <div key={title} className="d-flex align-items-center justify-content-between p-2" style={{ border: '1px solid #e5e7eb', borderRadius: 12 }}>
                            <div className="d-flex align-items-center gap-2">
                              <div style={{ width: 36, height: 36, display: 'grid', placeItems: 'center', borderRadius: 8, background: '#eef2ff', color: '#3b82f6' }}>📜</div>
                              <div>
                                <div className="fw-semibold">{title}</div>
                                <div className="text-muted" style={{ fontSize: 12 }}>Download your certificate</div>
                              </div>
                            </div>
                            <div className="d-flex gap-2">
                              <button className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8 }} onClick={() => viewCertificate(title)}>View</button>
                              <button className="btn btn-primary btn-sm" style={{ borderRadius: 8 }} onClick={() => downloadCertificate(title)}>Download</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <button className="btn btn-outline-secondary btn-sm mt-2" style={{ borderRadius: 8 }}>View All</button>
                    </div>
                    <div className="col-12 col-lg-5">
                      <h6>Badges</h6>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        <span className="badge" style={{ background: '#1d4ed8' }}>Starter</span>
                        <span className="badge" style={{ background: '#0ea5a6' }}>Streak 7d</span>
                        <span className="badge text-dark" style={{ background: '#fbbf24' }}>Top Reviewer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div className="card" style={{ borderRadius: 16, border: '1px solid #e5e7eb', boxShadow: '0 10px 28px rgba(0,0,0,0.06)' }}>
                <div className="card-body">
                  <h5 className="card-title">Progress Overview</h5>
                  <div className="mb-2" style={{ fontSize: 12, color: '#6b7280' }}>Overall course progress</div>
                  <div className="progress" style={{ height: 12, borderRadius: 999, background: '#e9edf2' }}>
                    <div className="progress-bar" role="progressbar" style={{ width: `${enrolledCourses.length ? 42 : 0}%`, backgroundColor: '#0ea5a6' }} aria-valuenow="42" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <div className="row g-3 mt-3">
                    {enrolledCourses.map(course => (
                      <div key={course.id} className="col-12 col-md-6">
                        <div className="card" style={{ borderRadius: 16, border: '1px solid #e5e7eb' }}>
                          <div className="card-body">
                            <div className="d-flex align-items-center gap-2">
                              <div style={{ width: 32, height: 32, display: 'grid', placeItems: 'center', borderRadius: 8, background: `linear-gradient(135deg, ${course.color} 0%, ${course.color}99 100%)`, color: '#fff', fontSize: 16 }}>{course.thumbnail}</div>
                              <div className="fw-semibold" style={{ lineHeight: 1.2 }}>{course.title}</div>
                            </div>
                            <div className="progress mt-2" style={{ height: 10, borderRadius: 999, background: '#e9edf2' }}>
                              <div className="progress-bar" role="progressbar" style={{ width: `${Math.floor(Math.random()*60)+20}%`, backgroundColor: '#0ea5a6' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


