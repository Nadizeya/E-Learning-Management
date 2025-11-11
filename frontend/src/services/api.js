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
    try {
      console.log('Fetching categories from:', `${API_BASE_URL}/categories`);
      const response = await fetch(`${API_BASE_URL}/categories`, {
        headers: {
          'Accept': 'application/json'
        }
      });
      
      console.log('Categories API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to fetch categories (${response.status}):`, errorText);
        throw new Error(`Failed to fetch categories: ${response.statusText}`);
      }
      
      // Try to parse the response as JSON
      let data;
      const responseText = await response.text();
      console.log('Categories API raw response:', responseText);
      
      if (!responseText || responseText.trim() === '') {
        console.warn('Empty response received from categories API');
        return [];
      }
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing categories response:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      // Extract the categories data
      const categoriesData = data.data || data;
      console.log('Parsed categories data:', categoriesData);
      
      // Ensure we have an array
      if (!Array.isArray(categoriesData)) {
        console.warn('Categories data is not an array, converting to array');
        return categoriesData ? [categoriesData] : [];
      }
      
      return categoriesData;
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      throw error;
    }
  },
};

// Instructor API
export const instructorAPI = {
  // Get instructor by ID
  getInstructorById: async (id) => {
    const response = await fetch(`${API_BASE_URL}/instructors/${id}`);
    if (!response.ok) throw new Error('Failed to fetch instructor');
    const data = await response.json();
    return data.data;
  },
};

// Quiz API
export const quizAPI = {
  // Get quiz for student (without correct answers)
  getQuizForStudent: async (quizId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/student`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch quiz');
    const data = await response.json();
    return data.data;
  },

  // Get quiz by content ID (for student)
  getQuizByContentId: async (contentId) => {
    const token = localStorage.getItem('token');
    console.log('=== FETCHING QUIZ BY CONTENT ID ===');
    console.log('Content ID:', contentId);
    try {
      // First get the quiz (instructor version to get quizId)
      const response = await fetch(`${API_BASE_URL}/quizzes/content/${contentId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Response status:', response.status);
      
      if (!response.ok) {
        // Quiz might not exist yet, return null
        if (response.status === 404) {
          console.log('Quiz not found for contentId:', contentId);
          return null;
        }
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error('Failed to fetch quiz');
      }
      
      const data = await response.json();
      console.log('Quiz data received:', data);
      
      // Get student version (without correct answers)
      if (data.success && data.data?.quizId) {
        console.log('Fetching student version of quiz ID:', data.data.quizId);
        const studentQuiz = await quizAPI.getQuizForStudent(data.data.quizId);
        console.log('Student quiz data:', studentQuiz);
        return studentQuiz;
      }
      
      console.log('No quizId found in response');
      return null;
    } catch (err) {
      console.error('Error in getQuizByContentId:', err);
      // If quiz doesn't exist, return null instead of throwing
      if (err.message.includes('404') || err.message.includes('not found')) {
        return null;
      }
      throw err;
    }
  },

  // Submit quiz attempt
  submitQuizAttempt: async (quizId, studentId, answers) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/quizzes/attempt`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        quizId,
        studentId,
        answers,
      }),
    });
    if (!response.ok) throw new Error('Failed to submit quiz');
    const data = await response.json();
    return data.data;
  },

  // Get quiz attempts for a student
  getStudentAttempts: async (studentId) => {
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/quizzes/student/${studentId}/attempts`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) throw new Error('Failed to fetch attempts');
    const data = await response.json();
    return data.data;
  },
};

// Progress API
export const progressAPI = {
  // Get student progress for a course
  getStudentProgress: async (courseId, studentId) => {
    try {
      console.log(`Fetching progress for student ${studentId} in course ${courseId}`);
      
      // Get token from localStorage if available
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/progress/course/${courseId}/student/${studentId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json'
        },
        credentials: 'include' // Include cookies if any
      });
      
      if (!response.ok) {
        console.error(`Failed to fetch progress. Status: ${response.status}`);
        const errorText = await response.text();
        console.error('Error response:', errorText);
        return { progressPercentage: 0, completedModules: 0, totalModules: 0 };
      }
      
      const data = await response.json();
      console.log('Progress data received:', data);
      
      // Check if data has the expected structure
      if (!data || typeof data !== 'object') {
        console.error('Invalid progress data format:', data);
        return { progressPercentage: 0, completedModules: 0, totalModules: 0 };
      }
      
      // Extract the data property if it exists (API might wrap response in a data property)
      const progressData = data.data || data;
      
      console.log('Processed progress data:', progressData);
      console.log('Progress percentage:', progressData.progressPercentage);
      console.log('Completed modules:', progressData.completedModules);
      console.log('Total modules:', progressData.totalModules);
      
      return progressData;
    } catch (error) {
      console.error('Error fetching student progress:', error);
      return { progressPercentage: 0, completedModules: 0, totalModules: 0 };
    }
  },
  
  // Mark content as completed
  markContentAsCompleted: async (studentId, contentId, moduleId, courseId) => {
    try {
      // Get token from localStorage if available
      const token = localStorage.getItem('token');
      
      console.log('Marking content as completed with data:', {
        studentId,
        contentId,
        moduleId,
        courseId
      });
      
      const response = await fetch(`${API_BASE_URL}/progress/mark-completed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json'
        },
        credentials: 'include', // Include cookies if any
        body: JSON.stringify({
          studentId,
          contentId,
          moduleId,
          courseId
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to mark content as completed. Status: ${response.status}`, errorText);
        throw new Error(`Failed to mark content as completed: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('Mark as completed response:', data);
      
      // Immediately fetch updated progress to ensure UI is in sync
      try {
        const updatedProgress = await this.getStudentProgress(courseId, studentId);
        console.log('Updated progress after marking content as completed:', updatedProgress);
        return {
          ...data,
          updatedProgress
        };
      } catch (progressError) {
        console.error('Error fetching updated progress:', progressError);
        return data;
      }
    } catch (error) {
      console.error('Error marking content as completed:', error);
      throw error;
    }
  }
};

// Certificate API
export const certificateAPI = {
  // Get certificate by ID
  getCertificateById: async (certificateId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/certificates/${certificateId}`);
      if (!response.ok) {
        throw new Error('Certificate not found');
      }
      const data = await response.json();
      return data.data || data;
    } catch (error) {
      console.error('Error fetching certificate:', error);
      throw error;
    }
  },
  
  // Get certificate by course and student
  getCertificateByCourseAndStudent: async (courseId, studentId) => {
    try {
      console.log(`Fetching certificate for course ${courseId} and student ${studentId}`);
      
      // Get token from localStorage if available
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/certificates/course/${courseId}/student/${studentId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json'
        },
        credentials: 'include' // Include cookies if any
      });
      
      console.log('Certificate fetch response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('No certificate found for this course and student');
          return null; // No certificate found
        }
        
        const errorText = await response.text();
        console.error(`Failed to fetch certificate (${response.status}):`, errorText);
        throw new Error(`Failed to fetch certificate: ${errorText || response.statusText}`);
      }
      
      // Try to parse the response as JSON
      let data;
      const responseText = await response.text();
      console.log('Certificate fetch raw response:', responseText);
      
      if (!responseText || responseText.trim() === '') {
        console.log('Empty response received, no certificate exists');
        return null;
      }
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing certificate response:', parseError);
        return null;
      }
      
      const certificateData = data.data || data;
      console.log('Parsed certificate data:', certificateData);
      
      return certificateData;
    } catch (error) {
      console.error('Error fetching certificate:', error);
      return null;
    }
  },
  
  // Generate certificate
  generateCertificate: async (courseId, studentId) => {
    try {
      console.log(`Generating certificate for course ${courseId} and student ${studentId}`);
      
      // Get token from localStorage if available
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/certificates/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json'
        },
        credentials: 'include', // Include cookies if any
        body: JSON.stringify({
          studentId: studentId,
          courseId: parseInt(courseId),
        }),
      });
      
      // Log the raw response for debugging
      console.log('Certificate generation response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Failed to generate certificate (${response.status}):`, errorText);
        throw new Error(`Failed to generate certificate: ${errorText || response.statusText}`);
      }
      
      // Try to parse the response as JSON
      let data;
      const responseText = await response.text();
      console.log('Certificate generation raw response:', responseText);
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing certificate response:', parseError);
        throw new Error('Invalid response format from server');
      }
      
      // Extract the certificate data
      const certificateData = data.data || data;
      console.log('Parsed certificate data:', certificateData);
      
      // If we got an empty response or no certificate ID, create a fallback certificate
      if (!certificateData || !certificateData.certificateId) {
        console.warn('No valid certificate data returned, creating fallback');
        return {
          certificateId: `temp-${Date.now()}`,
          courseId: parseInt(courseId),
          studentId: studentId,
          courseTitle: 'Your Course',  // This will be replaced with actual data
          studentName: 'Student',      // This will be replaced with actual data
          issueDate: new Date().toISOString(),
          uniqueCode: `CERT-${Math.random().toString(36).substring(2, 10).toUpperCase()}`
        };
      }
      
      return certificateData;
    } catch (error) {
      console.error('Error generating certificate:', error);
      throw error;
    }
  },
  
  // Get all certificates for a student
  getStudentCertificates: async (studentId) => {
    try {
      console.log(`Fetching all certificates for student ${studentId}`);
      
      // Get token from localStorage if available
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/certificates/student/${studentId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json'
        },
        credentials: 'include' // Include cookies if any
      });
      
      console.log('Student certificates response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('No certificates found for this student');
          return []; // No certificates found
        }
        
        const errorText = await response.text();
        console.error(`Failed to fetch certificates (${response.status}):`, errorText);
        throw new Error(`Failed to fetch certificates: ${errorText || response.statusText}`);
      }
      
      // Try to parse the response as JSON
      let data;
      const responseText = await response.text();
      console.log('Student certificates raw response:', responseText);
      
      if (!responseText || responseText.trim() === '') {
        console.log('Empty response received, no certificates exist');
        return [];
      }
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing certificates response:', parseError);
        return [];
      }
      
      const certificatesData = data.data || data;
      console.log('Parsed certificates data:', certificatesData);
      
      // Ensure we have an array
      if (!Array.isArray(certificatesData)) {
        console.warn('Certificates data is not an array, converting to array');
        return certificatesData ? [certificatesData] : [];
      }
      
      return certificatesData;
    } catch (error) {
      console.error('Error fetching student certificates:', error);
      return [];
    }
  },
};

// Badge API
export const badgeAPI = {
  // Get all badges for a student
  getStudentBadges: async (studentId) => {
    try {
      console.log(`Fetching badges for student ${studentId}`);
      
      // Get token from localStorage if available
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/badges/student/${studentId}`, {
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
          'Accept': 'application/json'
        },
        credentials: 'include' // Include cookies if any
      });
      
      console.log('Student badges response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 404) {
          console.log('No badges found for this student');
          return []; // No badges found
        }
        
        const errorText = await response.text();
        console.error(`Failed to fetch badges (${response.status}):`, errorText);
        throw new Error(`Failed to fetch badges: ${errorText || response.statusText}`);
      }
      
      // Try to parse the response as JSON
      let data;
      const responseText = await response.text();
      console.log('Student badges raw response:', responseText);
      
      if (!responseText || responseText.trim() === '') {
        console.log('Empty response received, no badges exist');
        return [];
      }
      
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing badges response:', parseError);
        return [];
      }
      
      const badgesData = data.data || data;
      console.log('Parsed badges data:', badgesData);
      
      // Ensure we have an array
      if (!Array.isArray(badgesData)) {
        console.warn('Badges data is not an array, converting to array');
        return badgesData ? [badgesData] : [];
      }
      
      return badgesData;
    } catch (error) {
      console.error('Error fetching student badges:', error);
      return [];
    }
  },
};

export default {
  courseAPI,
  courseModuleAPI,
  courseContentAPI,
  enrollmentAPI,
  categoryAPI,
  instructorAPI,
  quizAPI,
  progressAPI,
  certificateAPI,
  badgeAPI
};
