import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import './home-page.css'

// App home page where users can enter their "Riot ID" and get their match history
function HomePage() {
  // Get region and regionID from local storage
  let getRegion = JSON.parse(localStorage.getItem('region'));
  if (!getRegion) {
    getRegion = 'NA';
  }

  let getRegionID = JSON.parse(localStorage.getItem('regionID'));
  if (!getRegionID) {
    getRegionID = 'na1';
  }

  // Stores region to use for searching
  const [region, setRegion] = useState(getRegion);

  // Stores regionID for profile page query param
  const [regionID, setRegionID] = useState(getRegionID);

  // Enable navigate hook
  const navigate = useNavigate();
  
  // When called, displays the list of regions to change to
  function showRegionMenu() {
    document.querySelector('.region-options').style.display = 'block';
  }

  // When called, sets the region and regionID based on what the user picked
  function changeRegion(regionChange, regionIDChange) {
    setRegion(regionChange);
    localStorage.setItem('region', JSON.stringify(regionChange));

    setRegionID(regionIDChange);
    localStorage.setItem('regionID', JSON.stringify(regionIDChange));
  }

  // When called, navigates to the profile the user entered in the search bar
  function navProfile() {
    // Only navigates if user input isn't empty
    if (document.querySelector('.user-input').value != '') {
      // Encodes username so it can be the correct query param
      const username = encodeURIComponent(document.querySelector('.user-input').value);

      // Navigate to profile
      navigate(`profile/${regionID}/${username}`);
    }
  }

  // If body is clicked and the region elements weren't the target, hide the region options
  document.body.addEventListener('click', (e) => {
    if (e.target.className != 'region-name' &&
        e.target.className != 'region-label' &&
        e.target.className != 'region-text') {
      document.querySelector('.region-options').style.display = 'none';
    }
  });

  return(
    <>
      <div className='container'>
        {/* Contains the website logo and headers */}
        <div className='header-div'>
          <img src="logo.webp" alt="" />

          <h1>
            League of Legends Stats
          </h1>

          <h2>View Detailed League of Legends Match History Stats</h2>
        </div>

        {/* Contains the elements for the search bar */}
        <div className='search-bar'>
          {/* Contains region selection and user input elements */}
          <div className='top-search'>
            <div className='select-region' onClick={showRegionMenu}>
              {/* Current region selected */}
              <div className='region-text'>
                <span className='region-label'>Region</span>
                <span className='region-name'>{region}</span>
              </div>

              {/* List of regions to change to */}
              {/* Clicking on an option changes the current region to that region */}
              <div className='region-options'>
                <ul>
                  <li onClick={() => changeRegion('NA', 'na1')}>NA</li>
                  <li onClick={() => changeRegion('EUW', 'euw1')}>EUW</li>
                  <li onClick={() => changeRegion('EUNE', 'eune1')}>EUNE</li>
                  <li onClick={() => changeRegion('OCE', 'oc1')}>OCE</li>
                  <li onClick={() => changeRegion('KR', 'kr')}>KR</li>
                  <li onClick={() => changeRegion('BR', 'br1')}>BR</li>
                  <li onClick={() => changeRegion('LAS', 'la1')}>LAS</li>
                  <li onClick={() => changeRegion('LAN', 'la2')}>LAN</li>
                  <li onClick={() => changeRegion('RU', 'ru')}>RU</li>
                  <li onClick={() => changeRegion('SG', 'sg2')}>SG</li>
                  <li onClick={() => changeRegion('PH', 'ph2')}>PH</li>
                  <li onClick={() => changeRegion('TW', 'tw2')}>TW</li>
                  <li onClick={() => changeRegion('VN', 'vn2')}>VN</li>
                  <li onClick={() => changeRegion('TH', 'th2')}>TH</li>
                </ul>
              </div>
            </div>

            {/* User input */}
            <input className='user-input' type="text" placeholder="Enter RIOT ID"/>
          </div>
          
          {/* Search button */}
          <button className='search-button' onClick={navProfile}>Search</button>
        </div>
      </div>
    </>
  );
}

export default HomePage;