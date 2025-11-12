import { useState } from 'react'
import apiClient from '../api/apiClient'

export default function ModuleModal({ courseId, module, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    courseId: courseId,
    title: module?.title || '',
    description: module?.description || '',
    moduleOrder: module?.moduleOrder || 0
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      if (module) {
        await apiClient.put(`/course-modules/${module.moduleId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await apiClient.post(`/course-modules`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
      onSuccess()
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{module ? 'Edit Module' : 'Create Module'}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Module Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Introduction to HTML"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="What will students learn in this module?"
              rows="3"
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : module ? 'Update Module' : 'Create Module'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
