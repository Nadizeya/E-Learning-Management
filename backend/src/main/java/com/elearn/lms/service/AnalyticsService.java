package com.elearn.lms.service;

import com.elearn.lms.dto.CourseResponse;
import com.elearn.lms.dto.EnrollmentResponse;
import com.elearn.lms.dto.InstructorAnalyticsResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class AnalyticsService {

    private final CourseService courseService;
    private final EnrollmentService enrollmentService;

    public AnalyticsService(CourseService courseService, EnrollmentService enrollmentService) {
        this.courseService = courseService;
        this.enrollmentService = enrollmentService;
    }

    /**
     * Get analytics for an instructor
     */
    public InstructorAnalyticsResponse getInstructorAnalytics(@NonNull Long instructorId) {
        InstructorAnalyticsResponse analytics = new InstructorAnalyticsResponse();
        analytics.setInstructorId(instructorId);

        // Get all courses for the instructor
        List<CourseResponse> courses = courseService.getCoursesByInstructor(instructorId);
        
        long totalCourses = courses.size();
        long publishedCourses = courses.stream()
            .filter(c -> "Published".equals(c.getStatus()))
            .count();
        long draftCourses = totalCourses - publishedCourses;

        analytics.setTotalCourses(totalCourses);
        analytics.setPublishedCourses(publishedCourses);
        analytics.setDraftCourses(draftCourses);

        // Get enrollments for all courses
        long totalEnrollments = 0;
        long completedEnrollments = 0;
        long inProgressEnrollments = 0;
        List<InstructorAnalyticsResponse.CourseAnalytics> courseAnalyticsList = new ArrayList<>();

        for (CourseResponse course : courses) {
            List<EnrollmentResponse> enrollments = enrollmentService.getEnrollmentsByCourseId(course.getCourseId());
            
            long enrollmentCount = enrollments.size();
            long completedCount = enrollments.stream()
                .filter(e -> "Completed".equals(e.getCompletionStatus()))
                .count();
            long inProgressCount = enrollmentCount - completedCount;

            totalEnrollments += enrollmentCount;
            completedEnrollments += completedCount;
            inProgressEnrollments += inProgressCount;

            // Calculate completion rate for this course
            double completionRate = enrollmentCount > 0 
                ? (double) completedCount / enrollmentCount * 100.0 
                : 0.0;

            InstructorAnalyticsResponse.CourseAnalytics courseAnalytics = new InstructorAnalyticsResponse.CourseAnalytics();
            courseAnalytics.setCourseId(course.getCourseId());
            courseAnalytics.setCourseTitle(course.getTitle());
            courseAnalytics.setStatus(course.getStatus());
            courseAnalytics.setEnrollmentCount(enrollmentCount);
            courseAnalytics.setCompletedCount(completedCount);
            courseAnalytics.setInProgressCount(inProgressCount);
            courseAnalytics.setCompletionRate(Math.round(completionRate * 100.0) / 100.0); // Round to 2 decimal places

            courseAnalyticsList.add(courseAnalytics);
        }

        analytics.setTotalEnrollments(totalEnrollments);
        analytics.setCompletedEnrollments(completedEnrollments);
        analytics.setInProgressEnrollments(inProgressEnrollments);

        // Calculate average completion rate
        double averageCompletionRate = totalEnrollments > 0 
            ? (double) completedEnrollments / totalEnrollments * 100.0 
            : 0.0;
        analytics.setAverageCompletionRate(Math.round(averageCompletionRate * 100.0) / 100.0);

        analytics.setCourseAnalytics(courseAnalyticsList);

        return analytics;
    }
}

