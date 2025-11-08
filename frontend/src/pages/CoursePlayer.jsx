import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import { courseAPI, courseModuleAPI, courseContentAPI } from '../services/api.js'

export default function CoursePlayer() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [course, setCourse] = useState(null)
  const [modules, setModules] = useState([])
  const [contents, setContents] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeContentId, setActiveContentId] = useState(null)
  const [isTheater, setIsTheater] = useState(false)

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        setLoading(true)
        // Fetch course details
        const courseData = await courseAPI.getCourseById(id)
        setCourse(courseData)
        
        // Fetch course modules
        const modulesData = await courseModuleAPI.getModulesByCourseId(id)
        setModules(modulesData)
        
        // Fetch all contents for all modules
        const allContents = []
        for (const module of modulesData) {
          const moduleContents = await courseContentAPI.getContentsByModuleId(module.moduleId)
          allContents.push(...moduleContents.map(c => ({ ...c, moduleName: module.title })))
        }
        console.log('All course contents:', allContents)
        setContents(allContents)
        
        // Set first content as active
        if (allContents.length > 0) {
          setActiveContentId(allContents[0].contentId)
          console.log('Active content set to:', allContents[0])
        } else {
          console.warn('No content found for this course')
        }
      } catch (error) {
        console.error('Failed to fetch course data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourseData()
  }, [id])

  const activeContent = contents.find(c => c.contentId === activeContentId)
  const activeIndex = contents.findIndex(c => c.contentId === activeContentId)

  if (!course) {
    return (
      <div style={{ maxWidth: 900, margin: '10vh auto', textAlign: 'left' }}>
        <h2>Course not found</h2>
        <Link to="/">Back to Home</Link>
      </div>
    )
  }

  const goPrev = () => {
    if (activeIndex > 0) setActiveContentId(contents[activeIndex - 1].contentId)
  }
  const goNext = () => {
    if (activeIndex < contents.length - 1) setActiveContentId(contents[activeIndex + 1].contentId)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f7f8fa' }}>
      <div className="container-fluid" style={{ paddingTop: 16, paddingBottom: 16 }}>
        <div className="row">
          {/* Sidebar */}
          <aside className="col-12 col-lg-3" style={{ background: '#ffffff', borderRight: '1px solid #e5e7eb', minHeight: '100vh', position: 'sticky', top: 0, padding: 0 }}>
            <div style={{ padding: 16, borderBottom: '1px solid #e5e7eb' }}>
              <Link to={`/enroll/${id}?enrolled=1`} className="btn btn-outline-secondary btn-sm" style={{ borderRadius: 8 }}>Back</Link>
              <div style={{ marginTop: 12 }}>
                <div style={{ color: '#3b82f6', fontWeight: 700, fontSize: 14 }}>{course.category?.name || 'General'}</div>
                <h5 style={{ color: '#111827', marginTop: 8, marginBottom: 0 }}>{course.title}</h5>
                <div style={{ color: '#6b7280' }}>by {course.instructor?.firstName} {course.instructor?.lastName}</div>
              </div>
            </div>
            <div style={{ padding: 8, maxHeight: 'calc(100vh - 92px)', overflowY: 'auto' }}>
              {contents.map(content => (
                <button key={content.contentId} onClick={() => setActiveContentId(content.contentId)}
                  className={`w-100 text-start btn ${content.contentId===activeContentId ? 'btn-primary' : 'btn-outline-secondary'}`}
                  style={{ marginBottom: 8, borderRadius: 10, padding: '10px 12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 600 }}>{content.title}</span>
                    <span style={{ fontSize: 12, opacity: 0.85 }}>{content.contentType}</span>
                  </div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>{content.moduleName}</div>
                </button>
              ))}
            </div>
          </aside>

          {/* Player */}
          <main className="col-12 col-lg-9" style={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div>
                <span style={{ color: '#2563eb', fontWeight: 700, fontSize: 12 }}>{course.level || 'Beginner'}</span>
                <h4 style={{ color: '#111827', marginTop: 6, marginBottom: 0 }}>{activeContent?.title || 'Select a lesson'}</h4>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline-secondary" style={{ borderRadius: 10, padding: '8px 14px' }} onClick={() => setIsTheater(v => !v)}>{isTheater ? 'Exit Theater' : 'Theater Mode'}</button>
                <button className="btn btn-outline-secondary" style={{ borderRadius: 10, padding: '8px 14px' }} onClick={goPrev} disabled={activeIndex<=0}>Previous</button>
                <button className="btn btn-primary" style={{ borderRadius: 10, padding: '8px 14px' }} onClick={goNext} disabled={activeIndex>=contents.length-1}>Next</button>
              </div>
            </div>

            <div style={{ background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', boxShadow: '0 12px 30px rgba(0,0,0,0.06)' }}>
              {activeContent?.contentType?.toUpperCase() === 'VIDEO' ? (
                <div style={isTheater ? { height: '70vh', position: 'relative' } : { position: 'relative', paddingTop: '56.25%' }}>
                  <video
                    controls
                    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: '0', background: '#000' }}
                    src={`http://localhost:8080/api/course-contents/files/${activeContent.filePath}`}
                    onError={(e) => console.error('Video load error:', e, 'URL:', e.target.src)}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              ) : activeContent?.contentType?.toUpperCase() === 'DOCUMENT' || activeContent?.contentType?.toUpperCase() === 'READING' ? (
                <div style={{ padding: 20, color: '#1f2937', lineHeight: 1.7 }}>
                  <p style={{ margin: 0, marginBottom: 12 }}><strong>Document:</strong> {activeContent.title}</p>
                  <a 
                    href={`http://localhost:8080/api/course-contents/files/${activeContent.filePath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                  >
                    Download Document
                  </a>
                </div>
              ) : (
                <div style={{ padding: 20, color: '#1f2937', lineHeight: 1.7 }}>
                  <p style={{ margin: 0 }}>{activeContent?.description || 'No content available'}</p>
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


