const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const moongoose = require("mongoose");
const authRoutes = require("./routes/authRoutes");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


//routes
app.use("/api/auth", authRoutes);

// connect to MongoDB
moongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((error) => {
    console.error("Error connecting to MongoDB:", error);
});


const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("Eventora Server is running");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
