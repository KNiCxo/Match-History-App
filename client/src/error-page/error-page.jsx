import './error-page.css'

// Import search bar component
import SearchBar from '../search-bar.jsx';

function ErrorPage() {
  return(
    <>
      <div className='error-img-div'>
        <img className='error-img' src="error.png" alt="" />
      </div>
      
      <h1 className='error-title'>Username could not be found</h1>
      <h2 className='error-cta'>Please double-check the game name and tag, and try again.</h2>
      <SearchBar></SearchBar>
    </>
  );
}

export default ErrorPage;