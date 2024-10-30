const express = require('express');
const path = require('path');

const app = express();
const PORT = 3001;

app.get('/', (req, res) => {
  res.json('Hello from the backend!');
});

app.listen(PORT, () => {
  console.log('Server is running');
});
