package com.jobportal.controller;

import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JobRepository jobRepository;

    // Get current user profile
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Don't return password
        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    // Update user profile
    @PutMapping("/me")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody User.Profile profile) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setProfile(profile);
        userRepository.save(user);

        user.setPassword(null);
        return ResponseEntity.ok(user);
    }

    // Get saved jobs
    @GetMapping("/me/saved-jobs")
    public ResponseEntity<?> getSavedJobs(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> savedJobIds = user.getSavedJobs();
        if (savedJobIds == null || savedJobIds.isEmpty()) {
            return ResponseEntity.ok(new ArrayList<>());
        }

        List<Job> savedJobs = jobRepository.findAllById(savedJobIds);
        return ResponseEntity.ok(savedJobs);
    }

    // Save/Bookmark a job
    @PostMapping("/me/saved-jobs/{jobId}")
    public ResponseEntity<?> saveJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String jobId) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if job exists
        if (!jobRepository.existsById(jobId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Job not found"));
        }

        List<String> savedJobs = user.getSavedJobs();
        if (savedJobs == null) {
            savedJobs = new ArrayList<>();
        }

        if (!savedJobs.contains(jobId)) {
            savedJobs.add(jobId);
            user.setSavedJobs(savedJobs);
            userRepository.save(user);
        }

        return ResponseEntity.ok(Map.of("message", "Job saved successfully", "savedJobs", savedJobs));
    }

    // Remove saved job
    @DeleteMapping("/me/saved-jobs/{jobId}")
    public ResponseEntity<?> removeSavedJob(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String jobId) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> savedJobs = user.getSavedJobs();
        if (savedJobs != null) {
            savedJobs.remove(jobId);
            user.setSavedJobs(savedJobs);
            userRepository.save(user);
        }

        return ResponseEntity.ok(Map.of("message", "Job removed from saved", "savedJobs",
                savedJobs != null ? savedJobs : new ArrayList<>()));
    }

    // Check if job is saved
    @GetMapping("/me/saved-jobs/{jobId}/check")
    public ResponseEntity<?> isJobSaved(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable String jobId) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<String> savedJobs = user.getSavedJobs();
        boolean isSaved = savedJobs != null && savedJobs.contains(jobId);

        return ResponseEntity.ok(Map.of("isSaved", isSaved));
    }

    // Get user stats (for dashboard)
    @GetMapping("/me/stats")
    public ResponseEntity<?> getUserStats(@AuthenticationPrincipal UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> stats = new HashMap<>();
        stats.put("savedJobsCount", user.getSavedJobs() != null ? user.getSavedJobs().size() : 0);
        stats.put("profileComplete", isProfileComplete(user));

        return ResponseEntity.ok(stats);
    }

    private boolean isProfileComplete(User user) {
        if (user.getProfile() == null)
            return false;
        User.Profile profile = user.getProfile();
        return profile.getFirstName() != null && !profile.getFirstName().isEmpty()
                && profile.getLastName() != null && !profile.getLastName().isEmpty()
                && profile.getPhone() != null && !profile.getPhone().isEmpty()
                && profile.getLocation() != null && !profile.getLocation().isEmpty();
    }
}
