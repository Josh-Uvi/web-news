import React from 'react';
import useLocalTime from '../hooks/useLocalTime';

export default function Header({ toggleSearch, location }) {
  const userTime = useLocalTime();
  return (
    <header className='header'>
      <div className='logo'>GIST</div>
      <div className='hd-location'>
        <span>
          <i className='fa fa-map-marker'></i> {location}
        </span>
      </div>
      <div className='hd-time'>
        <button className='hd-searchBtn' onClick={toggleSearch}>
          <i className='fa fa-search'></i>
        </button>
        <span>
          | <i className='fa fa-clock-o'></i> {userTime}
        </span>
      </div>
    </header>
  );
}
