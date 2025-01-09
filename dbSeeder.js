import pool from "./db.js";
import he from "he";

const fetchData = async () => {
  try {
    const category = 17;
    const difficulty = "medium";
    const type = "boolean";
    const response = await fetch(
      `https://opentdb.com/api.php?amount=10&category=${category}&difficulty=${difficulty}&type=${type}`
    );

    if (!response.ok)
      throw new Error(`Failed to fetch data: ${response.statusText}`);

    const data = await response.json();
    const results = data.results;
    const quizData = {};

    if (results.length > 0) {
      quizData.title = he.decode(
        `${results[0].category} Quiz - ${results[0].difficulty}`
      );
      quizData.difficulty = results[0].difficulty.toUpperCase();
      quizData.category = he.decode(results[0].category);

      quizData.questions = [];
      for (const i of results) {
        const q_text = he.decode(i.question);
        const q_type = i.type === "multiple" ? "MULTIPLE" : "TRUE/FALSE";
        const q_answers = [
          { text: he.decode(i.correct_answer), isCorrect: true },
        ];
        for (const j of i.incorrect_answers) {
          q_answers.push({ text: he.decode(j), isCorrect: false });
        }
        quizData.questions.push({
          text: q_text,
          type: q_type,
          answers: q_answers,
        });
      }
    }

    return quizData;
  } catch (err) {
    console.error("Error fetching quiz data: ", err);
    throw err;
  }
};

const dbSeeder = async () => {
  try {
    const quizData = await fetchData();

    const quizResult = await pool.query(
      `
      INSERT INTO quiz (title, difficulty, category)
      VALUES ($1, $2, $3)
      RETURNING id;
      `,
      [quizData.title, quizData.difficulty, quizData.category]
    );

    const quizId = quizResult.rows[0].id;

    for (const question of quizData.questions) {
      const questResult = await pool.query(
        `
        INSERT INTO question (text, type, quiz_id)
        VALUES ($1, $2, $3)
        RETURNING id;
        `,
        [question.text, question.type, quizId]
      );

      const questionId = questResult.rows[0].id;

      for (const answer of question.answers) {
        await pool.query(
          `
          INSERT INTO answer (answer_text, is_correct, question_id)
          VALUES ($1, $2, $3);
          `,
          [answer.text, answer.isCorrect, questionId]
        );
      }
    }

    console.log("Database successfully seeded!");
  } catch (err) {
    console.error("Error: ", err);
  }
};

dbSeeder();
