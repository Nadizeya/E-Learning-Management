import { useState, useEffect } from 'react'
import axios from 'axios'
import CourseModal from './CourseModal'
import ModuleModal from './ModuleModal'
import ContentModal from './ContentModal'

export default function CourseManagement() {
  const [courses, setCourses] = useState([])
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [showCreateCourse, setShowCreateCourse] = useState(false)
  const [showModuleModal, setShowModuleModal] = useState(false)
  const [showContentModal, setShowContentModal] = useState(false)
  const [selectedModule, setSelectedModule] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCourses()
  }, [])

  const fetchCourses = async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const userData = JSON.parse(localStorage.getItem('user'))
      const instructorId = userData.instructorId
      
      const response = await axios.get(`http://localhost:8080/api/courses/instructor/${instructorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCourses(response.data.data || response.data)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteCourse = async (courseId) => {
    if (!confirm('Delete this course? This action cannot be undone.')) return
    
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:8080/api/courses/${courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchCourses()
      if (selectedCourse?.id === courseId) setSelectedCourse(null)
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="course-management">
      <div className="tab-header">
        <div>
          <h1>My Courses</h1>
          <p>Create and manage your courses</p>
        </div>
        <button className="btn-primary" onClick={() => setShowCreateCourse(true)}>
          <span>+</span> Create New Course
        </button>
      </div>

      {loading ? (
        <div className="loading-state">Loading courses...</div>
      ) : courses.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📚</div>
          <h3>No courses yet</h3>
          <p>Create your first course to start teaching</p>
          <button className="btn-primary" onClick={() => setShowCreateCourse(true)}>
            Create Course
          </button>
        </div>
      ) : (
        <div className="courses-grid">
          {courses.map(course => (
            <div key={course.courseId} className="course-card">
              <div className="course-card-header">
                <div className="course-thumbnail">
                  <span className="course-emoji">📖</span>
                </div>
                <span className={`status-badge ${course.status === 'Published' ? 'published' : 'draft'}`}>
                  {course.status}
                </span>
              </div>
              <div className="course-card-body">
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span className="meta-item">
                    <span className="meta-icon">📚</span>
                    Category ID: {course.categoryId}
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">📊</span>
                    {course.status}
                  </span>
                </div>
                <div className="course-actions">
                  <button 
                    className="btn-secondary" 
                    onClick={() => setSelectedCourse(course)}
                  >
                    Manage
                  </button>
                  <button 
                    className="btn-danger" 
                    onClick={() => handleDeleteCourse(course.courseId)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showCreateCourse && (
        <CourseModal 
          onClose={() => setShowCreateCourse(false)}
          onSuccess={() => {
            setShowCreateCourse(false)
            fetchCourses()
          }}
        />
      )}

      {selectedCourse && (
        <CourseDetailsView 
          course={selectedCourse}
          onClose={() => setSelectedCourse(null)}
          onRefresh={fetchCourses}
          onOpenModule={(module) => {
            setSelectedModule(module)
            setShowContentModal(true)
          }}
        />
      )}

      {showContentModal && selectedModule && (
        <ContentModal 
          module={selectedModule}
          onClose={() => {
            setShowContentModal(false)
            setSelectedModule(null)
          }}
        />
      )}
    </div>
  )
}

function CourseDetailsView({ course, onClose, onRefresh, onOpenModule }) {
  const [modules, setModules] = useState([])
  const [showModuleModal, setShowModuleModal] = useState(false)
  const [editingCourse, setEditingCourse] = useState(false)
  const [courseData, setCourseData] = useState(course)

  useEffect(() => {
    fetchModules()
  }, [course.courseId])

  const fetchModules = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:8080/api/course-modules/course/${course.courseId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setModules(response.data.data || response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleUpdateCourse = async () => {
    try {
      const token = localStorage.getItem('token')
      const userData = JSON.parse(localStorage.getItem('user'))
      
      const payload = {
        ...courseData,
        instructorId: userData.instructorId
      }
      
      await axios.put(`http://localhost:8080/api/courses/${course.courseId}`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      alert('Course updated!')
      setEditingCourse(false)
      onRefresh()
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message))
    }
  }

  const handleDeleteModule = async (moduleId) => {
    if (!confirm('Delete this module?')) return
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:8080/api/course-modules/${moduleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchModules()
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{course.title}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="course-details">
          <div className="course-section">
            <div className="section-header">
              <h3>Course Information</h3>
              <button 
                className="btn-secondary" 
                onClick={() => setEditingCourse(!editingCourse)}
              >
                {editingCourse ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {editingCourse ? (
              <div className="edit-form">
                <div className="form-group">
                  <label>Title</label>
                  <input
                    type="text"
                    value={courseData.title}
                    onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={courseData.description}
                    onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>Category ID</label>
                    <input
                      type="number"
                      value={courseData.categoryId || ''}
                      onChange={(e) => setCourseData({...courseData, categoryId: parseInt(e.target.value) || null})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select
                      value={courseData.status}
                      onChange={(e) => setCourseData({...courseData, status: e.target.value})}
                    >
                      <option value="Draft">Draft</option>
                      <option value="Published">Published</option>
                    </select>
                  </div>
                </div>
                <button className="btn-primary" onClick={handleUpdateCourse}>
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="course-info">
                <p><strong>Description:</strong> {course.description}</p>
                <p><strong>Category ID:</strong> {course.categoryId}</p>
                <p><strong>Status:</strong> {course.status}</p>
              </div>
            )}
          </div>

          <div className="course-section">
            <div className="section-header">
              <h3>Modules ({modules.length})</h3>
              <button className="btn-primary" onClick={() => setShowModuleModal(true)}>
                + Add Module
              </button>
            </div>

            {modules.length === 0 ? (
              <div className="empty-state small">
                <p>No modules yet</p>
              </div>
            ) : (
              <div className="modules-list">
                {modules.map((module, index) => (
                  <div key={module.moduleId} className="module-item">
                    <div className="module-number">{index + 1}</div>
                    <div className="module-info">
                      <h4>{module.title}</h4>
                      <p>{module.description}</p>
                    </div>
                    <div className="module-actions">
                      <button 
                        className="btn-secondary small" 
                        onClick={() => onOpenModule(module)}
                      >
                        Contents
                      </button>
                      <button 
                        className="btn-icon" 
                        onClick={() => handleDeleteModule(module.moduleId)}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {showModuleModal && (
          <ModuleModal 
            courseId={course.courseId}
            onClose={() => setShowModuleModal(false)}
            onSuccess={() => {
              setShowModuleModal(false)
              fetchModules()
            }}
          />
        )}
      </div>
    </div>
  )
}
