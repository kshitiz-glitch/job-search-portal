package com.jobportal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "applications")
public class Application {
    @Id
    private String id;

    @DBRef
    private Job job;

    @DBRef
    private User applicant;

    private String resume;
    private String coverLetter;

    private ApplicationStatus status = ApplicationStatus.PENDING;

    @CreatedDate
    private LocalDateTime appliedAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    private String employerNotes;

    public enum ApplicationStatus {
        PENDING,
        REVIEWED,
        SHORTLISTED,
        INTERVIEW_SCHEDULED,
        REJECTED,
        ACCEPTED
    }
}
