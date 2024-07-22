import './home-page.css'

// Import search bar component
import SearchBar from '../search-bar.jsx';

// App home page where users can enter their "Riot ID" and get their match history
function HomePage() {
  return(
    <>
      <div className='container'>
        {/* Contains the website logo and headers */}
        <div className='header-div'>
          <img src="logo.webp" alt="" />

          <h1 className='title'>
            League of Legends Stats
          </h1>

          <h2 className='description'>View Detailed League of Legends Match History Stats</h2>
        </div>

        <SearchBar></SearchBar>
      </div>
    </>
  );
}

export default HomePage;