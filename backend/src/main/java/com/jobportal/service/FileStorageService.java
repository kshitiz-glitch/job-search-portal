package com.jobportal.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.jobportal.model.User;
import com.jobportal.repository.UserRepository;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class FileStorageService {

    @Value("${file.upload-dir:uploads}")
    private String uploadDir;

    @Autowired
    private UserRepository userRepository;

    public String storeFile(MultipartFile file, String userId, String fileType) throws IOException {
        // Create upload directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir, fileType);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".pdf";
        String newFilename = userId + "_" + UUID.randomUUID().toString() + extension;

        // Save file
        Path filePath = uploadPath.resolve(newFilename);
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

        return fileType + "/" + newFilename;
    }

    public String storeResume(MultipartFile file, String userId) throws IOException {
        // Validate file type
        String contentType = file.getContentType();
        if (contentType == null || !isValidResumeType(contentType)) {
            throw new IllegalArgumentException("Invalid file type. Only PDF, DOC, and DOCX are allowed.");
        }

        // Validate file size (max 5MB)
        if (file.getSize() > 5 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 5MB limit.");
        }

        String filePath = storeFile(file, userId, "resumes");

        // Update user's resume path
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getProfile() == null) {
            user.setProfile(new User.Profile());
        }
        user.getProfile().setResume(filePath);
        userRepository.save(user);

        return filePath;
    }

    public String storeAvatar(MultipartFile file, String userId) throws IOException {
        // Validate image type
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Invalid file type. Only images are allowed.");
        }

        // Validate file size (max 2MB)
        if (file.getSize() > 2 * 1024 * 1024) {
            throw new IllegalArgumentException("File size exceeds 2MB limit.");
        }

        String filePath = storeFile(file, userId, "avatars");

        // Update user's avatar path
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        if (user.getProfile() == null) {
            user.setProfile(new User.Profile());
        }
        user.getProfile().setAvatar(filePath);
        userRepository.save(user);

        return filePath;
    }

    public void deleteFile(String filePath) throws IOException {
        Path path = Paths.get(uploadDir, filePath);
        Files.deleteIfExists(path);
    }

    private boolean isValidResumeType(String contentType) {
        return contentType.equals("application/pdf") ||
                contentType.equals("application/msword") ||
                contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document");
    }
}
