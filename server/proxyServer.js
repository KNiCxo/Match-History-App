const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

function getPUUID(username) {

}

app.get('/profile', async (req, res) => {
  res.json({success: true});
});

app.listen(4000, () => console.log('listening on port 4000'));