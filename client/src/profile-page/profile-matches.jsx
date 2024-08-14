import React, {useState} from 'react';
import {Link} from 'react-router-dom';

import './profile-matches.css';

// Import JSON data
import runes from '../lib/runes.json';
import summonerSpells from '../lib/summoner-spells.json';

// Displays the player's match history
function ProfileMatches(props) {
  // Convert epoch number into custom date string
  function convertEpoch(epoch) {
    let date = new Date(epoch);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }

  // Convert time in seconds to a minute and seconds string
  function convertTime(timeInSeconds) {
    let minutes = Math.floor(timeInSeconds / 60);
    let seconds = timeInSeconds % 60;

    return `${minutes}m ${seconds}s`
  }

  // Displays a player stat depending on the key given
  function displayStat(index, key) {
    for (let i = 0; i < props.matchDataList[index].playerTeamData.length; i++) {
      if (props.playerPUUID === props.matchDataList[index].playerTeamData[i].puuid) {
        return props.matchDataList[index].playerTeamData[i][key];
      }
    }
  }

  // Displays an image depending on the folder, json file, and key given
  function displayImage(index, folder, json, key) {
    for (let i = 0; i < props.matchDataList[index].playerTeamData.length; i++) {
      if (props.playerPUUID === props.matchDataList[index].playerTeamData[i].puuid) {
        return `/assets/${folder}/${json[props.matchDataList[index].playerTeamData[i][key]].imgurl}`;
      }
    }
  }

  // Displays the player's champion icon
  function displayPlayerChampIcon(index) {
    for (let i = 0; i < props.matchDataList[index].playerTeamData.length; i++) {
      if (props.playerPUUID === props.matchDataList[index].playerTeamData[i].puuid) {
        return `/assets/champion/${props.matchDataList[index].playerTeamData[i].champion}.png`;
      }
    }
  }

  // Displays the player's item icon
  function displayPlayerItemIcon(index, itemSlot) {
    for (let i = 0; i < props.matchDataList[index].playerTeamData.length; i++) {
      if (props.playerPUUID === props.matchDataList[index].playerTeamData[i].puuid) {
        // If item value is '0', then display a blank slot
        // Else, display the item linked to the value
        if ((props.matchDataList[index].playerTeamData[i][itemSlot]) === 0) {
          return <div className='item-slot'style={{backgroundColor: 'rgba(255, 255, 255, 0.348)'}}></div>
        } else {
          return(
            <>
              <div className='item-slot'>
                <img className='item-slot-img' src={`/assets/item/${props.matchDataList[index].playerTeamData[i][itemSlot]}.png`} alt="" />
              </div>
            </>
          )
        }
      }
    }
  }

  // Displays/hides the bottom half of the match container when the top half is clicked
  function expandContainer(index) {
    // Unlocks/locks input field to allow/prevent editing
    let container = document.querySelector(`.bottom-${index}`);
    container.style.display = window.getComputedStyle(container).display === 'none' ? 'flex': 'none';
  }

  return(
    <>
      {/* Match History */}
      <div className='match-list-container'>
        {/* Loop through all matches in the list */}
        {props.matchDataList.map((match, index) => {
          // Set value of the class name based on match outcome */}
          let className;

          if (match.outcome == 'Victory') {
            className = 'victory'
          } else if (match.outcome == 'Remake') {
            className = 'remake';
          } else {
            className = 'defeat';
          }
          
          // If game mode is "Arena", then ignore
          // Else, display match container
          if (match.gameMode === 'Arena') {
            // pass
          } else {
            return(
              <>
                {/* Displays everything relating to the match */}
                <div className='match-container'
                      key={`${match.gameCompleted}-${index}`}>   

                  {/* Top half of container. Second class changes based on game outcome */}
                  <div className={`match-container-top match-${className}`}
                        onClick={() => expandContainer(index)}>
                  
                    {/* Contains overall data about the match */}
                    <div className='match-info'>
                      <span className='match-game-mode match-info-data'>{match.gameMode}</span>
                      <span className='match-outcome match-info-data'>{match.outcome}</span>
                      <span className='match-duration match-info-data'>{convertTime(match.gameDuration)}</span>
                      <span className='match-date match-info-data'>{convertEpoch(match.gameCompleted)}</span>
                    </div>

                    {/* Contains the player's match stats */}
                    <div className='player-info-div'>
                      {/* Top section of stats */}
                      <div className='player-champ-top-div'>
                        {/* Champion icon and level */}
                        <div className='player-champ-icon-div'>
                          <img className='player-champ-icon' src={displayPlayerChampIcon(index)} alt="" />
                        </div>

                        <div className='player-champ-level-div'>
                            <span className='player-champ-level'>{displayStat(index, 'champLevel')}</span>
                        </div>

                        {/* Summoner Spells */}
                        <div className='player-summ-div'>
                          <img className='player-summ' src={displayImage(index, 'spells', summonerSpells, 'summoner1')} alt="" />
                          <img className='player-summ' src={displayImage(index, 'spells', summonerSpells, 'summoner2')} alt="" />
                        </div>

                        {/* Runes */}
                        <div className='player-runes'>
                          <div className='player-rune-div'>
                            <img className='player-rune' src={displayImage(index, 'runes', runes, 'keystone')} alt="" />
                          </div>

                          <div className='player-rune-div'>
                            <img className='player-rune' src={displayImage(index, 'runes', runes, 'secondaryRunes')} alt="" />
                          </div>
                        </div>

                        {/* KDA */}
                        <div className='player-kda-cs-div'>
                          <span className='player-kda'>
                            {`${displayStat(index, 'kills')} / ${displayStat(index, 'deaths')} / ${displayStat(index, 'assists')}`}
                          </span>
                          <span className='player-cs'>CS: {displayStat(index, 'cs')}</span>
                        </div>
                      </div>

                      {/* Items */}
                      <div className='player-champ-bottom-div'>
                        {displayPlayerItemIcon(index, 'item0')}
                        {displayPlayerItemIcon(index, 'item1')}
                        {displayPlayerItemIcon(index, 'item2')}
                        {displayPlayerItemIcon(index, 'item3')}
                        {displayPlayerItemIcon(index, 'item4')}
                        {displayPlayerItemIcon(index, 'item5')}
                        {displayPlayerItemIcon(index, 'item6')}
                      </div>
                    </div>
                  </div>

                  {/* Bottom half of match container. Second class also changes based on game outcome */}
                  <div className={`match-container-bottom bottom-${index} table-${className}`}>
                    {/* Container for table */}
                    <div className='match-table-div'>
                      {/* Table for player's team */}
                      <table className='match-player-table match-table'>
                        {/* Table header */}
                        <thead>
                          <tr>
                            <th>{`${match.teamColor} Team`}</th>
                            <th>KDA</th>
                            <th>Damage</th>
                            <th>Wards</th>
                            <th>CS</th>
                            <th>Items</th>
                          </tr>
                        </thead>
                        
                        {/* Table body */}
                        <tbody>
                          {props.matchDataList[index].playerTeamData.map((player, pos) => {
                            return(
                              // Row of player data
                              <tr>
                                {/* Player name, champion, champ level, runes, and summoner spells */}
                                <td className='table-player'>
                                  <div className='table-champ-level-div'>
                                    <span className='table-champ-level'>{player.champLevel}</span>
                                  </div>
                                  
                                  <div className='table-champ-icon-div'>
                                    <img className='table-champ-icon' src={`/assets/champion/${player.champion}.png`}/>
                                  </div>

                                  <div className='table-summs-div'>
                                    <img className='table-summ-icon'
                                          src={`/assets/spells/${summonerSpells[player.summoner1].imgurl}`} alt="" />
                                    <img className='table-summ-icon'
                                          src={`/assets/spells/${summonerSpells[player.summoner2].imgurl}`} alt="" />
                                  </div>

                                  <div className='table-runes-div'>
                                    <img className='table-runes'
                                          src={`/assets/runes/${runes[player.keystone].imgurl}`} alt="" />
                                    <img className='table-runes'
                                          src={`/assets/runes/${runes[player.secondaryRunes].imgurl}`} alt="" />
                                  </div>

                                  <Link className='table-player-link'
                                        to={`/profile/${props.routingID}/${player.gameName}/${player.tagLine}`}
                                        target='_blank'>
                                    <span className='table-game-name'>{player.gameName}</span>
                                  </Link>
                                </td>

                                {/* Player KDA */}
                                <td className='table-kda'>
                                  <span>{`${player.kills}/${player.deaths}/${player.assists}`}</span>
                                </td>

                                {/* Player damage */}
                                <td className='table-damage'>
                                  <span>{`${player.dmgDealtChamp}`}</span>
                                </td>

                                {/* Player ward stats */}
                                <td className='table-wards'>
                                  <div className='control-wards'>
                                    <span>{player.controlWards}</span>
                                  </div>

                                  <div className='wards-stats'>
                                    <span>{`${player.wardsPlaced} / ${player.wardsKilled}`}</span>
                                  </div>
                                </td>

                                {/* Player cs */}
                                <td className='table-cs'>
                                  <span>{player.cs}</span>
                                </td>

                                {/* Player items */}
                                <td className='table-items'>
                                  {player.item0 === 0 && <div className='table-item-empty'></div>}
                                  {player.item0 !== 0 && <img className='table-item-img' src={`/assets/item/${player.item0}.png`} alt="" />}

                                  {player.item1 === 0 && <div className='table-item-empty'></div>}
                                  {player.item1 !== 0 && <img className='table-item-img' src={`/assets/item/${player.item1}.png`} alt="" />}

                                  {player.item2 === 0 && <div className='table-item-empty'></div>}
                                  {player.item2 !== 0 && <img className='table-item-img' src={`/assets/item/${player.item2}.png`} alt="" />}

                                  {player.item3 === 0 && <div className='table-item-empty'></div>}
                                  {player.item3 !== 0 && <img className='table-item-img' src={`/assets/item/${player.item3}.png`} alt="" />}

                                  {player.item4 === 0 && <div className='table-item-empty'></div>}
                                  {player.item4 !== 0 && <img className='table-item-img' src={`/assets/item/${player.item4}.png`} alt="" />}

                                  {player.item5 === 0 && <div className='table-item-empty'></div>}
                                  {player.item5 !== 0 && <img className='table-item-img' src={`/assets/item/${player.item5}.png`} alt="" />}

                                  {player.item6 === 0 && <div className='table-item-empty'></div>}
                                  {player.item6 !== 0 && <img className='table-item-img' src={`/assets/item/${player.item6}.png`} alt="" />}
                                </td>
                              </tr>
                            );
                          })}
                          {/* Creates a divider between the two tables */}
                          <tr className='table-divider'><td></td><td></td><td></td><td></td><td></td><td></td></tr>
                        </tbody>
                      </table>

                      {/* Table for enemy team */}
                      <table className='match-enemy-table match-table'>
                        {/* Displays the same headers except for the team color */}
                        <thead>
                          <tr>
                            <th>{`${match.enemyColor} Team`}</th>
                            <th>KDA</th>
                            <th>Damage</th>
                            <th>Wards</th>
                            <th>CS</th>
                            <th>Items</th>
                          </tr>
                        </thead>

                        {/* Displays the same stats for the enemy team */}
                        <tbody>
                          {props.matchDataList[index].enemyTeamData.map((player, pos) => {
                            return(
                              <tr>
                                <td className='table-player'>
                                  <div className='table-champ-level-div'>
                                    <span className='table-champ-level'>{player.champLevel}</span>
                                  </div>
                                  
                                  <div className='table-champ-icon-div'>
                                    <img className='table-champ-icon' src={`/assets/champion/${player.champion}.png`}/>
                                  </div>

                                  <div className='table-summs-div'>
                                    <img className='table-summ-icon'
                                          src={`/assets/spells/${summonerSpells[player.summoner1].imgurl}`} alt="" />
                                    <img className='table-summ-icon'
                                          src={`/assets/spells/${summonerSpells[player.summoner2].imgurl}`} alt="" />
                                  </div>

                                  <div className='table-runes-div'>
                                    <img className='table-runes'
                                          src={`/assets/runes/${runes[player.keystone].imgurl}`} alt="" />
                                    <img className='table-runes'
                                          src={`/assets/runes/${runes[player.secondaryRunes].imgurl}`} alt="" />
                                  </div>

                                  <Link className='table-player-link'
                                        to={`/profile/${props.routingID}/${player.gameName}/${player.tagLine}`}
                                        target='_blank'>
                                    <span className='table-game-name'>{player.gameName}</span>
                                  </Link>
                                </td>
                                <td className='table-kda'>
                                  <span>{`${player.kills}/${player.deaths}/${player.assists}`}</span>
                                </td>
                                <td className='table-damage'>
                                  <span>{`${player.dmgDealtChamp}`}</span>
                                </td>
                                <td className='table-wards'>
                                  <div className='control-wards'>
                                    <span>{player.controlWards}</span>
                                  </div>

                                  <div className='wards-stats'>
                                    <span>{`${player.wardsPlaced} / ${player.wardsKilled}`}</span>
                                  </div>
                                </td>
                                <td className='table-cs'>
                                  <span>{player.cs}</span>
                                </td>
                                <td className='table-items'>
                                  {player.item0 === 0 && <div className='table-item-empty'></div>}
                                  {player.item0 !== 0 && <img className='table-item-img' src={`/assets/item/${player.item0}.png`} alt="" />}

                                  {player.item1 === 0 && <div className='table-item-empty'></div>}
                                  {player.item1 !== 0 && <img className='table-item-img' src={`/assets/item/${player.item1}.png`} alt="" />}

                                  {player.item2 === 0 && <div className='table-item-empty'></div>}
                                  {player.item2 !== 0 && <img className='table-item-img' src={`/assets/item/${player.item2}.png`} alt="" />}

                                  {player.item3 === 0 && <div className='table-item-empty'></div>}
                                  {player.item3 !== 0 && <img className='table-item-img' src={`/assets/item/${player.item3}.png`} alt="" />}

                                  {player.item4 === 0 && <div className='table-item-empty'></div>}
                                  {player.item4 !== 0 && <img className='table-item-img' src={`/assets/item/${player.item4}.png`} alt="" />}

                                  {player.item5 === 0 && <div className='table-item-empty'></div>}
                                  {player.item5 !== 0 && <img className='table-item-img' src={`/assets/item/${player.item5}.png`} alt="" />}

                                  {player.item6 === 0 && <div className='table-item-empty'></div>}
                                  {player.item6 !== 0 && <img className='table-item-img' src={`/assets/item/${player.item6}.png`} alt="" />}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </>
            );
          }
        })}
      </div>
    </>
  )
}

export default ProfileMatches;