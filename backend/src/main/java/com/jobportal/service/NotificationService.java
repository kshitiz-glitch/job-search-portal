package com.jobportal.service;

import com.jobportal.model.Application;
import com.jobportal.model.Notification;
import com.jobportal.model.Notification.NotificationType;
import com.jobportal.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;

    public Notification createNotification(Notification notification) {
        return notificationRepository.save(Objects.requireNonNull(notification));
    }

    public List<Notification> getUserNotifications(String userId) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Notification> getUnreadNotifications(String userId) {
        return notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
    }

    public long getUnreadCount(String userId) {
        return notificationRepository.countByUserIdAndReadFalse(userId);
    }

    public void markAsRead(String notificationId) {
        Notification notification = notificationRepository.findById(Objects.requireNonNull(notificationId))
                .orElseThrow(() -> new RuntimeException("Notification not found"));
        notification.setRead(true);
        notificationRepository.save(notification);
    }

    public void markAllAsRead(String userId) {
        List<Notification> notifications = notificationRepository.findByUserIdAndReadFalseOrderByCreatedAtDesc(userId);
        notifications.forEach(n -> n.setRead(true));
        notificationRepository.saveAll(notifications);
    }

    public void createApplicationNotification(Application application) {
        Notification notification = new Notification();
        notification.setUser(application.getJob().getPostedBy());
        notification.setTitle("New Application Received");
        notification.setMessage(application.getApplicant().getProfile().getFirstName() +
                " " + application.getApplicant().getProfile().getLastName() +
                " applied for " + application.getJob().getTitle());
        notification.setType(NotificationType.APPLICATION_RECEIVED);
        notification.setLink("/applications/" + application.getId());
        notificationRepository.save(notification);
    }

    public void createStatusChangeNotification(Application application) {
        Notification notification = new Notification();
        notification.setUser(application.getApplicant());
        notification.setTitle("Application Status Updated");

        // Get employer email
        String employerEmail = application.getJob().getPostedBy().getEmail();

        // Create detailed message with employer contact
        String statusMessage = getStatusMessage(application.getStatus().name());
        notification.setMessage(
                "Your application for \"" + application.getJob().getTitle() + "\" has been " + statusMessage + ". " +
                        "Contact employer: " + employerEmail);
        notification.setType(NotificationType.APPLICATION_STATUS_CHANGED);
        notification.setLink("/applications");
        notification.setEmployerEmail(employerEmail); // Store for easy frontend access
        notificationRepository.save(notification);
    }

    private String getStatusMessage(String status) {
        switch (status) {
            case "SHORTLISTED":
                return "shortlisted ⭐";
            case "INTERVIEW_SCHEDULED":
                return "scheduled for interview 📅";
            case "ACCEPTED":
                return "accepted ✅ Congratulations!";
            case "REJECTED":
                return "not selected at this time";
            case "REVIEWED":
                return "reviewed by the employer";
            default:
                return "updated to " + status;
        }
    }
}
