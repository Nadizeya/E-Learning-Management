package com.elearn.lms.dto;

import com.elearn.lms.entity.Course;
import java.time.LocalDateTime;

public class CourseResponse {

	private Long courseId;
	private Long categoryId;
	private Long instructorId;
	private String title;
	private String description;
	private String status;
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;

	public CourseResponse() {
	}

	public CourseResponse(Course course) {
		this.courseId = course.getCourseId();
		this.categoryId = course.getCategoryId();
		this.instructorId = course.getInstructorId();
		this.title = course.getTitle();
		this.description = course.getDescription();
		this.status = course.getStatus();
		this.createdAt = course.getCreatedAt();
		this.updatedAt = course.getUpdatedAt();
	}

	public Long getCourseId() {
		return courseId;
	}

	public void setCourseId(Long courseId) {
		this.courseId = courseId;
	}

	public Long getCategoryId() {
		return categoryId;
	}

	public void setCategoryId(Long categoryId) {
		this.categoryId = categoryId;
	}

	public Long getInstructorId() {
		return instructorId;
	}

	public void setInstructorId(Long instructorId) {
		this.instructorId = instructorId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	public LocalDateTime getUpdatedAt() {
		return updatedAt;
	}

	public void setUpdatedAt(LocalDateTime updatedAt) {
		this.updatedAt = updatedAt;
	}
}


