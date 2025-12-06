package com.jobportal.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.DBRef;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Document(collection = "notifications")
public class Notification {
    @Id
    private String id;

    @DBRef
    private User user;

    private String title;
    private String message;
    private NotificationType type;

    private boolean read = false;

    private String link; // Optional link to related resource

    private String employerEmail; // Email of employer for status notifications

    @CreatedDate
    private LocalDateTime createdAt;

    public enum NotificationType {
        APPLICATION_RECEIVED,
        APPLICATION_STATUS_CHANGED,
        NEW_MESSAGE,
        JOB_RECOMMENDATION,
        JOB_EXPIRING_SOON
    }
}
