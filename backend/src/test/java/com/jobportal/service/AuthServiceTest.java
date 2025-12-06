package com.jobportal.service;

import com.jobportal.dto.AuthResponse;
import com.jobportal.dto.LoginRequest;
import com.jobportal.dto.RegisterRequest;
import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Integration tests for AuthService.
 * Uses real Spring context instead of mocks to avoid Java 23 Mockito issues.
 */
@SpringBootTest
public class AuthServiceTest {

    @Autowired
    private AuthService authService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void setUp() {
        userRepository.deleteAll();
    }

    @Test
    void register_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setFirstName("John");
        request.setLastName("Doe");
        request.setRole(User.UserRole.JOB_SEEKER);

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("test@example.com", response.getEmail());
        assertEquals("JOB_SEEKER", response.getRole());

        // Verify user was saved
        assertTrue(userRepository.existsByEmail("test@example.com"));
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        // Create existing user
        User existingUser = new User();
        existingUser.setEmail("test@example.com");
        existingUser.setPassword(passwordEncoder.encode("password123"));
        existingUser.setRole(User.UserRole.JOB_SEEKER);
        userRepository.save(existingUser);

        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setFirstName("Jane");
        request.setLastName("Doe");
        request.setRole(User.UserRole.JOB_SEEKER);

        assertThrows(RuntimeException.class, () -> authService.register(request));
    }

    @Test
    void login_Success() {
        // Create user first
        RegisterRequest registerRequest = new RegisterRequest();
        registerRequest.setEmail("logintest@example.com");
        registerRequest.setPassword("password123");
        registerRequest.setFirstName("John");
        registerRequest.setLastName("Doe");
        registerRequest.setRole(User.UserRole.JOB_SEEKER);
        authService.register(registerRequest);

        LoginRequest loginRequest = new LoginRequest();
        loginRequest.setEmail("logintest@example.com");
        loginRequest.setPassword("password123");

        AuthResponse response = authService.login(loginRequest);

        assertNotNull(response);
        assertNotNull(response.getToken());
        assertEquals("logintest@example.com", response.getEmail());
    }

    @Test
    void login_InvalidCredentials_ThrowsException() {
        LoginRequest request = new LoginRequest();
        request.setEmail("nonexistent@example.com");
        request.setPassword("wrongpassword");

        assertThrows(Exception.class, () -> authService.login(request));
    }
}
