import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

import './search-bar.css';
import './search-bar-res.css';

function SearchBar() {
  // Get region, routingID, and regionTag from local storage
  let getRegion = JSON.parse(localStorage.getItem('region'));
  if (!getRegion) {
    getRegion = 'NA';
  }

  let getRoutingID = JSON.parse(localStorage.getItem('routingID'));
  if (!getRoutingID) {
    getRoutingID = 'na1';
  }

  let getRegionTag = JSON.parse(localStorage.getItem('regionTag'));
  if (!getRegionTag) {
    getRegionTag = '#NA1'
  }

  // Stores region to use for searching
  const [region, setRegion] = useState(getRegion);

  // Stores routingID for profile page query param
  const [routingID, setRoutingID] = useState(getRoutingID);

  // Stores region tag for search bar placeholder
  const [regionTag, setRegionTag] = useState(getRegionTag);

  // Enable navigate hook
  const navigate = useNavigate();

  // When called, displays the list of regions to change to
  function showRegionMenu() {
    document.querySelector('.region-options').style.display = 'block';
  }

  // Hides region options when called
  function hideRegionMenu(e) {
    // If element clicked is not related to the region elements, hide region options
    if (e.target.className != 'region-name' &&
          e.target.className != 'region-label' &&
          e.target.className != 'region-text') {
        document.querySelector('.region-options').style.display = 'none';
      }
  }

  // When called, sets the region, routingID, and regionTag based on what the user picked
  function changeRegion(regionChange, routingIDChange, regionTagChange) {
    setRegion(regionChange);
    localStorage.setItem('region', JSON.stringify(regionChange));

    setRoutingID(routingIDChange);
    localStorage.setItem('routingID', JSON.stringify(routingIDChange));

    setRegionTag(regionTagChange);
    localStorage.setItem('regionTag', JSON.stringify(regionTagChange));
  }

  // Parses input and sets gameName and tagLine
  function parseUsername(username) {
    // Loops until it finds a # char
    for (let i = 0; i < username.length; i++) {
      // If '#' char is found, set gameName to chars before the '#' and tagLine for chars after
      if (username.charAt(i) === '#') {
        return {
          gameName: username.slice(0, i),
          tagLine: username.slice(i + 1, username.length)
        }
      }
    }
    
    // If '#' is not found, set gameName and tagLine as empty strings
    return {
      gameName: '',
      tagLine: ''
    }
  }

  // When called, navigates to the profile page or error page depending on if the user input was valid
  const navProfile = async () => {
    // Only attempts to navigate if user input isn't empty
    if (document.querySelector('.user-input').value != '') {
      // Get username from input field
      const username = document.querySelector('.user-input').value;

      // Parse username and set gameName and tagLine 
      let {gameName, tagLine} = parseUsername(username);

      // Clear input and navigate to profile
      document.querySelector('.user-input').value = '';
      if (gameName == '') {
        navigate('/error');
      } else {
        navigate(encodeURI(`/profile/${routingID}/${gameName}/${encodeURIComponent(tagLine)}`));
      }
    }
  };

  // Adds event listener on component mount
  useEffect(() => {
    // If body is clicked and the region elements weren't the target, hide the region options
    document.body.addEventListener('click', hideRegionMenu);

    // Removes event listener when navigating to profile page
    return () => {
      document.body.removeEventListener('click', hideRegionMenu);
    }
  }, []);

  return(
    <>
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
                <li onClick={() => changeRegion('NA', 'na1', '#NA1')}>NA</li>
                <li onClick={() => changeRegion('EUW', 'euw1', '#EUW')}>EUW</li>
                <li onClick={() => changeRegion('EUNE', 'eun1', '#EUNE')}>EUNE</li>
                <li onClick={() => changeRegion('OCE', 'oc1', '#OCE')}>OCE</li>
                <li onClick={() => changeRegion('KR', 'kr', '#KR1')}>KR</li>
                <li onClick={() => changeRegion('JP', 'jp1', '#JP1')}>JP</li>
                <li onClick={() => changeRegion('BR', 'br1', '#BR1')}>BR</li>
                <li onClick={() => changeRegion('LAS', 'la1', '#LAS')}>LAS</li>
                <li onClick={() => changeRegion('LAN', 'la2', '#LAN')}>LAN</li>
                <li onClick={() => changeRegion('RU', 'ru', '#RU1')}>RU</li>
                <li onClick={() => changeRegion('TR', 'tr1', '#TR1')}>TR</li>
                <li onClick={() => changeRegion('SG', 'sg2', '#SG2')}>SG</li>
                <li onClick={() => changeRegion('PH', 'ph2', '#PH2')}>PH</li>
                <li onClick={() => changeRegion('TW', 'tw2', '#TW2')}>TW</li>
                <li onClick={() => changeRegion('VN', 'vn2', '#VN2')}>VN</li>
                <li onClick={() => changeRegion('TH', 'th2', '#TH2')}>TH</li>
                <li onClick={() => changeRegion('ME', 'me1', '#me1')}>ME</li>
              </ul>
            </div>
          </div>

          {/* User input */}
          <input className='user-input' type="text" placeholder={`Game name + ${regionTag.toUpperCase()}`}/>
        </div>
        
        {/* Search button */}
        <button className='search-button' onClick={navProfile}>Search</button>
      </div>
    </>
  )
}

export default SearchBar;