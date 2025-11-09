const API_BASE_URL = 'http://localhost:8080/api';

// Course API
export const courseAPI = {
  // Get all courses
  getAllCourses: async () => {
    const response = await fetch(`${API_BASE_URL}/courses`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    const data = await response.json();
    return data.data;
  },

  // Get course by ID
  getCourseById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`);
    if (!response.ok) throw new Error('Failed to fetch course');
    const data = await response.json();
    return data.data;
  },

  // Get courses by status
  getCoursesByStatus: async (status) => {
    const response = await fetch(`${API_BASE_URL}/courses/status/${status}`);
    if (!response.ok) throw new Error('Failed to fetch courses');
    const data = await response.json();
    return data.data;
  },

  // Create course
  createCourse: async (courseData) => {
    const response = await fetch(`${API_BASE_URL}/courses`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Failed to create course');
    const data = await response.json();
    return data.data;
  },

  // Update course
  updateCourse: async (id, courseData) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(courseData),
    });
    if (!response.ok) throw new Error('Failed to update course');
    const data = await response.json();
    return data.data;
  },

  // Delete course
  deleteCourse: async (id) => {
    const response = await fetch(`${API_BASE_URL}/courses/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete course');
    const data = await response.json();
    return data;
  },
};

// Course Module API
export const courseModuleAPI = {
  // Get modules by course ID
  getModulesByCourseId: async (courseId) => {
    const response = await fetch(`${API_BASE_URL}/course-modules/course/${courseId}`);
    if (!response.ok) throw new Error('Failed to fetch modules');
    const data = await response.json();
    return data.data;
  },

  // Create module
  createModule: async (moduleData) => {
    const response = await fetch(`${API_BASE_URL}/course-modules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(moduleData),
    });
    if (!response.ok) throw new Error('Failed to create module');
    const data = await response.json();
    return data.data;
  },

  // Create module with contents
  createModuleWithContents: async (moduleData) => {
    const response = await fetch(`${API_BASE_URL}/course-modules/with-contents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(moduleData),
    });
    if (!response.ok) throw new Error('Failed to create module with contents');
    const data = await response.json();
    return data.data;
  },
};

// Course Content API
export const courseContentAPI = {
  // Get contents by module ID
  getContentsByModuleId: async (moduleId) => {
    const response = await fetch(`${API_BASE_URL}/course-contents/module/${moduleId}`);
    if (!response.ok) throw new Error('Failed to fetch contents');
    const data = await response.json();
    return data.data;
  },

  // Create content
  createContent: async (contentData) => {
    const response = await fetch(`${API_BASE_URL}/course-contents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contentData),
    });
    if (!response.ok) throw new Error('Failed to create content');
    const data = await response.json();
    return data.data;
  },

  // Upload file
  uploadFile: async (file, moduleId, title, contentType, contentOrder) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('moduleId', moduleId);
    formData.append('title', title);
    formData.append('contentType', contentType);
    if (contentOrder !== undefined) {
      formData.append('contentOrder', contentOrder);
    }

    const response = await fetch(`${API_BASE_URL}/course-contents/upload`, {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to upload file');
    const data = await response.json();
    return data.data;
  },

  // Get file URL
  getFileUrl: (contentType, fileName) => {
    return `${API_BASE_URL}/course-contents/files/${contentType}/${fileName}`;
  },
};

// Enrollment API
export const enrollmentAPI = {
  // Enroll in course
  enrollInCourse: async (studentId, courseId) => {
    console.log('Sending enrollment request:', { studentId, courseId });
    const response = await fetch(`${API_BASE_URL}/enrollments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ studentId, courseId }),
    });
    
    const data = await response.json();
    console.log('Enrollment response:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to enroll in course');
    }
    
    return data.data;
  },

  // Get enrollments by student ID
  getEnrollmentsByStudentId: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/enrollments/student/${studentId}`);
    if (!response.ok) throw new Error('Failed to fetch enrollments');
    const data = await response.json();
    return data.data;
  },

  // Check if student is enrolled in a course
  checkEnrollment: async (studentId, courseId) => {
    const response = await fetch(`${API_BASE_URL}/enrollments/check?studentId=${studentId}&courseId=${courseId}`);
    if (!response.ok) throw new Error('Failed to check enrollment');
    const data = await response.json();
    return data.isEnrolled; // Returns true/false
  },
};

// Category API
export const categoryAPI = {
  // Get all categories
  getAllCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/categories`);
    if (!response.ok) throw new Error('Failed to fetch categories');
    const data = await response.json();
    return data.data;
  },
};

export default {
  courseAPI,
  courseModuleAPI,
  courseContentAPI,
  enrollmentAPI,
  categoryAPI,
};
