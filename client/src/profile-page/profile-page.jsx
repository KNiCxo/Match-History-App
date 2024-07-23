import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import './profile-page.css';

// Import search bar component
import SearchBar from '../search-bar.jsx';

function ProfilePage() {
  // Fetches user match history data
  const fetchData = async () => {
    const puuid = await fetch(`http://localhost:4000/profile/NA/${gameName}-${tagLine}`);
    const puuidJSON = await puuid.status;
    console.log('here');
    console.log(puuidJSON);
  };

  return(
    <>
      {/* Search Bar component */}
      <div className='search-bar-div'>
        <SearchBar></SearchBar>
      </div>
    </>
  );
}

export default ProfilePage;