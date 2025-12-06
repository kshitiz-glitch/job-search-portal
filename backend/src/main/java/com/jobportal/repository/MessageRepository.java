package com.jobportal.repository;

import com.jobportal.model.Message;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends MongoRepository<Message, String> {
    @Query("{ $or: [ { 'sender.id': ?0, 'receiver.id': ?1 }, { 'sender.id': ?1, 'receiver.id': ?0 } ] }")
    List<Message> findConversation(String userId1, String userId2);

    List<Message> findByReceiverIdAndReadFalse(String receiverId);

    long countByReceiverIdAndReadFalse(String receiverId);
}
