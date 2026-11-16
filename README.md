# MongoDB Express API

A RESTful API built with **Node.js**, **Express**, and **Mongoose** that stores data in **MongoDB**. It provides full CRUD operations with schema validation and is ready to deploy with MongoDB Atlas.

## Features

- Full CRUD operations (Create, Read, Update, Delete)
- MongoDB persistence with Mongoose schemas
- Input validation and ObjectId checking
- Proper HTTP status codes and JSON error responses
- Environment-based configuration with dotenv
- Deployment-ready (dynamic port support)

## Tech Stack

- Node.js
- Express.js
- MongoDB (Atlas)
- Mongoose
- dotenv

## Project Structure

```
mongo-express-api/
├── models/
│   └── Item.js
├── routes/
│   └── items.js
├── .env
├── .gitignore
├── server.js
├── package.json
└── README.md
```
