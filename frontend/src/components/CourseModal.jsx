import { useState } from 'react'
import axios from 'axios'

export default function CourseModal({ course, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    category: course?.category || '',
    level: course?.level || 'BEGINNER',
    price: course?.price || 0,
    published: course?.published || false
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      if (course) {
        await axios.put(`http://localhost:8080/api/courses/${course.id}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await axios.post('http://localhost:8080/api/courses', formData, {
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
              <label>Category *</label>
              <input
                type="text"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                placeholder="e.g., Programming"
                required
              />
            </div>

            <div className="form-group">
              <label>Level *</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
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
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
              min="0"
              step="0.01"
            />
          </div>

          <div className="form-group checkbox-group">
            <label>
              <input
                type="checkbox"
                checked={formData.published}
                onChange={(e) => setFormData({...formData, published: e.target.checked})}
              />
              <span>Publish immediately</span>
            </label>
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
