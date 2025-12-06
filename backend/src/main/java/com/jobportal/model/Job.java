package com.jobportal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;
import org.springframework.data.mongodb.core.index.Indexed;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "jobs")
public class Job {
    @Id
    private String id;

    @Indexed
    private String title;

    @DBRef
    private Company company;

    private String description;
    private List<String> requirements = new ArrayList<>();
    private List<String> skills = new ArrayList<>();

    @Indexed
    private String location;

    private JobType type;

    private Salary salary;

    private JobStatus status = JobStatus.ACTIVE;

    @DBRef
    private User postedBy;

    private int applicants = 0;

    @CreatedDate
    private LocalDateTime createdAt;

    private LocalDateTime expiresAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Salary {
        private Double min;
        private Double max;
        private String currency = "USD";
    }

    public enum JobType {
        FULL_TIME,
        PART_TIME,
        CONTRACT,
        REMOTE,
        INTERNSHIP
    }

    public enum JobStatus {
        ACTIVE,
        CLOSED,
        DRAFT
    }
}
