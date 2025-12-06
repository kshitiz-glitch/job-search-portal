// MongoDB initialization script for Docker
db = db.getSiblingDB('jobportal');

// Create collections
db.createCollection('users');
db.createCollection('jobs');
db.createCollection('applications');
db.createCollection('notifications');
db.createCollection('messages');

// Create indexes
db.users.createIndex({ "email": 1 }, { unique: true });
db.jobs.createIndex({ "title": "text", "description": "text" });
db.jobs.createIndex({ "postedBy": 1 });
db.jobs.createIndex({ "status": 1 });
db.jobs.createIndex({ "createdAt": -1 });
db.applications.createIndex({ "applicant": 1 });
db.applications.createIndex({ "job": 1 });
db.applications.createIndex({ "status": 1 });
db.notifications.createIndex({ "userId": 1, "read": 1 });
db.notifications.createIndex({ "createdAt": -1 });

print('Database initialized successfully!');
