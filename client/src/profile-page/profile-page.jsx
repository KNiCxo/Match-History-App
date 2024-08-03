import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import './profile-page.css';

// Import JSON data
import gameModes from '../lib/game-modes.json';
import runes from '../lib/runes.json';
import summonerSpells from '../lib/summoner-spells.json';
import items from '../lib/item.json';
import champions from '../lib/champion.json';

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

  // Variables needed for profile header
  const [iconNum, setIconNum] = useState(null);
  const [summonerLevel, setLevel] = useState(null);

  // Variables needed for match data
  const [start, setStart] = useState(0);
  const [matchIDList, setMatchIDList] = useState(null);
  const [matchDataList, setMatchDataList] = useState([]);

  // Fetches and handles user summoner data
  const handleSummoner = async () => {
    // Make call to get Summoner info
    const summonerCall = await fetch(`http://localhost:4000/summoner/${regionID}/${gameName}/${tagLine}`);
    const summonerJSON = await summonerCall.json();

    // If Summoner PUUID doesn't match playerPUUID state, a new user was searched
    // Therefore, clear matchDataList array
    if (playerPUUID != summonerJSON.puuid) {
      setMatchDataList([]);
    }

    // Set variables needed for profile header
    setPlayerPUUID(summonerJSON.puuid);
    setIconNum(summonerJSON.profileIconId);
    setLevel(summonerJSON.summonerLevel);
  };

  // Fetches and handles Match IDs
  const fetchMatchIDs = async () => {
    // Make call to get Match IDs
    const matchIDCall = await fetch(`http://localhost:4000/matchID/${playerPUUID}/${start}`);
    const matchIDJSON = await matchIDCall.json();

    // Store Match IDs
    setMatchIDList(matchIDJSON);
  }

  // Gathers data needed from Match IDs to display win rate and match history components
  const handleMatchIDs = async () => {
    // Temp array to store data gathered from matchIDs
    const matchDataTempList = matchDataList;

    // Loop through all Match IDs
    for (let i = 0; i < matchIDList.length; i++) {
      // Make call to get match data
      const matchCall = await fetch(`http://localhost:4000/match/${matchIDList[i]}`);
      const matchCallJSON = await matchCall.json();

      // Filters out 16-player Arena gamemode
      if (matchCallJSON.info.queueId == 1700) {
        // Create object for match that contains all necessary data
        // Gather game mode, game creation, and game duration data initially
        let matchDataObj = {
          gameMode: gameModes[`${matchCallJSON.info.queueId}`],
          gameCreation: matchCallJSON.info.gameCreation,
          gameDuration: matchCallJSON.info.gameDuration,
          victory: matchCallJSON.info.participants[i].win
        }

        // Loop through match participants until player is found
        for (let i = 0; i < matchCallJSON.info.participants.length; i++) {
          if (matchCallJSON.info.participants[i].puuid == playerPUUID) {
            // Gather game outcome from player data
            matchDataObj = {...matchDataObj, victory: matchCallJSON.info.participants[i].win};
          }
        }

        // Push match data object into temp array
        matchDataTempList.push(matchDataObj);
      } else {
        // Tracks which team the player is on (Blue: 100, Red: 200)
        let playerTeamID;

        // Arrays to store data for the player team and enemy team
        let playerTeam;
        let enemyTeam;

        // Create object for match that contains all necessary data
        // Gather game mode, game creation, and game duration data initially
        let matchDataObj = {
          gameMode: gameModes[`${matchCallJSON.info.queueId}`],
          gameCreation: matchCallJSON.info.gameCreation,
          gameDuration: matchCallJSON.info.gameDuration,
        };

        // Loop through match participants until player is found
        for (let i = 0; i < matchCallJSON.info.participants.length; i++) {
          if (matchCallJSON.info.participants[i].puuid == playerPUUID) {
            // If individualPosition is "Invalid", set up team arrays for ARAM
            // Else, set up arrays for team roles
            if (matchCallJSON.info.participants[i].individualPosition == "Invalid") {
              playerTeam = [];
              enemyTeam = [];
            } else {
              playerTeam = new Array(5);
              enemyTeam = new Array(5);
            }
            
            // Player's team ID is needed to store participants' data into the correct team arrays
            playerTeamID = matchCallJSON.info.participants[i].teamId

            if (playerTeamID == 100) {
              matchDataObj = {...matchDataObj, teamColor: "Blue"};
              matchDataObj = {...matchDataObj, enemyColor: "Red"};
            } else {
              matchDataObj = {...matchDataObj, teamColor: "Red"};
              matchDataObj = {...matchDataObj, enemyColor: "Blue"};
            }

            // Gather game outcome from player data
            matchDataObj = {...matchDataObj, victory: matchCallJSON.info.participants[i].win};
          }
        }

        // Loop through match participants to gather necessary data
        for (let i = 0; i < 10; i++) {
          const participantObj = {
            champLevel: matchCallJSON.info.participants[i].champLevel,
            champion: matchCallJSON.info.participants[i].championName,
            summoner1: matchCallJSON.info.participants[i].summoner1Id,
            summoner2: matchCallJSON.info.participants[i].summoner2Id,
            keystone: matchCallJSON.info.participants[i].perks.styles[0].selections[0].perk,
            secondaryRunes: matchCallJSON.info.participants[i].perks.styles[1].style,
            gameName: matchCallJSON.info.participants[i].riotIdGameName,
            tagLine: matchCallJSON.info.participants[i].riotIdTagline,
            level: matchCallJSON.info.participants[i].summonerLevel,
            kills: matchCallJSON.info.participants[i].kills,
            deaths: matchCallJSON.info.participants[i].deaths,
            assists: matchCallJSON.info.participants[i].assists,
            dmgDealtChamp: matchCallJSON.info.participants[i].totalDamageDealtToChampions,
            cs: matchCallJSON.info.participants[i].totalMinionsKilled,
            controlWards: matchCallJSON.info.participants[i].visionWardsBoughtInGame,
            wardsPlaced: matchCallJSON.info.participants[i].wardsPlaced,
            wardsKilled: matchCallJSON.info.participants[i].wardsKilled,
            item0: matchCallJSON.info.participants[i].item0,
            item1: matchCallJSON.info.participants[i].item1,
            item2: matchCallJSON.info.participants[i].item2,
            item3: matchCallJSON.info.participants[i].item3,
            item4: matchCallJSON.info.participants[i].item4,
            item5: matchCallJSON.info.participants[i].item5,
            item6: matchCallJSON.info.participants[i].item6,
          }

          // If individual positions are "Invalid", order in FCFS
          // Else, order based on player role
          if (matchCallJSON.info.participants[i].individualPosition == "Invalid") {
            // If participant teamId matches player teamId, then add to player array
            // Else, store in enemy team array
            if (matchCallJSON.info.participants[i].teamId == playerTeamID) {
              playerTeam.push(participantObj);
            } else {
              enemyTeam.push(participantObj);
            }
          } else {
            // Stores position that participant data will go into
            let index;

            // Set index position based on participant role
            switch (matchCallJSON.info.participants[i].individualPosition) {
              case "TOP":
                index = 0;
                break;
              case "JUNGLE":
                index = 1;
                break;
              case "MIDDLE":
                index = 2;
                break;
              case "BOTTOM":
                index = 3;
                break;
              case "UTILITY":
                index = 4;
                break;
            }
            
            // If participant teamId matches player teamId, then add to player array
            // Else, store in enemy team array
            if (matchCallJSON.info.participants[i].teamId == playerTeamID) {
              playerTeam[index] = participantObj;
            } else {
              enemyTeam[index] = participantObj;
            }
          }
        }
        
        // Add player team and enemy team data into match data
        matchDataObj = {...matchDataObj, playerTeamData: playerTeam, enemyTeamData: enemyTeam};

        // Push match data object into temp array
        matchDataTempList.push(matchDataObj);
      }
    }

    // Update state of match data array with temp array
    setMatchDataList(matchDataTempList);
    console.log(matchDataTempList);
    //console.log(matchDataTempList[2].enemyTeamData[3]);
  }

  // If iconNum was set, display Profile Header
  function displayProfileHeader() {
    if (iconNum) {
      return(<ProfileHeader iconNum={iconNum} summonerLevel={summonerLevel} gameName={gameName} tagLine={tagLine}></ProfileHeader>)
    }
  }

  // Displays the player's win rate data
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