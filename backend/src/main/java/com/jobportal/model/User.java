package com.jobportal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "users")
public class User {
    @Id
    private String id;

    @Indexed(unique = true)
    private String email;

    private String password;

    private UserRole role; // JOB_SEEKER or EMPLOYER

    private Profile profile;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private boolean enabled = true;

    private List<String> savedJobs = new ArrayList<>(); // List of saved/bookmarked job IDs

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Profile {
        private String firstName;
        private String lastName;
        private String phone;
        private String location;
        private String avatar;
        private String resume;
        private List<String> skills = new ArrayList<>();
        private Integer experience; // years
        private List<Education> education = new ArrayList<>();
        private String bio;
        private String linkedIn;
        private String github;
        private String portfolio;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Education {
        private String degree;
        private String institution;
        private String field;
        private Integer startYear;
        private Integer endYear;
    }

    public enum UserRole {
        JOB_SEEKER,
        EMPLOYER
    }
}
