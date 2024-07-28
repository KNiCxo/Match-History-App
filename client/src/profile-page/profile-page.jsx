import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import './profile-page.css';

// Import JSON data
import gameModes from '../lib/game-modes.json';

// Import search bar and match history components
import SearchBar from '../search-bar.jsx';
import ProfileHeader from './profile-header.jsx';
import ProfileWinRate from './profile-winrate.jsx';

// Displays match history of player that was searched by the user
function ProfilePage() {
  // Get regionID, gameName, and tagLine from URL params
  let {regionID, gameName, tagLine} = useParams();

  // Player PUUID
  const [playerPUUID, setPlayerPUUID] = useState(null);

  // Create variables needed for profile header
  const [iconNum, setIconNum] = useState(null);
  const [summonerLevel, setLevel] = useState(null);

  // Create variables needed for win rate section
  const [start, setStart] = useState(0);
  const [matchIDList, setMatchIDList] = useState(null);
  const [matchDataList, setMatchDataList] = useState([]);

  // Fetches and handles user summoner data
  const handleSummoner = async () => {
    // Make call to get Summoner info
    const summonerCall = await fetch(`http://localhost:4000/summoner/${regionID}/${gameName}/${tagLine}`);
    const summonerJSON = await summonerCall.json();

    // Set variables needed for profile header
    setPlayerPUUID(summonerJSON.puuid);
    setIconNum(summonerJSON.profileIconId);
    setLevel(summonerJSON.summonerLevel);
  };

  // Fetches and handles MatchIDs
  const fetchMatchIDs = async () => {
    // Make call to get Match IDs
    const matchIDCall = await fetch(`http://localhost:4000/matchID/${playerPUUID}/${start}`);
    const matchIDJSON = await matchIDCall.json();

    // Store MatchIDs
    setMatchIDList(matchIDJSON);
  }

  const handleMatchIDs = async () => {
    const matchDataTemp = matchDataList;

    for (let i = 0; i < matchIDList.length; i++) {
      const matchCall = await fetch(`http://localhost:4000/match/${matchIDList[i]}`);
      const matchCallJSON = await matchCall.json();

      if (matchCallJSON.info.queueId != 1710) {
        // Track whether the player won or lost a match
        for (let i = 0; i < matchCallJSON.info.participants.length; i++) {
          if (matchCallJSON.info.participants[i].puuid == playerPUUID) {
            matchDataTemp.push({
              "Victory": matchCallJSON.info.participants[i].win
            });
          }
        }
      }
    }
    console.log(matchDataTemp);
  }

  // If iconNum was set, display Profile Header
  function displayProfileHeader() {
    if (iconNum) {
      return(<ProfileHeader iconNum={iconNum} summonerLevel={summonerLevel} gameName={gameName} tagLine={tagLine}></ProfileHeader>)
    }
  }

  function displayProfileWinRate() {

  }

  // Fetches summoner data when params are retrieved from URL
  useEffect(() => {
    handleSummoner();
  }, [regionID, gameName, tagLine]);

  // Fetches match history data when playerPUUID is set
  useEffect(() => {
    if (playerPUUID) {
      fetchMatchIDs();
    }
  }, [playerPUUID]);

  // Handles MatchIDs once matchIDList is set
  useEffect(() => {
    if (matchIDList) {
      handleMatchIDs();
    }
  }, [matchIDList]);

  return(
    <>
      {/* Search Bar component */}
      <div className='search-bar-div'>
        <SearchBar></SearchBar>
      </div>

      {/* Profile Header component */}
      <div className='profile-header-div'>
        {displayProfileHeader()}
      </div>

      {/* Profile Win Rate component*/}
      <div className='profile-winrate-div'>
        {displayProfileWinRate()}
      </div>
    </>
  );
}

export default ProfilePage;