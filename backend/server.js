const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");
const pickupRoutes = require("./routes/pickups");
const driverRoutes = require("./routes/drivers");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "FoodLoop driver API is running",
  });
});

app.use("/api/pickups", pickupRoutes);
app.use("/api/drivers", driverRoutes);

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

startServer();
