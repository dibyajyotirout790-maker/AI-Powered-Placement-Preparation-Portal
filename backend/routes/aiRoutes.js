require("dotenv").config();

const express = require("express");
const { GoogleGenAI } = require("@google/genai");

const router = express.Router();

// Check that the API key exists without printing the actual key
console.log(
  "Gemini API key loaded:",
  process.env.GEMINI_API_KEY ? "YES" : "NO"
);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


// ==========================================
// TEST GEMINI
// ==========================================

router.post("/test", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    let response;

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`Gemini attempt ${attempt}/${maxRetries}`);

        response = await ai.models.generateContent({
         model: "gemini-3.5-flash-lite",
          contents: message
        });

        break;

      } catch (error) {

        console.log(`Gemini attempt ${attempt} failed:`, error.message);

        const isTemporaryError =
          error.status === 503 ||
          error.status === 429 ||
          error.code === 503 ||
          error.code === 429;

        if (!isTemporaryError || attempt === maxRetries) {
          throw error;
        }

        const delay = 2000 * Math.pow(2, attempt - 1);

        console.log(`Retrying in ${delay / 1000} seconds...`);

        await new Promise(resolve =>
          setTimeout(resolve, delay)
        );
      }
    }

    res.json({
      success: true,
      response: response.text
    });

  } catch (error) {

    console.error("Gemini error:", error);

    res.status(503).json({
      success: false,
      message: "Gemini service is temporarily unavailable.",
      error: error.message
    });
  }
});


router.post("/interview", async (req, res) => {
  try {
    const {
      role = "Software Developer",
      difficulty = "medium",
      count = 5
    } = req.body;

    const prompt = `
You are an experienced technical interviewer.

Generate ${count} interview questions for a ${role} placement interview.

Difficulty: ${difficulty}

Requirements:
- Mix technical and practical questions.
- Keep questions suitable for a computer science student.
- Do not provide answers.
- Number each question clearly.
`;

  const response = await ai.models.generateContent({
  model: "gemini-3.5-flash-lite",
  contents: prompt
});

    res.json({
      success: true,
      role,
      difficulty,
      questions: response.text
    });

  } catch (error) {
    console.error("Interview AI error:", error);

    res.status(500).json({
      success: false,
      message: "Interview question generation failed",
      error: error.message
    });
  }
});

// Evaluate interview answer
router.post("/evaluate", async (req, res) => {
  try {
    const { question, answer } = req.body;

    if (!question || !answer) {
      return res.status(400).json({
        success: false,
        message: "Question and answer are required"
      });
    }

    const prompt = `
You are an expert technical interviewer.

Evaluate the candidate's answer to the following interview question.

Question:
${question}

Candidate Answer:
${answer}

Provide:
1. Score out of 10
2. What was good about the answer
3. What could be improved
4. A better sample answer

Keep the evaluation suitable for a computer science placement interview.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt
    });

    const evaluation = response.text;

    return res.status(200).json({
      success: true,
      question,
      answer,
      evaluation
    });

  } catch (error) {
    console.error("Gemini evaluation error:", error);

    return res.status(503).json({
      success: false,
      message: "Gemini service is temporarily unavailable.",
      error: error.message
    });
  }
});

// ==========================================
// AI CAREER ASSISTANT
// ==========================================

router.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required"
      });
    }

    const prompt = `
You are an AI Career Assistant for a computer science placement preparation portal.

The user is a computer science student preparing for internships and placements.

Answer the user's question clearly and practically.

Your responsibilities:
- Help with programming and technical interview preparation.
- Explain computer science concepts in simple language.
- Give placement preparation advice.
- Help with resume and interview preparation.
- Suggest learning paths for software development roles.
- Give examples and code when appropriate.
- Do not invent company policies, job openings, or placement statistics.
- Keep answers concise but useful.
- Use headings and bullet points when helpful.

User question:
${message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt
    });

    return res.status(200).json({
      success: true,
      message,
      response: response.text
    });

  } catch (error) {
    console.error("Career Assistant AI error:", error);

    return res.status(503).json({
      success: false,
      message: "Gemini service is temporarily unavailable.",
      error: error.message
    });
  }
});

module.exports = router;