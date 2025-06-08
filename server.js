app.post('/webhook', async (req, res) => {
  const { symbol, interval, indicator, value } = req.body;

  const prompt = `Symbol: ${symbol}\nInterval: ${interval}\nIndicator: ${indicator}\nValue: ${value}\n\nGive a trading decision (BUY, SELL, WAIT) and 1-line reason.`;

  try {
    const gptResponse = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a sniper forex analyst.' },
        { role: 'user', content: prompt }
      ]
    });

    const decision = gptResponse.data.choices[0].message.content;
    console.log('ChatGPT Decision:', decision);

    res.json({ decision }); // 👈 this will show up in Postman
  } catch (err) {
    console.error('GPT Error:', err.response?.data || err.message);
    res.status(500).send('Error with GPT');
  }
});
