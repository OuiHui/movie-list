db = db.getSiblingDB('movieapp');

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


db.createCollection('lists');
db.createCollection('movies');
db.lists.createIndex({ "name": 1 });
db.lists.createIndex({ "isDefault": 1 });
db.movies.createIndex({ "listId": 1 });
db.movies.createIndex({ "rank": 1 });
db.movies.createIndex({ "title": 1 });

db.lists.insertOne({
  name: "My Movies",
  description: "Default movie list",
  isDefault: true,
  createdAt: new Date(),
  updatedAt: new Date()
});

print("Database initialization completed successfully!");
