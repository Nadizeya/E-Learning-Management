package com.elearn.lms.service;

import com.elearn.lms.dto.CourseRequest;
import com.elearn.lms.dto.CourseResponse;
import com.elearn.lms.entity.Course;
import com.elearn.lms.repository.CourseRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CourseService {

	private final CourseRepository courseRepository;

	public CourseService(CourseRepository courseRepository) {
		this.courseRepository = courseRepository;
	}

	public CourseResponse createCourse(@NonNull CourseRequest request) {
		Course course = new Course();
		course.setCategoryId(request.getCategoryId());
		course.setInstructorId(request.getInstructorId());
		course.setTitle(request.getTitle());
		course.setDescription(request.getDescription());
		course.setStatus(request.getStatus() != null ? request.getStatus() : "Draft");

		Course saved = courseRepository.save(course);
		return new CourseResponse(saved);
	}

	public List<CourseResponse> getAllCourses() {
		return courseRepository.findAll()
			.stream()
			.map(CourseResponse::new)
			.collect(Collectors.toList());
	}

	public CourseResponse getCourseById(@NonNull Long id) {
		Course course = courseRepository.findById(id)
			.orElseThrow(() -> new RuntimeException("Course not found with id: " + id));
		return new CourseResponse(course);
	}

	public List<CourseResponse> getCoursesByInstructor(@NonNull Long instructorId) {
		return courseRepository.findByInstructorId(instructorId)
			.stream()
			.map(CourseResponse::new)
			.collect(Collectors.toList());
	}

	public List<CourseResponse> getCoursesByStatus(@NonNull String status) {
		return courseRepository.findByStatus(status)
			.stream()
			.map(CourseResponse::new)
			.collect(Collectors.toList());
	}

	public CourseResponse updateCourse(@NonNull Long id, @NonNull CourseRequest request) {
		Course course = courseRepository.findById(id)
			.orElseThrow(() -> new RuntimeException("Course not found with id: " + id));

		course.setCategoryId(request.getCategoryId());
		course.setInstructorId(request.getInstructorId());
		course.setTitle(request.getTitle());
		course.setDescription(request.getDescription());
		if (request.getStatus() != null && !request.getStatus().isEmpty()) {
			course.setStatus(request.getStatus());
		}

		Course updated = courseRepository.save(course);
		return new CourseResponse(updated);
	}

	public void deleteCourse(@NonNull Long id) {
		if (!courseRepository.existsById(id)) {
			throw new RuntimeException("Course not found with id: " + id);
		}
		courseRepository.deleteById(id);
	}
}


