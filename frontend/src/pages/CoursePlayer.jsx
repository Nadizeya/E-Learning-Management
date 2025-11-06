import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { getCourseById } from '../data/courses.js'
import { getLessonsForCourse } from '../data/lessons.js'

export default function CoursePlayer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const course = useMemo(() => getCourseById(id), [id])
  const lessons = useMemo(() => getLessonsForCourse(id), [id])
  const [activeId, setActiveId] = useState(lessons[0]?.id || '')
  const active = lessons.find(l => l.id === activeId)
  const index = lessons.findIndex(l => l.id === activeId)

  useEffect(() => { if (!activeId && lessons[0]) setActiveId(lessons[0].id) }, [lessons, activeId])

  if (!course) {
    return (
      <div style={{ maxWidth: 900, margin: '10vh auto', textAlign: 'left' }}>
        <h2>Course not found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    )
  }

  const goPrev = () => {
    if (index > 0) setActiveId(lessons[index - 1].id)
  }
  const goNext = () => {
    if (index < lessons.length - 1) setActiveId(lessons[index + 1].id)
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa' }}>
      <div className="container-fluid" style={{ paddingTop: 16, paddingBottom: 16 }}>
        <div className="row">
          {/* Sidebar */}
          <aside className="col-12 col-lg-3" style={{ background: '#ffffff', borderRight: '1px solid #e5e7eb', minHeight: '100vh' }}>
            <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb' }}>
              <Link to={`/enroll/${id}?enrolled=1`} className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8 }}>Back</Link>
              <div style={{ marginTop: 12 }}>
                <div style={{ color: '#3b82f6', fontWeight: 700, fontSize: 14 }}>{course.category}</div>
                <h5 style={{ color: '#111827', marginTop: 8, marginBottom: 0 }}>{course.title}</h5>
                <div style={{ color: '#6b7280' }}>by {course.instructor}</div>
              </div>
            </div>
            <div style={{ padding: 8 }}>
              {lessons.map(l => (
                <button key={l.id} onClick={() => setActiveId(l.id)}
                  className={`w-100 text-start btn ${l.id===activeId ? 'btn-primary' : 'btn-outline-secondary'}`}
                  style={{ marginBottom: 8, borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>{l.title}</span>
                    <span style={{ fontSize: 12, opacity: 0.85 }}>{l.duration}</span>
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{l.type === 'video' ? 'Video' : 'Reading'}</div>
                </button>
              ))}
            </div>
          </aside>

          {/* Player */}
          <main className="col-12 col-lg-9" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <span style={{ color: '#2563eb', fontWeight: 700, fontSize: 12 }}>{course.level}</span>
                <h4 style={{ color: '#111827', marginTop: 6, marginBottom: 0 }}>{active?.title}</h4>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline-secondary" style={{ borderRadius: 10, padding: '8px 14px' }} onClick={goPrev} disabled={index<=0}>Previous</button>
                <button className="btn btn-primary" style={{ borderRadius: 10, padding: '8px 14px' }} onClick={goNext} disabled={index>=lessons.length-1}>Next</button>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
              {active?.type === 'video' ? (
                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                  <iframe
                    title={active.title}
                    src={active.url}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: '0' }}
                  />
                </div>
              ) : (
                <div style={{ padding: 20, color: '#1f2937', lineHeight: 1.7 }}>
                  <p style={{ margin: 0 }}>{active?.content}</p>
                </div>
              )}
            </div>

            {/* Tabs area */}
            <div style={{ marginTop: 16, display: 'flex', gap: 12 }}>
              <button className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8 }}>Overview</button>
              <button className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8 }}>Notes</button>
              <button className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8 }}>Resources</button>
              <button className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8 }}>Discussion</button>
            </div>

            {/* Notes quick area */}
            <div style={{ marginTop: 12, background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 14 }}>
              <div style={{ color: '#6b7280', marginBottom: 6, fontSize: 14 }}>Quick Note</div>
              <textarea rows={3} placeholder="Write a note for this lesson..."
                style={{ width: '100%', background: '#f9fafb', color: '#111827', border: '1px solid #e5e7eb', borderRadius: 10, padding: 10 }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="btn btn-primary btn-sm" style={{ borderRadius: 8 }}>Save Note</button>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}


