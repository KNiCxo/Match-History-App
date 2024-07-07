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
        console.log(gameName);
      }
    }
  }
  
  const fetchData = async () => {
    const puuid = await fetch('https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/blonded/kujo?api_key=RGAPI-b2a9aef0-4bf2-4291-9072-1d455ab062d6');
    const puuidJSON = await puuid.json();
  };

  // Fetches and organizes necessary data on app mount
  useEffect(() => {
    parseUsername();
    fetchData();
  }, []);
}

export default ProfilePage;