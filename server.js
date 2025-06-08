const express = require("express");
const bodyParser = require("body-parser");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post("/webhook", async (req, res) => {
  try {
    const { indicator, symbol, interval, value } = req.body;

    const prompt = `You are a forex sniper. Symbol: ${symbol}, TF: ${interval}, Event: ${indicator}, Value: ${value}. 
What should I do: BUY, SELL, or WAIT? Give 1-line reason. Include entry, SL, TP.`;

    const chat = await openai.createChatCompletion({
      model: "gpt-4", // or "gpt-3.5-turbo"
      messages: [{ role: "user", content: prompt }],
    });

    const reply = chat.data.choices[0].message.content;
    console.log("GPT:", reply);
    res.send({ reply });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).send("ChatGPT error");
  }
});

app.get("/", (req, res) => {
  res.send("GPT Forex Bot is running.");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
