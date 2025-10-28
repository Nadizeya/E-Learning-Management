package e_learn_.lms_e_learn.service;

import e_learn_.lms_e_learn.dto.UserRequest;
import e_learn_.lms_e_learn.dto.UserResponse;
import e_learn_.lms_e_learn.entity.User;
import e_learn_.lms_e_learn.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    // Create new user
    public UserResponse createUser(UserRequest request) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        
        // Create user entity
        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        // In production, hash the password properly
        user.setPasswordHash(hashPassword(request.getPassword()));
        user.setIsInstructor(request.getIsInstructor() != null ? request.getIsInstructor() : false);
        
        // Save user
        User savedUser = userRepository.save(user);
        
        return new UserResponse(savedUser);
    }
    
    // Get all users
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserResponse::new)
                .collect(Collectors.toList());
    }
    
    // Get user by ID
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return new UserResponse(user);
    }
    
    // Get user by email
    public UserResponse getUserByEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));
        return new UserResponse(user);
    }
    
    // Update user
    public UserResponse updateUser(Long id, UserRequest request) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        // Check if email is being changed and if it already exists
        if (!user.getEmail().equals(request.getEmail()) && 
            userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists: " + request.getEmail());
        }
        
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        if (request.getPassword() != null && !request.getPassword().isEmpty()) {
            user.setPasswordHash(hashPassword(request.getPassword()));
        }
        user.setIsInstructor(request.getIsInstructor());
        
        User updatedUser = userRepository.save(user);
        return new UserResponse(updatedUser);
    }
    
    // Delete user
    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found with id: " + id);
        }
        userRepository.deleteById(id);
    }
    
    // Simple password hashing (use BCrypt in production)
    private String hashPassword(String password) {
        // For now, just prefix with $2a$10$ to simulate a hash
        // In production, use BCryptPasswordEncoder
        return "$2a$10$" + password;
    }
}
