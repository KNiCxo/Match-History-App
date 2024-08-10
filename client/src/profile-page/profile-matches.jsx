import './profile-matches.css';

// Import JSON data
import runes from '../lib/runes.json';
import summonerSpells from '../lib/summoner-spells.json';
import items from '../lib/item.json';
import champions from '../lib/champion.json';

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

  return(
    <>
      {/* Match History */}
      <div className='match-list-container'>
        {/* Loop through all matches in the list */}
        {props.matchDataList.map((match, index) => {
          // Set value of container color based on match outcome */}
          let color;
          if (match.outcome == 'Victory') {
            color = 'rgb(13, 94, 193)';
          } else if (match.outcome == 'Remake') {
            color = 'rgb(61, 62, 63)';
          } else {
            color = 'rgb(188, 7, 7)';
          }

          // HTML for one match
          return(
            <div className='match-container' style={{backgroundColor: color}} key={`${match.gameCompleted}-${index}`}>
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

                    <div className='player-champ-level-div'>
                      <span className='player-champ-level'>{displayStat(index, 'champLevel')}</span>
                    </div>
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
          );
        })}
      </div>
    </>
  )
}

export default ProfileMatches;