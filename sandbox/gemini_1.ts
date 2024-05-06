// Original code from https://ai.google.dev/tutorials/get_started_node#set-up-project

const { GoogleGenerativeAI } = require("@google/generative-ai");
import * as dotenv from "dotenv";
dotenv.config(); // Load environment variables from .env file

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.BARD_API_KEY);

async function run() {
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = "Write a story about a magic backpack.";

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  console.log(text);
}

run();
