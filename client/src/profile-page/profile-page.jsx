import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {useNavigate} from 'react-router-dom';

import './profile-page.css';

// Import JSON data
import gameModes from '../lib/game-modes.json';

// Import search bar and match history components
import SearchBar from '../search-bar.jsx';
import ProfileHeader from './profile-header.jsx';
import ProfileWinRate from './profile-winrate.jsx';
import ProfileMatches from './profile-matches.jsx';

// Displays match history of player that was searched by the user
function ProfilePage() {
  // Get routingID, gameName, and tagLine from URL params
  let {routingID, gameName, tagLine} = useParams();

  // Player PUUID
  const [playerPUUID, setPlayerPUUID] = useState(null);

  // Variables needed for profile header
  const [iconNum, setIconNum] = useState(null);
  const [summonerLevel, setLevel] = useState(null);

  // Variables needed for match data
  const [start, setStart] = useState(0);
  const [matchIDList, setMatchIDList] = useState(null);
  const [matchDataList, setMatchDataList] = useState([]);

  // Enable navigate hook
  const navigate = useNavigate();

  // Fetches and handles user summoner data
  const handleSummoner = async () => {
    // Make call to proxyServer and get status code to check if profile exists
    const checkUsername = await 
    fetch(encodeURI(`http://localhost:4000/check/${routingID}/${gameName}/${encodeURIComponent(tagLine)}`));
    const statusCode = checkUsername.status;

    // If request was a success, navigate to profile page with proper params
    // Else navigate to error page
    if (statusCode == 200) {
      // Make call to get Summoner info
      const summonerCall = await fetch(`http://localhost:4000/summoner/${routingID}/${gameName}/${tagLine}`);
      const summonerJSON = await summonerCall.json();

      // Set variables needed for profile header
      setPlayerPUUID(summonerJSON.puuid);
      setIconNum(summonerJSON.profileIconId);
      setLevel(summonerJSON.summonerLevel);
    } else {
      navigate('/error');
    }
  };

  // Fetches and handles Match IDs
  const fetchMatchIDs = async () => {
    // Make call to get Match IDs
    const matchIDCall = await fetch(`http://localhost:4000/matchID/${routingID}/${playerPUUID}/${start}`);
    const matchIDJSON = await matchIDCall.json();

    // Store Match IDs
    setMatchIDList(matchIDJSON);
  }

  // Gathers data needed from Match IDs to display win rate and match history components
  const handleMatchIDs = async () => {
    // Temp array to store data gathered from matchIDs
    const matchDataTempList = [];

    // Loop through all Match IDs
    for (let i = 0; i < matchIDList.length; i++) {
      // Make call to get match data
      const matchCall = await fetch(`http://localhost:4000/match/${routingID}/${matchIDList[i]}`);
      const matchCallJSON = await matchCall.json();

      // If gamemode is Arena, get some data
      // Else if gamemode is Swarm or before patch 14.10, ignore
      // Else, get necessary data
      if (matchCallJSON.info.queueId == 1700) {
        // Create object for match that contains all necessary data
        // Gather game mode, game creation, and game duration data initially
        let matchDataObj = {
          gameMode: gameModes[`${matchCallJSON.info.queueId}`],
          gameCompleted: matchCallJSON.info.gameEndTimestamp,
          gameDuration: matchCallJSON.info.gameDuration,
        }

        // Loop through match participants until player is found
        for (let j = 0; j < matchCallJSON.info.participants.length; j++) {
          if (matchCallJSON.info.participants[j].puuid == playerPUUID) {
            // Gather game outcome from player data
            matchDataObj = {...matchDataObj, outcome: matchCallJSON.info.participants[j].win === true ? 'Victory' : 'Defeat'};
          }
        }

        // Push match data object into temp array
        matchDataTempList.push(matchDataObj);
      } else if (matchCallJSON.info.queueId == 1810 || 
                 matchCallJSON.info.queueId == 1820 || 
                 matchCallJSON.info.queueId == 1830 ||
                 matchCallJSON.info.queueId == 1840 ||
                 matchCallJSON.info.gameCreation < (1716620400 * 1000)) {
        //pass
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
          gameCompleted: matchCallJSON.info.gameEndTimestamp,
          gameDuration: matchCallJSON.info.gameDuration,
        };

        // Loop through match participants until player is found
        for (let j = 0; j < matchCallJSON.info.participants.length; j++) {
          if (matchCallJSON.info.participants[j].puuid == playerPUUID) {
            // If individualPosition is "Invalid", set up team arrays for ARAM
            // Else, set up arrays for team roles
            if (matchCallJSON.info.participants[j].individualPosition == "Invalid") {
              playerTeam = [];
              enemyTeam = [];
            } else {
              playerTeam = new Array(5);
              enemyTeam = new Array(5);
            }
            
            // Player's team ID is needed to store participants' data into the correct team arrays
            playerTeamID = matchCallJSON.info.participants[j].teamId

            if (playerTeamID == 100) {
              matchDataObj = {...matchDataObj, teamColor: 'Blue'};
              matchDataObj = {...matchDataObj, enemyColor: 'Red'};
            } else {
              matchDataObj = {...matchDataObj, teamColor: 'Red'};
              matchDataObj = {...matchDataObj, enemyColor: 'Blue'};
            }

            // Gather game outcome from player data
            if (matchCallJSON.info.gameDuration <= 600) {
              matchDataObj = {...matchDataObj, outcome: 'Remake'};
            } else {
              matchDataObj = {
                ...matchDataObj, outcome: matchCallJSON.info.participants[j].win === true ? 'Victory' : 'Defeat'
              };
            }
          }
        }

        // Loop through match participants to gather necessary data
        for (let j = 0; j < matchCallJSON.info.participants.length; j++) {
          const participantObj = {
            puuid: matchCallJSON.info.participants[j].puuid,
            champLevel: matchCallJSON.info.participants[j].champLevel,
            champion: matchCallJSON.info.participants[j].championName,
            summoner1: matchCallJSON.info.participants[j].summoner1Id,
            summoner2: matchCallJSON.info.participants[j].summoner2Id,
            keystone: matchCallJSON.info.participants[j].perks.styles[0].selections[0].perk,
            secondaryRunes: matchCallJSON.info.participants[j].perks.styles[1].style,
            gameName: matchCallJSON.info.participants[j].riotIdGameName,
            tagLine: matchCallJSON.info.participants[j].riotIdTagline,
            level: matchCallJSON.info.participants[j].summonerLevel,
            kills: matchCallJSON.info.participants[j].kills,
            deaths: matchCallJSON.info.participants[j].deaths,
            assists: matchCallJSON.info.participants[j].assists,
            dmgDealtChamp: matchCallJSON.info.participants[j].totalDamageDealtToChampions,
            cs: matchCallJSON.info.participants[j].totalMinionsKilled + 
                matchCallJSON.info.participants[j].neutralMinionsKilled,
            controlWards: matchCallJSON.info.participants[j].visionWardsBoughtInGame,
            wardsPlaced: matchCallJSON.info.participants[j].wardsPlaced,
            wardsKilled: matchCallJSON.info.participants[j].wardsKilled,
            item0: matchCallJSON.info.participants[j].item0,
            item1: matchCallJSON.info.participants[j].item1,
            item2: matchCallJSON.info.participants[j].item2,
            item3: matchCallJSON.info.participants[j].item3,
            item4: matchCallJSON.info.participants[j].item4,
            item5: matchCallJSON.info.participants[j].item5,
            item6: matchCallJSON.info.participants[j].item6,
          }

          // If individual positions are "Invalid", order in FCFS
          // Else, order based on player role
          if (matchCallJSON.info.participants[j].individualPosition == "Invalid") {
            // If participant teamId matches player teamId, then add to player array
            // Else, store in enemy team array
            if (matchCallJSON.info.participants[j].teamId == playerTeamID) {
              playerTeam.push(participantObj);
            } else {
              enemyTeam.push(participantObj);
            }
          } else {
            // Stores position that participant data will go into
            let index;

            // Set index position based on participant role
            switch (matchCallJSON.info.participants[j].teamPosition) {
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
            if (matchCallJSON.info.participants[j].teamId == playerTeamID) {
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
  }

  // If iconNum was set, display Profile Header
  function displayProfileHeader() {
    if (matchDataList.length > 0) {
      return(
      <ProfileHeader 
        iconNum={iconNum} 
        summonerLevel={summonerLevel} 
        gameName={gameName} 
        tagLine={tagLine}>
      </ProfileHeader>)
    }
  }

  // Displays the player's win rate data
  function displayProfileWinRate() {
    if (matchDataList.length > 0) {
      return(
        <ProfileWinRate 
          matchDataList={matchDataList}
          playerPUUID={playerPUUID}>
        </ProfileWinRate>
      );
    }
  }

  // Displays the player's matches
  function displayProfileMatches() {
    if (matchDataList.length > 0) {
      return(
        <ProfileMatches
          matchDataList={matchDataList}
          playerPUUID={playerPUUID}
          routingID={routingID}>
        </ProfileMatches>
      );
    }
  }

  // Fetches summoner data when params are retrieved from URL
  useEffect(() => {
    handleSummoner();
  }, [routingID, gameName, tagLine]);

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
      {displayProfileHeader()}

      {/* Profile Win Rate component */}
      {displayProfileWinRate()}

      {/* Profile Matches component */}
      {displayProfileMatches()}
    </>
  );
}

export default ProfilePage;