package com.jobportal.service;

import com.jobportal.model.Job;
import com.jobportal.model.Job.JobStatus;
import com.jobportal.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;

    public Job createJob(Job job) {
        job.setStatus(JobStatus.ACTIVE);
        job.setCreatedAt(java.time.LocalDateTime.now());
        job.setApplicants(0);
        return jobRepository.save(job);
    }

    public Job updateJob(String id, Job job) {
        Job existingJob = jobRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Job not found"));

        existingJob.setTitle(job.getTitle());
        existingJob.setDescription(job.getDescription());
        existingJob.setRequirements(job.getRequirements());
        existingJob.setSkills(job.getSkills());
        existingJob.setLocation(job.getLocation());
        existingJob.setType(job.getType());
        existingJob.setSalary(job.getSalary());
        existingJob.setExpiresAt(job.getExpiresAt());

        return jobRepository.save(existingJob);
    }

    public void deleteJob(String id) {
        jobRepository.deleteById(Objects.requireNonNull(id));
    }

    public Job getJobById(String id) {
        return jobRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Job not found"));
    }

    public Page<Job> getAllActiveJobs(Pageable pageable) {
        return jobRepository.findByStatus(JobStatus.ACTIVE, pageable);
    }

    public Page<Job> searchJobs(String keyword, Pageable pageable) {
        if (keyword == null || keyword.isEmpty()) {
            return getAllActiveJobs(pageable);
        }
        return jobRepository.searchJobs(keyword, pageable);
    }

    public List<Job> getJobsByEmployer(String employerId) {
        return jobRepository.findByPostedById(employerId);
    }

    public Page<Job> getRecommendedJobs(List<String> skills, Pageable pageable) {
        if (skills == null || skills.isEmpty()) {
            return getAllActiveJobs(pageable);
        }
        return jobRepository.findByStatusAndSkillsIn(JobStatus.ACTIVE, skills, pageable);
    }
}
