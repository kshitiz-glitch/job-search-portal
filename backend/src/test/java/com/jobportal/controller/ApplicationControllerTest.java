package com.jobportal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import com.jobportal.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class ApplicationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private JobRepository jobRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    private String employerToken;
    private String jobSeekerToken;
    private User employer;
    private User jobSeeker;
    private Job job;

    @BeforeEach
    void setUp() {
        applicationRepository.deleteAll();
        jobRepository.deleteAll();
        userRepository.deleteAll();

        // Create employer
        employer = new User();
        employer.setEmail("employer@test.com");
        employer.setPassword(passwordEncoder.encode("password123"));
        employer.setRole(User.UserRole.EMPLOYER);
        employer = userRepository.save(employer);

        UserDetails employerDetails = org.springframework.security.core.userdetails.User
                .withUsername(employer.getEmail())
                .password(employer.getPassword())
                .authorities("ROLE_EMPLOYER")
                .build();
        employerToken = "Bearer " + jwtUtil.generateToken(employerDetails);

        // Create job seeker
        jobSeeker = new User();
        jobSeeker.setEmail("seeker@test.com");
        jobSeeker.setPassword(passwordEncoder.encode("password123"));
        jobSeeker.setRole(User.UserRole.JOB_SEEKER);
        User.Profile seekerProfile = new User.Profile();
        seekerProfile.setFirstName("John");
        seekerProfile.setLastName("Doe");
        jobSeeker.setProfile(seekerProfile);
        jobSeeker = userRepository.save(jobSeeker);

        UserDetails seekerDetails = org.springframework.security.core.userdetails.User
                .withUsername(jobSeeker.getEmail())
                .password(jobSeeker.getPassword())
                .authorities("ROLE_JOB_SEEKER")
                .build();
        jobSeekerToken = "Bearer " + jwtUtil.generateToken(seekerDetails);

        // Create job
        job = new Job();
        job.setTitle("Developer");
        job.setDescription("Job description");
        job.setLocation("NYC");
        job.setType(Job.JobType.FULL_TIME);
        job.setStatus(Job.JobStatus.ACTIVE);
        job.setPostedBy(employer);
        job = jobRepository.save(job);
    }

    @Test
    void submitApplication_Success() throws Exception {
        Application application = new Application();
        application.setJob(job);
        application.setApplicant(jobSeeker);
        application.setCoverLetter("I am excited to apply...");

        mockMvc.perform(post("/api/applications")
                .header("Authorization", jobSeekerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(application)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("PENDING"));
    }

    @Test
    void getApplicationsByApplicant_Success() throws Exception {
        // Create application
        Application application = new Application();
        application.setJob(job);
        application.setApplicant(jobSeeker);
        application.setStatus(Application.ApplicationStatus.PENDING);
        applicationRepository.save(application);

        mockMvc.perform(get("/api/applications/applicant/" + jobSeeker.getId())
                .header("Authorization", jobSeekerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void getApplicationsByEmployer_Success() throws Exception {
        // Create application
        Application application = new Application();
        application.setJob(job);
        application.setApplicant(jobSeeker);
        application.setStatus(Application.ApplicationStatus.PENDING);
        applicationRepository.save(application);

        mockMvc.perform(get("/api/applications/employer/" + employer.getId())
                .header("Authorization", employerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    void updateApplicationStatus_AsEmployer_Success() throws Exception {
        Application application = new Application();
        application.setJob(job);
        application.setApplicant(jobSeeker);
        application.setStatus(Application.ApplicationStatus.PENDING);
        application = applicationRepository.save(application);

        mockMvc.perform(put("/api/applications/" + application.getId() + "/status")
                .header("Authorization", employerToken)
                .param("status", "REVIEWING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("REVIEWING"));
    }

    @Test
    void getApplicationById_Success() throws Exception {
        Application application = new Application();
        application.setJob(job);
        application.setApplicant(jobSeeker);
        application.setStatus(Application.ApplicationStatus.PENDING);
        application = applicationRepository.save(application);

        mockMvc.perform(get("/api/applications/" + application.getId())
                .header("Authorization", jobSeekerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(application.getId()));
    }
}
