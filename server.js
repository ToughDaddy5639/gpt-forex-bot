const express = require("express");
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.json());

// Webhook endpoint
app.post("/webhook", (req, res) => {
  console.log("Received TradingView alert:", req.body);
  res.status(200).send("Alert received!");
});

// Keep-alive home page
app.get("/", (req, res) => {
  res.send("GPT Forex Bot is running!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is live at http://localhost:${PORT}`);
});
