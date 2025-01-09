import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes.js";
import quizRouter from "./routes/quizRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use("/auth", authRoutes);
app.use("/quizzes", quizRouter);

app.get("/", (req, res) => res.send("<h1>Quiz App API is running!</h1>"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}....`));
