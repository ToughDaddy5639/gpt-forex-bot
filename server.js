const express = require('express');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// 🔥 Add webhook route here
app.post('/webhook', async (req, res) => {
  const { symbol, interval, indicator, value } = req.body;

  const prompt = `Act as a professional forex sniper. Analyze this signal:\nSymbol: ${symbol}\nTimeframe: ${interval}\nIndicator: ${indicator}\nValue: ${value}\nWhat should we do? (BUY, SELL, WAIT) with short reason.`;

  try {
    const response = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [{ role: 'user', content: prompt }],
    });

    const reply = response.data.choices[0].message.content;
    res.json({ decision: reply });
  } catch (error) {
    console.error('GPT error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Something went wrong with ChatGPT' });
  }
});

app.get('/', (req, res) => {
  res.send('Bot is live');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
