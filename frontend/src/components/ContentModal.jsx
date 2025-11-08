import { useState, useEffect } from 'react'
import axios from 'axios'

export default function ContentModal({ module, onClose }) {
  const [contents, setContents] = useState([])
  const [showCreateContent, setShowCreateContent] = useState(false)
  const [contentType, setContentType] = useState('VIDEO')

  useEffect(() => {
    fetchContents()
  }, [module.moduleId])

  const fetchContents = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await axios.get(`http://localhost:8080/api/course-contents/module/${module.moduleId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setContents(response.data.data || response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleDeleteContent = async (contentId) => {
    if (!confirm('Delete this content?')) return
    
    try {
      const token = localStorage.getItem('token')
      await axios.delete(`http://localhost:8080/api/course-contents/${contentId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchContents()
    } catch (error) {
      alert('Error: ' + (error.response?.data?.message || error.message))
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3>{module.title}</h3>
            <p>{module.description}</p>
          </div>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <div className="content-section">
          <div className="section-header">
            <h4>Module Contents ({contents.length})</h4>
            <div className="content-type-selector">
              <select 
                value={contentType} 
                onChange={(e) => setContentType(e.target.value)}
                className="content-type-select"
              >
                <option value="VIDEO">Video</option>
                <option value="READING">Reading</option>
                <option value="QUIZ">Quiz</option>
              </select>
              <button className="btn-primary" onClick={() => setShowCreateContent(true)}>
                + Add {contentType}
              </button>
            </div>
          </div>

          {contents.length === 0 ? (
            <div className="empty-state small">
              <p>No content yet. Add videos, readings, or quizzes.</p>
            </div>
          ) : (
            <div className="contents-list">
              {contents.map((content, index) => (
                <ContentItem 
                  key={content.contentId}
                  content={content}
                  index={index}
                  onDelete={() => handleDeleteContent(content.contentId)}
                />
              ))}
            </div>
          )}
        </div>

        {showCreateContent && (
          <CreateContentForm 
            moduleId={module.moduleId}
            contentType={contentType}
            onClose={() => setShowCreateContent(false)}
            onSuccess={() => {
              setShowCreateContent(false)
              fetchContents()
            }}
          />
        )}
      </div>
    </div>
  )
}

function ContentItem({ content, index, onDelete }) {
  const getIcon = () => {
    switch(content.contentType) {
      case 'Video': return '🎥'
      case 'Reading': return '📄'
      case 'Quiz': return '❓'
      default: return '📌'
    }
  }

  return (
    <div className="content-item">
      <span className="content-icon">{getIcon()}</span>
      <div className="content-info">
        <h5>{content.title}</h5>
        <span className="content-type">{content.contentType}</span>
        {content.contentUrl && <small className="content-url">{content.contentUrl}</small>}
      </div>
      <button className="btn-icon" onClick={onDelete}>🗑️</button>
    </div>
  )
}

function CreateContentForm({ moduleId, contentType, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    type: contentType,
    videoUrl: '',
    readingContent: '',
    quizData: { questions: [] }
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      
      // Determine contentUrl based on type
      let contentUrl = ''
      if (formData.type === 'VIDEO') {
        contentUrl = formData.videoUrl
      } else if (formData.type === 'READING') {
        contentUrl = formData.readingContent
      } else if (formData.type === 'QUIZ') {
        contentUrl = JSON.stringify(formData.quizData)
      }

      // Map frontend types to backend format (Video, Reading, Quiz)
      const contentTypeMap = {
        'VIDEO': 'Video',
        'READING': 'Reading',
        'QUIZ': 'Quiz'
      }

      const payload = {
        moduleId: moduleId,
        title: formData.title,
        contentType: contentTypeMap[formData.type],
        contentUrl: contentUrl,
        contentOrder: 0
      }

      console.log('Creating content with payload:', payload)
      console.log('Module ID received:', moduleId)

      await axios.post(`http://localhost:8080/api/course-contents`, payload, {
        headers: { Authorization: `Bearer ${token}` }
      })
      onSuccess()
    } catch (error) {
      console.error('Content creation error:', error.response?.data)
      alert('Error: ' + (error.response?.data?.message || error.message))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add {contentType}</h3>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder={`${contentType} title`}
              required
            />
          </div>

          {contentType === 'VIDEO' && (
            <div className="form-group">
              <label>Video URL *</label>
              <input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                required
              />
              <small>Supports YouTube, Vimeo, and direct video URLs</small>
            </div>
          )}

          {contentType === 'READING' && (
            <div className="form-group">
              <label>Content *</label>
              <textarea
                value={formData.readingContent}
                onChange={(e) => setFormData({...formData, readingContent: e.target.value})}
                placeholder="Write your reading content here... (Supports Markdown)"
                rows="12"
                required
              />
            </div>
          )}

          {contentType === 'QUIZ' && (
            <div className="form-group">
              <label>Quiz Questions (JSON format)</label>
              <textarea
                value={JSON.stringify(formData.quizData, null, 2)}
                onChange={(e) => {
                  try {
                    setFormData({...formData, quizData: JSON.parse(e.target.value)})
                  } catch {}
                }}
                placeholder='{"questions": [{"question": "What is...?", "options": ["A", "B", "C", "D"], "answer": 0}]}'
                rows="10"
              />
              <small>
                Format: {`{"questions": [{"question": "...", "options": ["A", "B", "C", "D"], "answer": 0}]}`}
                <br />
                The "answer" field is the index of the correct option (0-based)
              </small>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Adding...' : 'Add Content'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
