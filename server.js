const express = require("express");
const cors = require("cors");
const currentUser = require("./src/middleware/currentUser");
const userRoutes = require("./src/routes/userRoutes");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static("public"));
app.use("/api/users", currentUser, userRoutes);

app.listen(3000, () => console.log("Server chạy tại http://localhost:3000"));
