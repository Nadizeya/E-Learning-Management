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
      const response = await axios.get('http://localhost:8080/api/courses/instructor/my-courses', {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCourses(response.data)
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
            <div key={course.id} className="course-card">
              <div className="course-card-header">
                <div className="course-thumbnail">
                  <span className="course-emoji">📖</span>
                </div>
                <span className={`status-badge ${course.published ? 'published' : 'draft'}`}>
                  {course.published ? 'Published' : 'Draft'}
                </span>
              </div>
              <div className="course-card-body">
                <h3>{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <div className="course-meta">
                  <span className="meta-item">
                    <span className="meta-icon">📚</span>
                    {course.category}
                  </span>
                  <span className="meta-item">
                    <span className="meta-icon">📊</span>
                    {course.level}
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
                    onClick={() => handleDeleteCourse(course.id)}
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
  }, [course.id])

  const fetchModules = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:8080/api/courses/${course.id}/modules`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setModules(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleUpdateCourse = async () => {
    try {
      const token = localStorage.getItem('token')
      await axios.put(`http://localhost:8080/api/courses/${course.id}`, courseData, {
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
      await axios.delete(`http://localhost:8080/api/modules/${moduleId}`, {
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
                    <label>Category</label>
                    <input
                      type="text"
                      value={courseData.category}
                      onChange={(e) => setCourseData({...courseData, category: e.target.value})}
                    />
                  </div>
                  <div className="form-group">
                    <label>Level</label>
                    <select
                      value={courseData.level}
                      onChange={(e) => setCourseData({...courseData, level: e.target.value})}
                    >
                      <option value="BEGINNER">Beginner</option>
                      <option value="INTERMEDIATE">Intermediate</option>
                      <option value="ADVANCED">Advanced</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Price ($)</label>
                  <input
                    type="number"
                    value={courseData.price}
                    onChange={(e) => setCourseData({...courseData, price: parseFloat(e.target.value)})}
                    min="0"
                    step="0.01"
                  />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      checked={courseData.published}
                      onChange={(e) => setCourseData({...courseData, published: e.target.checked})}
                    />
                    <span>Published</span>
                  </label>
                </div>
                <button className="btn-primary" onClick={handleUpdateCourse}>
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="course-info">
                <p><strong>Description:</strong> {course.description}</p>
                <p><strong>Category:</strong> {course.category}</p>
                <p><strong>Level:</strong> {course.level}</p>
                <p><strong>Price:</strong> ${course.price}</p>
                <p><strong>Status:</strong> {course.published ? 'Published' : 'Draft'}</p>
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
                  <div key={module.id} className="module-item">
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
                        onClick={() => handleDeleteModule(module.id)}
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
            courseId={course.id}
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
