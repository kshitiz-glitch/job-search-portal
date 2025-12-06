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
@Document(collection = "companies")
public class Company {
    @Id
    private String id;

    private String name;
    private String logo;
    private String description;
    private String industry;
    private String size; // e.g., "1-10", "11-50", "51-200", "201-500", "500+"
    private String website;
    private String location;

    @DBRef
    private User owner;

    @CreatedDate
    private LocalDateTime createdAt;
}
