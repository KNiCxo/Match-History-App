import './home-page.css'

function HomePage() {
  return(
    <>
      <div className='search-bar'>
        <img src="logo.webp" alt="" />
        <h1>
          League of Legends Stats
        </h1>

        <label htmlFor="">Region</label>
        <select name="region" id="">
          <option value="na1">NA</option>
          <option value="euw1">EUW</option>
          <option value="eun1">EUNE</option>
          <option value="oce1">OCE</option>
          <option value="kr">KR</option>
          <option value="jp1">JP</option>
          <option value="br1">BR</option>
          <option value="la2">LAS</option>
          <option value="la1">LAN</option>
          <option value="ru">RU</option>
          <option value="tr1">TR</option>
          <option value="sg2">SG</option>
          <option value="ph2">PH</option>
          <option value="tw2">TW</option>
          <option value="vn2">VN</option>
          <option value="th2">TH</option>
        </select>

        <label htmlFor="">Search</label>
        <input type="text" placeholder="Enter RIOT ID"/>
      </div>
    </>

  );
}

export default HomePage;