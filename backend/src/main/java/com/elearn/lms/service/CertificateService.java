package com.elearn.lms.service;

import com.elearn.lms.dto.CertificateResponse;
import com.elearn.lms.entity.Certificate;
import com.elearn.lms.entity.Course;
import com.elearn.lms.entity.Enrollment;
import com.elearn.lms.repository.CertificateRepository;
import com.elearn.lms.repository.CourseRepository;
import com.elearn.lms.repository.EnrollmentRepository;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class CertificateService {

    private final CertificateRepository certificateRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public CertificateService(CertificateRepository certificateRepository,
                             CourseRepository courseRepository,
                             EnrollmentRepository enrollmentRepository) {
        this.certificateRepository = certificateRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    /**
     * Generate a certificate for a student who completed a course
     */
    @Transactional
    public CertificateResponse generateCertificate(@NonNull Long studentId, @NonNull Long courseId) {
        // Check if certificate already exists
        if (certificateRepository.existsByStudentIdAndCourseId(studentId, courseId)) {
            Optional<Certificate> existingCert = certificateRepository.findAll().stream()
                .filter(c -> c.getStudentId().equals(studentId) && c.getCourseId().equals(courseId))
                .findFirst();
            
            if (existingCert.isPresent()) {
                return createCertificateResponse(existingCert.get());
            }
        }
        
        // Get enrollment
        Optional<Enrollment> enrollment = enrollmentRepository.findByStudentIdAndCourseId(studentId, courseId);
        if (enrollment.isEmpty()) {
            throw new RuntimeException("Student is not enrolled in this course");
        }
        
        // Create certificate
        Certificate certificate = new Certificate();
        certificate.setEnrollmentId(enrollment.get().getEnrollmentId());
        certificate.setStudentId(studentId);
        certificate.setCourseId(courseId);
        certificate.setUniqueCode("CERT-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        
        Certificate saved = certificateRepository.save(certificate);
        
        // Update enrollment status to completed
        enrollment.get().setCompletionStatus("Completed");
        enrollmentRepository.save(enrollment.get());
        
        return createCertificateResponse(saved);
    }

    /**
     * Check if a student has a certificate for a course
     */
    public boolean hasCertificate(@NonNull Long studentId, @NonNull Long courseId) {
        return certificateRepository.existsByStudentIdAndCourseId(studentId, courseId);
    }

    /**
     * Get all certificates for a student
     */
    @Transactional(readOnly = true)
    public List<CertificateResponse> getStudentCertificates(@NonNull Long studentId) {
        return certificateRepository.findByStudentId(studentId)
            .stream()
            .map(this::createCertificateResponse)
            .collect(Collectors.toList());
    }

    /**
     * Get a certificate by ID
     */
    @Transactional(readOnly = true)
    public CertificateResponse getCertificateById(@NonNull Long certificateId) {
        Certificate certificate = certificateRepository.findById(certificateId)
            .orElseThrow(() -> new RuntimeException("Certificate not found with id: " + certificateId));
        return createCertificateResponse(certificate);
    }

    /**
     * Verify a certificate by its unique code
     */
    @Transactional(readOnly = true)
    public CertificateResponse verifyCertificate(@NonNull String uniqueCode) {
        Certificate certificate = certificateRepository.findByUniqueCode(uniqueCode)
            .orElseThrow(() -> new RuntimeException("Certificate not found with code: " + uniqueCode));
        return createCertificateResponse(certificate);
    }

    /**
     * Helper method to create certificate response with course and student details
     */
    private CertificateResponse createCertificateResponse(Certificate certificate) {
        Course course = courseRepository.findById(certificate.getCourseId())
            .orElseThrow(() -> new RuntimeException("Course not found with id: " + certificate.getCourseId()));
        
        CertificateResponse response = new CertificateResponse(certificate);
        response.setCourseTitle(course.getTitle());
        
        // Note: In a real implementation, you would also fetch student name from StudentRepository
        response.setStudentName("Student #" + certificate.getStudentId());
        
        return response;
    }
}
