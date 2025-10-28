package e_learn_.lms_e_learn.dto;

public class UserRequest {
    
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private Boolean isInstructor;
    
    // Constructors
    public UserRequest() {
    }
    
    public UserRequest(String firstName, String lastName, String email, String password, Boolean isInstructor) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.isInstructor = isInstructor;
    }
    
    // Getters and Setters
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getPassword() {
        return password;
    }
    
    public void setPassword(String password) {
        this.password = password;
    }
    
    public Boolean getIsInstructor() {
        return isInstructor;
    }
    
    public void setIsInstructor(Boolean isInstructor) {
        this.isInstructor = isInstructor;
    }
}
