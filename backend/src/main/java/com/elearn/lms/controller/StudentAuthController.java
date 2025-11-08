package com.elearn.lms.controller;

import com.elearn.lms.dto.StudentLoginRequest;
import com.elearn.lms.dto.StudentLoginResponse;
import com.elearn.lms.dto.StudentResponse;
import com.elearn.lms.dto.StudentSignupRequest;
import com.elearn.lms.entity.Student;
import com.elearn.lms.security.JwtService;
import com.elearn.lms.service.StudentAuthService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/student")
@CrossOrigin(origins = "*")
public class StudentAuthController {

    private final StudentAuthService studentAuthService;
    private final JwtService jwtService;

    public StudentAuthController(StudentAuthService studentAuthService, JwtService jwtService) {
        this.studentAuthService = studentAuthService;
        this.jwtService = jwtService;
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody StudentSignupRequest request) {
        try {
            Student s = studentAuthService.register(request);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("message", "Signup successful", "studentId", s.getId()));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("message", ex.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody StudentLoginRequest request) {
        return studentAuthService.authenticate(request)
                .<ResponseEntity<?>>map(s -> {
                    String token = jwtService.generateToken(s.getEmail(), Map.of("role", "STUDENT", "studentId", s.getId()));
                    return ResponseEntity.ok(new StudentLoginResponse(token, new StudentResponse(s)));
                })
                .orElseGet(() -> ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Invalid credentials")));
    }
}


