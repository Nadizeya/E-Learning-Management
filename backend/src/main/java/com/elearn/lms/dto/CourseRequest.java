package com.elearn.lms.dto;

public class CourseRequest {

	private Long categoryId;
	private Long instructorId;
	private String title;
	private String description;
	private String status; // Draft, Published

	public CourseRequest() {
	}

	public CourseRequest(Long categoryId, Long instructorId, String title, String description, String status) {
		this.categoryId = categoryId;
		this.instructorId = instructorId;
		this.title = title;
		this.description = description;
		this.status = status;
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
}


