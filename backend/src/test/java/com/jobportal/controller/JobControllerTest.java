package com.jobportal.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.model.Job;
import com.jobportal.model.User;
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

import java.util.Arrays;
import java.util.Collections;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class JobControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

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

    @BeforeEach
    void setUp() {
        jobRepository.deleteAll();
        userRepository.deleteAll();

        // Create employer
        employer = new User();
        employer.setEmail("employer@test.com");
        employer.setPassword(passwordEncoder.encode("password123"));
        employer.setRole(User.UserRole.EMPLOYER);
        User.Profile employerProfile = new User.Profile();
        employerProfile.setFirstName("Tech");
        employerProfile.setLastName("Corp");
        employer.setProfile(employerProfile);
        employer = userRepository.save(employer);

        // Create UserDetails for token generation
        UserDetails employerDetails = org.springframework.security.core.userdetails.User
                .withUsername(employer.getEmail())
                .password(employer.getPassword())
                .authorities("ROLE_EMPLOYER")
                .build();
        employerToken = "Bearer " + jwtUtil.generateToken(employerDetails);

        // Create job seeker
        User jobSeeker = new User();
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
    }

    @Test
    void createJob_AsEmployer_Success() throws Exception {
        Job job = createSampleJob();

        mockMvc.perform(post("/api/jobs")
                .header("Authorization", employerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(job)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Senior Developer"))
                .andExpect(jsonPath("$.location").value("San Francisco, CA"));
    }

    @Test
    void getAllJobs_Success() throws Exception {
        // Create sample jobs
        Job job1 = createSampleJob();
        job1.setTitle("Frontend Developer");
        job1.setPostedBy(employer);
        jobRepository.save(job1);

        Job job2 = createSampleJob();
        job2.setTitle("Backend Developer");
        job2.setPostedBy(employer);
        jobRepository.save(job2);

        mockMvc.perform(get("/api/jobs")
                .header("Authorization", jobSeekerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content").isArray());
    }

    @Test
    void getJobById_Success() throws Exception {
        Job job = createSampleJob();
        job.setPostedBy(employer);
        job = jobRepository.save(job);

        mockMvc.perform(get("/api/jobs/" + job.getId())
                .header("Authorization", jobSeekerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Senior Developer"));
    }

    @Test
    void getJobById_NotFound() throws Exception {
        mockMvc.perform(get("/api/jobs/nonexistent-id")
                .header("Authorization", jobSeekerToken))
                .andExpect(status().isNotFound());
    }

    @Test
    void searchJobs_ByLocation_Success() throws Exception {
        Job job = createSampleJob();
        job.setPostedBy(employer);
        jobRepository.save(job);

        mockMvc.perform(get("/api/jobs/search")
                .param("location", "San Francisco"))
                .andExpect(status().isOk());
    }

    @Test
    void updateJob_AsOwner_Success() throws Exception {
        Job job = createSampleJob();
        job.setPostedBy(employer);
        job = jobRepository.save(job);

        job.setTitle("Updated Title");

        mockMvc.perform(put("/api/jobs/" + job.getId())
                .header("Authorization", employerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(job)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Updated Title"));
    }

    @Test
    void deleteJob_AsOwner_Success() throws Exception {
        Job job = createSampleJob();
        job.setPostedBy(employer);
        job = jobRepository.save(job);

        mockMvc.perform(delete("/api/jobs/" + job.getId())
                .header("Authorization", employerToken))
                .andExpect(status().isOk());
    }

    private Job createSampleJob() {
        Job job = new Job();
        job.setTitle("Senior Developer");
        job.setDescription("We are looking for a senior developer...");
        job.setLocation("San Francisco, CA");
        job.setType(Job.JobType.FULL_TIME);
        job.setStatus(Job.JobStatus.ACTIVE);
        job.setSkills(Arrays.asList("Java", "Spring Boot", "MongoDB"));

        Job.Salary salary = new Job.Salary();
        salary.setMin(100000.0);
        salary.setMax(150000.0);
        salary.setCurrency("USD");
        job.setSalary(salary);

        return job;
    }
}
