import { useState } from 'react'
import axios from 'axios'

export default function CourseModal({ course, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    categoryId: course?.categoryId || null,
    instructorId: course?.instructorId || null,
    status: course?.status || 'Draft'
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const userData = JSON.parse(localStorage.getItem('user'))
      
      // Use instructorId from the stored user data
      const payload = {
        ...formData,
        instructorId: userData.instructorId
      }

      if (course) {
        await axios.put(`http://localhost:8080/api/courses/${course.courseId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post('http://localhost:8080/api/courses', payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      onSuccess()
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save course')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{course ? 'Edit Course' : 'Create New Course'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Course Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Introduction to Web Development"
              required
            />
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe what students will learn..."
              rows="4"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category ID *</label>
              <input
                type="number"
                value={formData.categoryId || ''}
                onChange={(e) => setFormData({...formData, categoryId: parseInt(e.target.value) || null})}
                placeholder="Enter category ID"
                required
              />
              <small>Enter the category ID (e.g., 1 for Programming)</small>
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({...formData, status: e.target.value})}
              >
                <option value="Draft">Draft</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : course ? 'Update Course' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
