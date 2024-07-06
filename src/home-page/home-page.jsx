import './home-page.css'

function HomePage() {
  document.body.addEventListener('click', (e) => {
    console.log(e.target.className);
    if (e.target.className != 'region-name' &&
        e.target.className != 'region-label' &&
        e.target.className != 'region-text') {
      document.querySelector('.region-options').style.display = 'none';
    }
  });

  function showRegionMenu() {
    document.querySelector('.region-options').style.display = 'block';
  }

  return(
    <>
      <div className='container'>
        <div className='header-div'>
          <img src="logo.webp" alt="" />

          <h1>
            League of Legends Stats
          </h1>

          <h2>View Detailed League of Legends Match History Stats</h2>
        </div>

        <div className='search-bar'>
          <div className='top-search'>
            <div className='select-region' onClick={showRegionMenu}>
              <div className='region-text'>
                <span className='region-label'>Region</span>
                <span className='region-name'>NA</span>
              </div>

              <div className='region-options'>
                <ul>
                  <li>NA</li>
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

            <input className='user-input' type="text" placeholder="Enter RIOT ID"/>
          </div>

          <button className='search-button'>Search</button>
        </div>
      </div>
    </>
  );
}

export default HomePage;