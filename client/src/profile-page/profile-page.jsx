import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import './profile-page.css';

// Import search bar and match history components
import SearchBar from '../search-bar.jsx';
import ProfileHeader from './profile-header.jsx';

// Displays match history of player that was searched by the user
function ProfilePage() {
  // Get regionID, gameName, and tagLine from URL params
  let {regionID, gameName, tagLine} = useParams();

  // Create variables for profile icon number and summoner level
  const [iconNum, setIconNum] = useState(null);
  const [summonerLevel, setLevel] = useState(null);

  // Fetches user match history data
  const fetchData = async () => {
    // Make call to get Summoner info
    const summonerCall = await fetch(`http://localhost:4000/profile/${regionID}/${gameName}/${tagLine}`);
    const summonerJSON = await summonerCall.json();

    // Set profile icon number and profile level
    setIconNum(summonerJSON.profileIconId);
    setLevel(summonerJSON.summonerLevel);
  };

  // If iconNum was set, display Profile Header
  function displayProfileHeader() {
    if (iconNum) {
      return(<ProfileHeader iconNum={iconNum} summonerLevel={summonerLevel} gameName={gameName} tagLine={tagLine}></ProfileHeader>)
    }
  }

  // Fetch data when params are retrieved from URL
  useEffect(() => {
    fetchData();
  }, [regionID, gameName, tagLine]);

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
    </>
  );
}

export default ProfilePage;