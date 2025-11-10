package com.elearn.lms.service;

import com.elearn.lms.dto.StudentSignupRequest;
import com.elearn.lms.entity.Student;
import com.elearn.lms.repository.StudentRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final PasswordEncoder passwordEncoder;

    public StudentService(StudentRepository studentRepository, PasswordEncoder passwordEncoder) {
        this.studentRepository = studentRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Student> findAll() { return studentRepository.findAll(); }

    public Student findByIdOrThrow(Long id) { return studentRepository.findById(id).orElseThrow(() -> new RuntimeException("Student not found")); }

    @Transactional
    public Student create(StudentSignupRequest request) {
        if (studentRepository.existsByEmail(request.getEmail())) throw new IllegalArgumentException("Email already registered");
        Student s = new Student();
        s.setFirstName(request.getFirstName());
        s.setLastName(request.getLastName());
        s.setEmail(request.getEmail());
        s.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        return studentRepository.save(s);
    }

    // Update method removed

    @Transactional
    public void delete(Long id) { studentRepository.deleteById(id); }
    
    // Password change method removed
}


