require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Config JSON response
app.use(express.json());

// Config URLenconded
app.use(express.urlencoded({ extended: true }));

// Solve CORS
app.use(cors({ credentials: true, origin: process.env.CLIENT_ORIGIN }));

// Public folder for images
app.use(express.static("public"));

// Routes

app.listen(5000);
