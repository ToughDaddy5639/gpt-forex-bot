const express = require('express');
require('dotenv').config();

const app = express();
app.use(express.json());

app.post('/price-alert', (req, res) => {
  const { symbol, price, time } = req.body;
  console.log(`📡 Alert: ${symbol} @ ${price} (${time})`);
  res.status(200).send('Received');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
