package com.jobportal.repository;

import com.jobportal.model.Application;
import com.jobportal.model.Application.ApplicationStatus;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ApplicationRepository extends MongoRepository<Application, String> {
    List<Application> findByApplicantId(String applicantId);

    List<Application> findByJobId(String jobId);

    List<Application> findByStatus(ApplicationStatus status);

    Optional<Application> findByJobIdAndApplicantId(String jobId, String applicantId);

    boolean existsByJobIdAndApplicantId(String jobId, String applicantId);

    long countByJobId(String jobId);
}
