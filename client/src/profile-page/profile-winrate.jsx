import React, {useState, useEffect} from 'react';

import './profile-winrate.css';

// Displays the win rate of the player's match history as well as to the top 3
// champion win rates included in that match history
function ProfileWinRate(props) {
  // Track all games played except remakes
  let totalGames = 0;

  // Track total wins and losses
  const [wins, setWins] = useState(0);
  const [losses, setLosses] = useState(0);

  // Win percentage from total games
  const [winRate, setWinRate] = useState(null);

  // Track win rates for all champions played
  const [champWinRates, setChampWinRates] = useState({});

  // Calculates the win rate for games played as well as the win rates for all champions played
  function calculateWinRate() {
    console.log(props.matchDataList);
    // Create temp variables for wins, losses, and champion winrate object
    let tempWins = 0;
    let tempLosses = 0;
    let tempChampWinRates = {};

    // Iterate through all matches
    for (let i = 0; i < props.matchDataList.length; i++) {
      // If game outcome was a remake, then ignore
      // Else continue
      if (props.matchDataList[i].outcome === 'Remake' || props.matchDataList[i].gameMode === 'Arena') {
        // pass
      } else {
        // If game outcome was a win, increment win counter
        // Else, increment loss counter
        if (props.matchDataList[i].outcome === 'Victory') {
          tempWins++;
        } else {
          tempLosses++;
        }
        // Increment total games counter
        totalGames++;

        // Loop through the player's team array
        for (let j = 0; j < props.matchDataList[i].playerTeamData.length; j++) {
          // Look for the PUUID that matches the player's PUUID and insert champion win/loss stats into obj
          //console.log(props.matchDataList[i].playerTeamData[j]);
          if (props.playerPUUID == props.matchDataList[i].playerTeamData[j].puuid) {
            // If champion does not exist yet in champWinRates object, then create a key for it
            // Else, adjust its existing stats
            if (!(props.matchDataList[i].playerTeamData[j].champion in tempChampWinRates)) {
              // Insert different key values depending on game outcome
              if (props.matchDataList[i].outcome === 'Victory') {
                tempChampWinRates[props.matchDataList[i].playerTeamData[j].champion] = {
                  wins: 1,
                  losses: 0,
                  winRate: 1
                }
              } else {
                tempChampWinRates[props.matchDataList[i].playerTeamData[j].champion] = {
                  wins: 0,
                  losses: 1,
                  winRate: 0
                }
              }
            } else {
              // Increment wins or losses depending on game outcome
              if (props.matchDataList[i].outcome === 'Victory') {
                tempChampWinRates[props.matchDataList[i].playerTeamData[j].champion].wins++;
              } else {
                tempChampWinRates[props.matchDataList[i].playerTeamData[j].champion].losses++;
              }
              
              // Update win rate
              tempChampWinRates[props.matchDataList[i].playerTeamData[j].champion].winRate = 
              tempChampWinRates[props.matchDataList[i].playerTeamData[j].champion].wins /
              (tempChampWinRates[props.matchDataList[i].playerTeamData[j].champion].wins +
              tempChampWinRates[props.matchDataList[i].playerTeamData[j].champion].losses);
            }
          }
        }
      }
    }

    // Update wins and losses states
    setWins(tempWins);
    setLosses(tempLosses);

    // Sort champWinRates objects by number of games played then by highest win rate
    const sortedChampWinRates = Object.entries(tempChampWinRates)
    .map(([champion, stats]) => ({ champion, ...stats }))
    .sort((a, b) => {
      const totalMatchesA = a.wins + a.losses;
      const totalMatchesB = b.wins + b.losses;

      const winRateA = a.wins / totalMatchesA;
      const winRateB = b.wins / totalMatchesB;

      if (totalMatchesB != totalMatchesA) {
        return totalMatchesB - totalMatchesA
      } else {
        return winRateB - winRateA;
      }
    });

    // Update champWinRates state
    setChampWinRates(sortedChampWinRates);
    console.log(sortedChampWinRates);

    // Return overall winrate
    return Math.floor((tempWins / totalGames) * 100);
  }


  // Displays win rate component html
  function displayWinRate() {
    // Only display if win rate is set
    if (winRate !== null) {
      return(
        <>
          {/* Display win rate and win/loss */}
          <div className='overall-div'>
            <span className='win-rate-label'>Win Rate</span>
            <span className='win-rate'>{winRate}%</span>
            <span className='score'>{wins}W - {losses}L</span>
          </div>

          {/* Display top 3 most played champions and their win rates */}
          <div className='recent-champ-div'>
            <div className='recent-champ-icon-div'>
              <img className='recent-champ-icon' src={`/assets/champion/${champWinRates[0].champion}.png`} alt="" />
            </div>

            <div className='recent-champ-stat'>
              <span className='champ-win-rate'>{Math.floor(champWinRates[0].winRate  * 100)}%</span>
              <span className='champ-win-loss'>({champWinRates[0].wins}W - {champWinRates[0].losses}L)</span>
            </div>
          </div>

          {/* Only display if there is more than one champion in the object */}
          {champWinRates[1] && <div className='recent-champ-div'>
            <div className='recent-champ-icon-div'>
              <img className='recent-champ-icon' src={`/assets/champion/${champWinRates[1].champion}.png`} alt="" />
            </div>

            <div className='recent-champ-stat'>
              <span className='champ-win-rate'>{Math.floor(champWinRates[1].winRate  * 100)}%</span>
              <span className='champ-win-loss'>({champWinRates[1].wins}W - {champWinRates[1].losses}L)</span>
            </div>
          </div>}

          {champWinRates[2] && <div className='recent-champ-div'>
            <div className='recent-champ-icon-div'>
              <img className='recent-champ-icon' src={`/assets/champion/${champWinRates[2].champion}.png`} alt="" />
            </div>

            <div className='recent-champ-stat'>
              <span className='champ-win-rate'>{Math.floor(champWinRates[2].winRate  * 100)}%</span>
              <span className='champ-win-loss'>({champWinRates[2].wins}W - {champWinRates[2].losses}L)</span>
            </div>
          </div>}
        </>
      )
    }
  }

  // Calculate win rate when matchDataList is updated
  useEffect(() => {
    const winRate = calculateWinRate();
    setWinRate(winRate);
  }, [props.matchDataList]);

  return(
    <>
      {/* Display component if possible */}
      <div className='win-rate-div'>
        {displayWinRate()}
      </div>
    </>
  )
}

export default ProfileWinRate;