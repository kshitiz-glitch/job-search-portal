package com.jobportal.controller;

import com.jobportal.dto.ApplicationRequest;
import com.jobportal.model.Application;
import com.jobportal.model.Application.ApplicationStatus;
import com.jobportal.service.ApplicationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<?> submitApplication(@RequestBody ApplicationRequest request) {
        try {
            Application application = applicationService.submitApplication(request);
            return ResponseEntity.ok(application);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<Application> updateStatus(
            @PathVariable String id,
            @RequestBody Map<String, Object> updates) {

        ApplicationStatus status = ApplicationStatus.valueOf((String) updates.get("status"));
        String notes = (String) updates.get("notes");

        return ResponseEntity.ok(applicationService.updateApplicationStatus(id, status, notes));
    }

    @GetMapping("/applicant/{applicantId}")
    @PreAuthorize("hasRole('JOB_SEEKER')")
    public ResponseEntity<List<Application>> getApplicantApplications(@PathVariable String applicantId) {
        return ResponseEntity.ok(applicationService.getApplicationsByApplicant(applicantId));
    }

    @GetMapping("/job/{jobId}")
    @PreAuthorize("hasRole('EMPLOYER')")
    public ResponseEntity<List<Application>> getJobApplications(@PathVariable String jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Application> getApplication(@PathVariable String id) {
        return ResponseEntity.ok(applicationService.getApplicationById(id));
    }
}
