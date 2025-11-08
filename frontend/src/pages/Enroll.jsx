import { useMemo, useState } from 'react'
import { useNavigate, useParams, Link, useSearchParams } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { getCourseById } from '../data/courses.js'

export default function Enroll() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const course = useMemo(() => getCourseById(id), [id])
  const [enrolling, setEnrolling] = useState(false)
  const [enrolled, setEnrolled] = useState(searchParams.get('enrolled') === '1')

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
    setEnrolling(true)
    // Simulate network delay
    await new Promise(r => setTimeout(r, 800))
    setEnrolling(false)
    setEnrolled(true)
  }

  const Badge = ({ text }) => (
    <span style={{
      display: 'inline-flex', alignItems: 'center', height: 28, padding: '0 10px',
      borderRadius: 999, background: '#111827', color: '#fff', fontWeight: 600,
      fontSize: 12, letterSpacing: 0.25
    }}>{text}</span>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(1000px 400px at 50% -50%, rgba(59,130,246,0.12), transparent), #f7f8fa' }}>
      <div className="container" style={{ paddingTop: 72, paddingBottom: 72 }}>
        <div className="row justify-content-center">
          <div className="col-xxl-9 col-xl-10 col-lg-11">
            <div className="card" style={{ border: '1px solid #e5e7eb', borderRadius: 16, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.08)' }}>
              <div className="row g-0">
                <div className="col-md-5" style={{ background: `linear-gradient(135deg, ${course.color} 0%, ${course.color}99 100%)`, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 36 }}>
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 68, lineHeight: 1 }}>{course.thumbnail}</div>
                    <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <span style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 999, padding: '6px 12px', fontWeight: 700, letterSpacing: 0.5 }}>{course.category}</span>
                      <span style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 999, padding: '6px 12px', fontWeight: 700, letterSpacing: 0.5 }}>{course.level}</span>
                      <span style={{ background: 'rgba(255,255,255,0.22)', borderRadius: 999, padding: '6px 12px', fontWeight: 700, letterSpacing: 0.5 }}>{course.duration}</span>
                    </div>
                    <div style={{ marginTop: 18, background: 'rgba(255,255,255,0.28)', height: 1 }} />
                    <div style={{ marginTop: 18, fontWeight: 700, fontSize: 20 }}>Rating {course.rating} ⭐</div>
                    <div style={{ opacity: 0.95 }}>{(course.students/1000).toFixed(1)}k students</div>
                  </div>
                </div>
                <div className="col-md-7" style={{ padding: 28 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 12 }}>
                    <div>
                      <h1 style={{ margin: 0, fontSize: 36, lineHeight: 1.25 }}>{course.title}</h1>
                      <p style={{ color: '#6b7280', marginTop: 6 }}>by {course.instructor}</p>
                    </div>
                    <Link to="/" className="btn btn-outline-secondary" style={{ height: 38, padding: '6px 14px', borderRadius: 10 }}>Back</Link>
                  </div>

                  <div style={{ marginTop: 14, padding: 16, background: '#f3f4f6', borderRadius: 12 }}>
                    <p style={{ margin: 0, color: '#1f2937' }}>{course.summary}</p>
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
                    <div>
                      <div style={{ fontSize: 13, color: '#6b7280' }}>Price</div>
                      <div style={{ fontSize: 28, fontWeight: 800, color: '#10b981' }}>{course.price}</div>
                    </div>
                    {!enrolled ? (
                      <button type="button" className="btn btn-primary" style={{ padding: '10px 18px', borderRadius: 10, fontWeight: 700 }} onClick={onEnroll} disabled={enrolling}>
                        {enrolling ? 'Enrolling…' : 'Confirm Enrollment'}
                      </button>
                    ) : (
                      <div style={{ display: 'flex', gap: 10 }}>
                        <Link to={`/course/${course.id}`} className="btn btn-success" style={{ padding: '10px 18px', borderRadius: 10, fontWeight: 700 }}>Start Learning</Link>
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


