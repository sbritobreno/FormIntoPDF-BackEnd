require("dotenv").config();
const express = require("express");
const cors = require("cors");
const PORT = 5000;

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
const UserRoutes = require("./routes/UserRoutes");
const DocumentRoutes = require("./routes/DocumentRoutes");
const PdfRoutes = require("./routes/PdfRoutes");

app.use("/user", UserRoutes);
app.use("/document", DocumentRoutes);
app.use("/pdf", PdfRoutes);

app.listen(proccess.env.PORT || PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
