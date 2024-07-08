import React, {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';

import './profile-page.css';

function ProfilePage() {
  const {region, account} = useParams();
  
  const fetchData = async () => {
    const puuid = await fetch(`http://localhost:4000/profile/NA/${gameName}-${tagLine}`);
    const puuidJSON = await puuid.status;
    console.log('here');
    console.log(puuidJSON);
  };

  return(
    <>

    </>
  );
}

export default ProfilePage;