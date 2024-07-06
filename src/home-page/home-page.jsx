import './home-page.css'

// App home page where users can enter their "Riot ID" and get their match history
function HomePage() {
  // When called, displays the list of regions to change to
  function showRegionMenu() {
    document.querySelector('.region-options').style.display = 'block';
  }

  // When called, sets the region based on what the user picked
  function changeRegion(region) {
    console.log(region);
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
                <span className='region-name'>NA</span>
              </div>

              {/* List of regions to change to */}
              {/* Clicking on an option changes the current region to that region */}
              <div className='region-options'>
                <ul>
                  <li onClick={() => changeRegion('NA')}>NA</li>
                  <li>EUW</li>
                  <li>EUNE</li>
                  <li>OCE</li>
                  <li>KR</li>
                  <li>BR</li>
                  <li>LAS</li>
                  <li>LAN</li>
                  <li>RU</li>
                  <li>SG</li>
                  <li>PH</li>
                  <li>TW</li>
                  <li>VN</li>
                  <li>TH</li>
                </ul>
              </div>
            </div>

            {/* User input */}
            <input className='user-input' type="text" placeholder="Enter RIOT ID"/>
          </div>
          
          {/* Search button */}
          <button className='search-button'>Search</button>
        </div>
      </div>
    </>
  );
}

export default HomePage;