package com.jobportal.repository;

import com.jobportal.model.Job;
import com.jobportal.model.Job.JobStatus;
import com.jobportal.model.Job.JobType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobRepository extends MongoRepository<Job, String> {
    Page<Job> findByStatus(JobStatus status, Pageable pageable);

    Page<Job> findByStatusAndTitleContainingIgnoreCase(JobStatus status, String title, Pageable pageable);

    Page<Job> findByStatusAndLocationContainingIgnoreCase(JobStatus status, String location, Pageable pageable);

    Page<Job> findByStatusAndType(JobStatus status, JobType type, Pageable pageable);

    @Query("{ 'status': ?0, 'skills': { $in: ?1 } }")
    Page<Job> findByStatusAndSkillsIn(JobStatus status, List<String> skills, Pageable pageable);

    List<Job> findByPostedById(String userId);

    @Query("{ 'status': 'ACTIVE', $or: [ { 'title': { $regex: ?0, $options: 'i' } }, { 'description': { $regex: ?0, $options: 'i' } }, { 'skills': { $regex: ?0, $options: 'i' } } ] }")
    Page<Job> searchJobs(String keyword, Pageable pageable);
}
