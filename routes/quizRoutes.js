import e from "express";
import pool from "../db.js";

const quizRouter = e.Router();

quizRouter.get("/", async (req, res) => {
  try {
    if (req.query.detailed !== "true") {
      const queryResponse = await pool.query(
        `
        SELECT * FROM quiz;
        `
      );
      const quizzes = queryResponse.rows;
      return res.status(200).send(quizzes);
    } else {
      const answerResponse = await pool.query(
        `
        SELECT * FROM answer;
        `
      );
      const questionResponse = await pool.query(
        `
        SELECT * FROM question;
        `
      );
      const quizResponse = await pool.query(
        `
        SELECT * FROM quiz;
        `
      );

      const quizzes = [];

      for (const quiz of quizResponse.rows) {
        quiz.questions = [];
        for (const question of questionResponse.rows) {
          question.answers = [];
          for (const answer of answerResponse.rows) {
            answer.question_id === question.id
              ? question.answers.push(answer)
              : null;
          }
          quiz.id === question.quiz_id ? quiz.questions.push(question) : null;
        }
        quizzes.push(quiz);
      }

      return res.status(200).send(quizzes);
    }
  } catch (err) {
    return res.status(404).json({ error: err });
  }
});

export default quizRouter;
