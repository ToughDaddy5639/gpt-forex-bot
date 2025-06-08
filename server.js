const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

app.post('/webhook', async (req, res) => {
  const { symbol, interval, indicator, value } = req.body;

  const prompt = `Symbol: ${symbol}, Interval: ${interval}, Indicator: ${indicator}, Value: ${value}.
Give a decision: BUY, SELL, or WAIT with 1-sentence reason.`;

  try {
    const completion = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.5,
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    const decision = completion.data.choices[0].message.content.trim();
    res.json({ decision });
  } catch (error) {
    console.error('Error from OpenAI:', error.response?.data || error.message);
    res.status(500).send('Error processing alert');
  }
});

app.get('/', (req, res) => {
  res.send('Forex bot online');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
