package e_learn_.lms_e_learn;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/test")
public class TestController {
    
    @Autowired
    private JdbcTemplate jdbcTemplate;
    
    @GetMapping("/tables")
    public List<Map<String, Object>> getTables() {
        return jdbcTemplate.queryForList("SHOW TABLES");
    }
    
    @GetMapping("/users")
    public List<Map<String, Object>> getUsers() {
        return jdbcTemplate.queryForList("SELECT * FROM USERS");
    }
    
    @GetMapping("/courses")
    public List<Map<String, Object>> getCourses() {
        return jdbcTemplate.queryForList(
            "SELECT c.*, CONCAT(u.first_name, ' ', u.last_name) AS instructor " +
            "FROM COURSES c JOIN USERS u ON c.instructor_id = u.user_id"
        );
    }
    
    @GetMapping("/enrollments")
    public List<Map<String, Object>> getEnrollments() {
        return jdbcTemplate.queryForList(
            "SELECT e.*, CONCAT(u.first_name, ' ', u.last_name) AS student, " +
            "c.title AS course_title FROM ENROLLMENTS e " +
            "JOIN USERS u ON e.user_id = u.user_id " +
            "JOIN COURSES c ON e.course_id = c.course_id"
        );
    }
}