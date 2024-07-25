import './profile-header.css';

// Component that displays player profile picutre, summoner level, and name
function ProfileHeader(props) {
  return(
    <>
      <div className='profile-header'>
        {/* Profile img and level*/}
        <div className='img-div'>
          <img className='profile-img' src={`/assets/profileicon/${props.iconNum}.png`} alt="" />
          
          <div className='profile-level-div'>
            <span className='profile-level'>{props.summonerLevel}</span>
          </div>
        </div>

        {/* Profile game name and tag line */}
        <div className='profile-name'>
          <span className='profile-game-name'>{props.gameName}</span>
          <span className='profile-tag-line'>{`#${props.tagLine}`}</span>
        </div>
      </div>
    </>
  ) 
}

export default ProfileHeader;