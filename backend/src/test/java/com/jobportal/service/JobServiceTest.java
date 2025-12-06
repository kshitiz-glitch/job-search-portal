package com.jobportal.service;

import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.JobRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class JobServiceTest {

    @Mock
    private JobRepository jobRepository;

    @InjectMocks
    private JobService jobService;

    private Job testJob;
    private User employer;

    @BeforeEach
    void setUp() {
        employer = new User();
        employer.setId("employer-123");
        employer.setEmail("employer@test.com");
        employer.setRole(User.UserRole.EMPLOYER);

        testJob = new Job();
        testJob.setId("job-123");
        testJob.setTitle("Developer");
        testJob.setDescription("Job description");
        testJob.setLocation("NYC");
        testJob.setType(Job.JobType.FULL_TIME);
        testJob.setStatus(Job.JobStatus.ACTIVE);
        testJob.setPostedBy(employer);
    }

    @Test
    void createJob_Success() {
        when(jobRepository.save(any(Job.class))).thenReturn(testJob);

        Job result = jobService.createJob(testJob);

        assertNotNull(result);
        assertEquals("job-123", result.getId());
        assertEquals("Developer", result.getTitle());
        verify(jobRepository).save(testJob);
    }

    @Test
    void getJobById_Success() {
        when(jobRepository.findById("job-123")).thenReturn(Optional.of(testJob));

        Job result = jobService.getJobById("job-123");

        assertNotNull(result);
        assertEquals("Developer", result.getTitle());
    }

    @Test
    void getJobById_NotFound_ThrowsException() {
        when(jobRepository.findById("nonexistent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> jobService.getJobById("nonexistent"));
    }

    @Test
    void getAllActiveJobs_Success() {
        List<Job> jobs = Arrays.asList(testJob);
        Page<Job> jobPage = new PageImpl<>(jobs);
        when(jobRepository.findByStatus(eq(Job.JobStatus.ACTIVE), any(Pageable.class))).thenReturn(jobPage);

        Page<Job> result = jobService.getAllActiveJobs(Pageable.unpaged());

        assertEquals(1, result.getTotalElements());
        assertEquals("Developer", result.getContent().get(0).getTitle());
    }

    @Test
    void updateJob_Success() {
        when(jobRepository.findById("job-123")).thenReturn(Optional.of(testJob));
        when(jobRepository.save(any(Job.class))).thenReturn(testJob);

        testJob.setTitle("Senior Developer");
        Job result = jobService.updateJob("job-123", testJob);

        assertNotNull(result);
        verify(jobRepository).save(any(Job.class));
    }

    @Test
    void updateJob_NotFound_ThrowsException() {
        when(jobRepository.findById("nonexistent")).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> jobService.updateJob("nonexistent", testJob));
    }

    @Test
    void deleteJob_Success() {
        doNothing().when(jobRepository).deleteById("job-123");

        assertDoesNotThrow(() -> jobService.deleteJob("job-123"));
        verify(jobRepository).deleteById("job-123");
    }

    @Test
    void getJobsByEmployer_Success() {
        List<Job> jobs = Arrays.asList(testJob);
        when(jobRepository.findByPostedById("employer-123")).thenReturn(jobs);

        List<Job> result = jobService.getJobsByEmployer("employer-123");

        assertEquals(1, result.size());
        assertEquals("Developer", result.get(0).getTitle());
    }
}
