app.post('/webhook', async (req, res) => {
  const { symbol, interval, indicator, value } = req.body;

  const prompt = `Symbol: ${symbol}\nInterval: ${interval}\nIndicator: ${indicator}\nValue: ${value}\n\nGive a trading decision (BUY, SELL, WAIT) and short reason.`;

  try {
    const gptResponse = await openai.createChatCompletion({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: 'You are a sniper forex analyst.' },
        { role: 'user', content: prompt }
      ]
    });

    const decision = gptResponse.data.choices[0].message.content;
    console.log('✅ GPT decision:', decision);
    res.json({ decision }); // 💥 This replaces "Alert received!"
  } catch (error) {
    console.error('❌ GPT Error:', error.response?.data || error.message);
    res.status(500).send('Error calling GPT');
  }
});
