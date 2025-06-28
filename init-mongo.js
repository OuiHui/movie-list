// MongoDB initialization script
// This script runs when the MongoDB container starts for the first time

// Switch to movieapp database
db = db.getSiblingDB('movieapp');

// Create a user for the application
db.createUser({
  user: 'movieapp',
  pwd: 'movieapppassword',
  roles: [
    {
      role: 'readWrite',
      db: 'movieapp'
    }
  ]
});

// Create initial collections with indexes
db.createCollection('lists');
db.createCollection('movies');

// Create indexes for better performance
db.lists.createIndex({ "name": 1 });
db.lists.createIndex({ "isDefault": 1 });
db.movies.createIndex({ "listId": 1 });
db.movies.createIndex({ "rank": 1 });
db.movies.createIndex({ "title": 1 });

// Insert a default list
db.lists.insertOne({
  name: "My Movies",
  description: "Default movie list",
  isDefault: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print("Database initialization completed successfully!");
