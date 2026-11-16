
import express from "express";
import { MongoClient, ObjectId } from "mongodb";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const MONGO_URI = "mongodb://admin:admin123@localhost:27017";
let db;
const client = new MongoClient(MONGO_URI);

client
  .connect()
  .then(() => {
    console.log("Connected to MongoDB");
    db = client.db("booksDB");
  })
  .catch((err) => {
    console.log("Unable to connect MongoDB");
  });

// CREATE - POST /api/v1/books
app.post("/api/v1/books", (req, res, next) => {
  const { title, author, category, publishedYear } = req.body;
  db.collection("books")
    .insertOne({ title, author, category, publishedYear })
    .then((result) => {
      res.status(201).json({
        message: "Books added successfully",
        data: { _id: result.insertedId, ...req.body },
      });
    })
    .catch((err) => {
      err.message = "Failed to create book";
      next(err);
    });
});

// READ ALL - GET /api/v1/books?category=...
app.get("/api/v1/books", (req, res, next) => {
  const { category } = req.query;
  const query = category ? { category } : {};
  db.collection("books")
    .find(query)
    .toArray()
    .then((books) => {
      res.status(200).json({
        message: "Books fetched successfully",
        data: books,
      });
    })
    .catch((err) => {
      err.message = "Failed to fetch books";
      next(err);
    });
});

// READ ONE - GET /api/v1/books/:id
app.get("/api/v1/books/:id", (req, res, next) => {
  const { id } = req.params;
  db.collection("books")
    .findOne({ _id: new ObjectId(id) })
    .then((book) => {
      if (!book) {
        res.status(404).json({ message: "Books not found" });
      } else {
        res.status(200).json({
          message: "Book fetched successfully",
          data: book,
        });
      }
    })
    .catch((err) => {
      err.message = "Failed to fetch book";
      next(err);
    });
});

// UPDATE - PUT /api/v1/books/:id
app.put("/api/v1/books/:id", (req, res, next) => {
  const { id } = req.params;
  const { title, author, category, publishedYear } = req.body;
  db.collection("books")
    .updateOne(
      { _id: new ObjectId(id) },
      { $set: { title, author, category, publishedYear } }
    )
    .then((result) => {
      if (result.matchedCount === 0) {
        res.status(404).json({ message: "Book not found" });
      } else {
        res.status(200).json({ message: "Book updated successfully" });
      }
    })
    .catch((err) => {
      err.message = "Failed to update book";
      next(err);
    });
});

// DELETE - DELETE /api/v1/books/:id
app.delete("/api/v1/books/:id", (req, res, next) => {
  const { id } = req.params;
  db.collection("books")
    .deleteOne({ _id: new ObjectId(id) })
    .then((result) => {
      if (result.deletedCount === 0) {
        res.status(404).json({ message: "Books not found" });
      } else {
        res.status(200).json({ message: "Books deleted successfully" });
      }
    })
    .catch((err) => {
      err.message = "Failed to delete book";
      next(err);
    });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Internal server error";
  res.status(status).json({ message });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});