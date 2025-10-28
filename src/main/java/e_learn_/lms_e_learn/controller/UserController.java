package e_learn_.lms_e_learn.controller;

import e_learn_.lms_e_learn.dto.UserRequest;
import e_learn_.lms_e_learn.dto.UserResponse;
import e_learn_.lms_e_learn.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // Create new user
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody UserRequest request) {
        try {
            UserResponse user = userService.createUser(request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User created successfully");
            response.put("data", user);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    // Get all users
    @GetMapping
    public ResponseEntity<?> getAllUsers() {
        try {
            List<UserResponse> users = userService.getAllUsers();
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("count", users.size());
            response.put("data", users);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
    
    // Get user by ID
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            UserResponse user = userService.getUserById(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    
    // Get user by email
    @GetMapping("/email/{email}")
    public ResponseEntity<?> getUserByEmail(@PathVariable String email) {
        try {
            UserResponse user = userService.getUserByEmail(email);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("data", user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
    
    // Update user
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody UserRequest request) {
        try {
            UserResponse user = userService.updateUser(id, request);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User updated successfully");
            response.put("data", user);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errorResponse);
        }
    }
    
    // Delete user
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        try {
            userService.deleteUser(id);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "User deleted successfully");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorResponse);
        }
    }
}
