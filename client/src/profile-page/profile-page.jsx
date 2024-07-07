import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';

import './profile-page.css';

function ProfilePage() {
  const {region, account} = useParams();
  let gameName;
  let tagLine;

  // blonded#kujo
  function parseUsername() {
    for (let i = 0; i <= account.length; i++) {
      if (account.charAt(i) == '#') {
        let gameName = account.slice(0, i);
        //console.log(gameName);
      }
    }
  }
  
  const fetchData = async () => {
    const puuid = await fetch('http://localhost:4000/profile');
    const puuidJSON = await puuid.json();
    console.log(puuidJSON);
  };

  // Fetches and organizes necessary data on app mount
  useEffect(() => {
    parseUsername();
    fetchData();
  }, []);
}

export default ProfilePage;