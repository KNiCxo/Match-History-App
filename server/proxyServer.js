const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
app.use(cors());
dotenv.config();
  
// Gets the player's PUUID and or response status code
const getPUUID = async (gameName, tagLine) => {
  // Make call to Riot API PUUID endpoint
  const puuidResponse = await fetch(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${process.env.KEY}`);

  // Store status code and JSON responses
  const puuidStatusCode = await puuidResponse.status;
  const puuidJSON = await puuidResponse.json();

  // If status code is 200, return the given PUUID and status code
  // Else, only return status code
  if (puuidStatusCode == 200) {
    return {
      puuid: puuidJSON.puuid,
      puuidStatusCode: puuidStatusCode
    };
  } else {
    return {
      puuidStatusCode: puuidStatusCode,
    };
  }
}

// Gets summoner information and or response status code
const getSummoner = async (regionID, puuid) => {
  // Make call to Riot API
  const summonerResponse = await fetch(`https://${regionID}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${process.env.KEY}`);

  // Store status code and JSON responses
  const summonerStatusCode = await summonerResponse.status;
  return summonerStatusCode;
}

// Checks if Riot ID and League account exists
app.get('/check/:regionID/:gameName-:tagLine', async (req, res) => {
  // Get puuid and it's response status code
  const {puuid, puuidStatusCode} = await getPUUID(req.params.gameName, req.params.tagLine);

  // If PUUID request was a success, get status code from Summoner endpoint
  // Else, respond with 404
  if (puuidStatusCode == 200) {
    const summonerStatusCode = await getSummoner(req.params.regionID, puuid);
    res.status(200).end();
    console.log(summonerStatusCode);
  } else {
    res.status(404).end();
  }
});

// Sends success when navigating to valid profile page
app.get('/profile/:region/:gameName-:tagLine', async (req, res) => {
  res.status(200).end();
});

app.listen(4000, () => console.log('listening on port 4000'));
