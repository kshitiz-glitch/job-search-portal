package com.jobportal.service;

import com.jobportal.dto.ApplicationRequest;
import com.jobportal.model.Application;
import com.jobportal.model.Application.ApplicationStatus;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final NotificationService notificationService;

    public Application submitApplication(ApplicationRequest request) {
        // Check if already applied
        if (applicationRepository.existsByJobIdAndApplicantId(request.getJobId(), request.getApplicantId())) {
            throw new RuntimeException("You have already applied for this job");
        }

        // Fetch the actual Job and User entities
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new RuntimeException("Job not found"));
        User applicant = userRepository.findById(request.getApplicantId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Create the application
        Application application = new Application();
        application.setJob(job);
        application.setApplicant(applicant);
        application.setCoverLetter(request.getCoverLetter());
        application.setResume(request.getResumeFileName());
        application.setStatus(ApplicationStatus.PENDING);

        Application savedApplication = applicationRepository.save(application);

        // Update job applicants count
        job.setApplicants(job.getApplicants() + 1);
        jobRepository.save(job);

        // Send notification to employer
        notificationService.createApplicationNotification(savedApplication);

        return savedApplication;
    }

    public Application submitApplication(Application application) {
        // Check if already applied
        if (applicationRepository.existsByJobIdAndApplicantId(
                application.getJob().getId(),
                application.getApplicant().getId())) {
            throw new RuntimeException("You have already applied for this job");
        }

        Application savedApplication = applicationRepository.save(application);

        // Update job applicants count
        Job job = application.getJob();
        job.setApplicants(job.getApplicants() + 1);
        jobRepository.save(job);

        // Send notification to employer
        notificationService.createApplicationNotification(savedApplication);

        return savedApplication;
    }

    public Application updateApplicationStatus(String id, ApplicationStatus status, String notes) {
        Application application = applicationRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Application not found"));

        application.setStatus(status);
        if (notes != null) {
            application.setEmployerNotes(notes);
        }

        Application updated = applicationRepository.save(application);

        // Notify applicant of status change
        notificationService.createStatusChangeNotification(updated);

        return updated;
    }

    public List<Application> getApplicationsByApplicant(String applicantId) {
        return applicationRepository.findByApplicantId(applicantId);
    }

    public List<Application> getApplicationsByJob(String jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public Application getApplicationById(String id) {
        return applicationRepository.findById(Objects.requireNonNull(id))
                .orElseThrow(() -> new RuntimeException("Application not found"));
    }
}
