const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
app.use(cors());
dotenv.config();

// Returns correct region parameter based on the routingID
function getRegion(routingID) {
  let region;

  if (routingID === 'na1' ||
      routingID === 'br1' ||
      routingID === 'la1' ||
      routingID === 'la2') {
    region = 'americas';
  } else if (routingID === 'jp1' ||
             routingID === 'kr') {
    region = 'asia';
  } else if (routingID === 'me1' ||
             routingID === 'eun1' ||
             routingID === 'euw1' ||
             routingID === 'tr1' ||
             routingID === 'ru') {
    region = 'europe';
  } else {
    region = 'sea';
  }
  return region;
}
  
// Gets the player's PUUID and or response status code
const getPUUID = async (routingID, gameName, tagLine) => {
  let region = getRegion(routingID);

  // Make call to Riot API PUUID endpoint
  const puuidResponse = await fetch(`https://${region}.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${process.env.KEY}`);

  // Store status code and JSON responses
  const puuidJSON = await puuidResponse.json();
  const puuidStatusCode = puuidResponse.status;

  // If status code is 200, return the given PUUID and status code
  // Else, only return status code
  if (puuidStatusCode == 200) {
    return {
      puuidJSON: puuidJSON,
      puuidStatusCode: puuidStatusCode
    };
  } else {
    return {
      puuidStatusCode: puuidStatusCode,
    };
  }
}

// Gets summoner information and or response status code
const getSummoner = async (routingID, puuid) => {
  // Make call to Riot API
  const summonerResponse = await fetch(`https://${routingID}.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${process.env.KEY}`);

  // Store status code and JSON responses
  const summonerJSON = await summonerResponse.json();
  const summonerStatusCode = await summonerResponse.status;
  return {
    summoner: summonerJSON,
    summonerStatusCode: summonerStatusCode
  }
}

// Checks if Riot ID and League account exists
app.get('/check/:routingID/:gameName/:tagLine', async (req, res) => {
  // Get puuid and it's response status code
  const {puuidJSON, puuidStatusCode} = await getPUUID(req.params.routingID, req.params.gameName, req.params.tagLine);

  // If PUUID request was a success, get status code from Summoner endpoint
  // Else, respond with 404
  if (puuidStatusCode == 200) {
    const {summoner, summonerStatusCode} = await getSummoner(req.params.routingID, puuidJSON.puuid);
    
    // If Summoner request was a success, send 200 status code, else send 404
    if (summonerStatusCode == 200) {
      res.json(puuidJSON);
    } else {
      res.status(408).end();
    }
  } else {
    res.status(408).end();
  }
});

// Sends Summoner name, Level, and Profile Icon
app.get('/summoner/:routingID/:gameName/:tagLine', async (req, res) => {
  const {puuidJSON, puuidStatusCode} = await getPUUID(req.params.routingID, req.params.gameName, req.params.tagLine);
  const {summoner, summonerStatusCode} = await getSummoner(req.params.routingID, puuidJSON.puuid);
  res.json(summoner);
});

// Sends list of 20 MatchIDs based that varies based on start param
app.get('/matchID/:routingID/:playerPUUID/:start', async (req, res) => {
  let region = getRegion(req.params.routingID);

  const matchIDCall = await fetch(`https://${region}.api.riotgames.com/lol/match/v5/matches/by-puuid/${req.params.playerPUUID}/ids?start=${req.params.start}&count=5&api_key=${process.env.KEY}`);

  const matchIDJSON = await matchIDCall.json();
  res.json(matchIDJSON);
});

// Sends individual match data based on Match ID
app.get('/match/:routingID/:matchID', async (req, res) => {
  let region = getRegion(req.params.routingID);

  const matchCall = await fetch(`https://${region}.api.riotgames.com/lol/match/v5/matches/${req.params.matchID}?api_key=${process.env.KEY}`);

  const matchJSON = await matchCall.json();
  res.json(matchJSON);
});

// Starts server
app.listen(4000, () => console.log('listening on port 4000'));