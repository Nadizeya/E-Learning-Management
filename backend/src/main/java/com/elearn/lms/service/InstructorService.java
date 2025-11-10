package com.elearn.lms.service;

import com.elearn.lms.dto.InstructorSignupRequest;
import com.elearn.lms.entity.Instructor;
import com.elearn.lms.repository.InstructorRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class InstructorService {

    private final InstructorRepository instructorRepository;
    private final PasswordEncoder passwordEncoder;

    public InstructorService(InstructorRepository instructorRepository, PasswordEncoder passwordEncoder) {
        this.instructorRepository = instructorRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public List<Instructor> findAll() { return instructorRepository.findAll(); }

    public Instructor findByIdOrThrow(Long id) { return instructorRepository.findById(id).orElseThrow(() -> new RuntimeException("Instructor not found")); }

    @Transactional
    public Instructor create(InstructorSignupRequest request) {
        if (instructorRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }
        
        // Validate required fields
        if (request.getBio() == null || request.getBio().trim().isEmpty()) {
            throw new IllegalArgumentException("Bio is required and cannot be empty");
        }
        if (request.getExpertise() == null || request.getExpertise().trim().isEmpty()) {
            throw new IllegalArgumentException("Expertise is required and cannot be empty");
        }
        
        Instructor i = new Instructor();
        i.setFirstName(request.getFirstName());
        i.setLastName(request.getLastName());
        i.setEmail(request.getEmail());
        i.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        i.setBio(request.getBio().trim());
        i.setExpertise(request.getExpertise().trim());
        return instructorRepository.save(i);
    }

    // Update method removed

    @Transactional
    public void delete(Long id) { instructorRepository.deleteById(id); }
    
    // Password change method removed
}


