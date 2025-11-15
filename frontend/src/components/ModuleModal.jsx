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
      let updatedId = module?.moduleId
      if (module) {
        await apiClient.put(`/course-modules/${module.moduleId}`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        const res = await apiClient.post(`/course-modules`, formData, {
          headers: { Authorization: `Bearer ${token}` }
        })
        updatedId = res?.data?.data?.moduleId || res?.data?.moduleId || updatedId
      }
      onSuccess(updatedId)
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        backdropFilter: 'blur(3px)'
      }}
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 30px 60px rgba(0,0,0,0.12)',
          width: '92%',
          maxWidth: '520px',
          maxHeight: '90vh',
          overflowY: 'auto',
          animation: 'slideUp 0.28s ease-out'
        }}
      >
        <div
          className="modal-header"
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #eef2ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
            borderTopLeftRadius: '12px',
            borderTopRightRadius: '12px'
          }}
        >
          <h3 style={{ margin: 0, color: 'white', fontSize: '22px', fontWeight: 700 }}>{module ? '✏️ Edit Module' : '➕ Create Module'}</h3>
          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'rgba(255,255,255,0.18)',
              color: 'white',
              fontSize: 22,
              width: 44,
              height: 44,
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'transform 0.12s ease, background 0.12s ease',
              boxShadow: 'none'
            }}
            onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.background = 'rgba(255,255,255,0.26)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.18)'; }}
            onFocus={(e) => { e.currentTarget.style.boxShadow = '0 0 0 4px rgba(102,126,234,0.12)'; }}
            onBlur={(e) => { e.currentTarget.style.boxShadow = 'none'; }}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '22px' }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
              Module Title <span style={{ color: '#ef4444' }}>*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Introduction to HTML"
              required
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937',
                backgroundColor: '#fff',
                boxSizing: 'border-box',
                transition: 'all 0.15s'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#667eea'; e.target.style.boxShadow = '0 0 0 4px rgba(102,126,234,0.08)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#1f2937', marginBottom: '8px' }}>
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="What will students learn in this module?"
              rows="4"
              style={{
                width: '100%',
                padding: '12px 14px',
                border: '2px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                color: '#1f2937',
                backgroundColor: '#fff',
                boxSizing: 'border-box',
                transition: 'all 0.15s',
                resize: 'vertical'
              }}
              onFocus={(e) => { e.target.style.borderColor = '#667eea'; e.target.style.boxShadow = '0 0 0 4px rgba(102,126,234,0.08)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#e5e7eb'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', borderTop: '1px solid #eef2ff', paddingTop: '16px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '10px 18px',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 600
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '10px 18px',
                background: loading ? '#9ca3af' : 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: 700
              }}
            >
              {loading ? '⏳ Saving...' : module ? '💾 Update Module' : '✨ Create Module'}
            </button>
          </div>
        </form>
      </div>

      <style>{`@keyframes slideUp { from { transform: translateY(18px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }`}</style>
    </div>
  )
}
