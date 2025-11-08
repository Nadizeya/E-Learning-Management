package com.elearn.lms.service;

import com.elearn.lms.dto.StudentSignupRequest;
import com.elearn.lms.dto.StudentUpdateRequest;
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

    @Transactional
    public Student update(Long id, StudentUpdateRequest request) {
        Student s = findByIdOrThrow(id);
        if (request.getFirstName() != null) s.setFirstName(request.getFirstName());
        if (request.getLastName() != null) s.setLastName(request.getLastName());
        if (request.getEmail() != null) s.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) s.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        return studentRepository.save(s);
    }

    @Transactional
    public void delete(Long id) { studentRepository.deleteById(id); }
}


