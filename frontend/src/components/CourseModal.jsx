import { useState, useEffect } from 'react'
import apiClient from '../api/apiClient'
import { categoryAPI } from '../services/api.js'

export default function CourseModal({ course, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: course?.title || '',
    description: course?.description || '',
    categoryId: course?.categoryId || null,
    instructorId: course?.instructorId || null,
    status: course?.status || 'Draft',
    thumbnail: course?.thumbnail || '',
    level: course?.level || 'Beginner',
    duration: course?.duration || '6 weeks'
  })
  const [imagePreview, setImagePreview] = useState(course?.thumbnail || '')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [imageError, setImageError] = useState('')
  const [categories, setCategories] = useState([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true)
        setError('')
        
        const categoriesData = await categoryAPI.getAllCategories()
        console.log('Categories data:', categoriesData)
        
        if (categoriesData && categoriesData.length > 0) {
          setCategories(categoriesData)
          
          // If editing a course and it has a categoryId, keep it
          // Otherwise, set the first category as default
          if (!formData.categoryId && categoriesData.length > 0) {
            setFormData(prev => ({
              ...prev,
              categoryId: categoriesData[0].categoryId
            }))
          }
        } else {
          console.warn('No categories returned from API')
          setError('No categories available. Please add categories first.')
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err)
        setError('Failed to load categories. The server might be down or the categories API is not implemented.')
      } finally {
        setLoadingCategories(false)
      }
    }
    
    fetchCategories()
  }, [])

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageError('');
    
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        setImageError('Please select an image file (JPEG, PNG, etc.)');
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setImageError('Image size should be less than 2MB');
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData({ ...formData, thumbnail: reader.result });
      };
      reader.onerror = () => {
        setImageError('Failed to read the image file');
      };
      reader.readAsDataURL(file);
    }
  };

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
        await apiClient.put(`/courses/${course.courseId}`, payload, {
          headers: { Authorization: `Bearer ${token}` }
        })
      } else {
        await apiClient.post('/courses', payload, {
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
              <label>Course Thumbnail Image *</label>
              <div className="file-input-container" style={{ position: 'relative', marginBottom: '10px' }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="file-input"
                  id="course-thumbnail"
                  style={{ 
                    display: 'none' 
                  }}
                />
                <label 
                  htmlFor="course-thumbnail"
                  style={{
                    display: 'inline-block',
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Choose Image
                </label>
                <span>{formData.thumbnail ? 'Image selected' : 'No image selected'}</span>
              </div>
              
              {imageError && <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>{imageError}</div>}
              
              {imagePreview && (
                <div className="image-preview" style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '4px',
                  padding: '10px',
                  backgroundColor: '#f9f9f9'
                }}>
                  <img 
                    src={imagePreview} 
                    alt="Course thumbnail preview" 
                    style={{ 
                      width: '100%', 
                      maxHeight: '200px', 
                      objectFit: 'contain',
                      borderRadius: '4px'
                    }} 
                  />
                </div>
              )}
              <small>Upload an image for your course (recommended size: 16:9 ratio, max 2MB)</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Level *</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData({...formData, level: e.target.value})}
                required
              >
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="form-group">
              <label>Duration</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: e.target.value})}
                placeholder="6 weeks"
              />
              <small>e.g., "6 weeks", "3 months"</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category *</label>
              {loadingCategories ? (
                <div>Loading categories...</div>
              ) : categories.length === 0 ? (
                <div className="error-message">No categories available</div>
              ) : (
                <>
                  <select
                    value={formData.categoryId || ''}
                    onChange={(e) => setFormData({...formData, categoryId: parseInt(e.target.value) || null})}
                    required
                  >
                    <option value="" disabled>Select a category</option>
                    {categories.map(category => (
                      <option key={category.categoryId} value={category.categoryId}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  <small>Select the category that best fits your course</small>
                </>
              )}
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
