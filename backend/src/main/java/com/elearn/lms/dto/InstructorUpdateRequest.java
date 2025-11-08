package com.elearn.lms.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public class InstructorUpdateRequest {
    @Size(max = 100)
    private String firstName;
    @Size(max = 100)
    private String lastName;
    @Email @Size(max = 255)
    private String email;
    @Size(min = 6, max = 128)
    private String password; // optional; if provided, will be hashed
    private String bio; // optional for updates
    @Size(max = 500)
    private String expertise; // optional for updates

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }
    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getExpertise() { return expertise; }
    public void setExpertise(String expertise) { this.expertise = expertise; }
}


