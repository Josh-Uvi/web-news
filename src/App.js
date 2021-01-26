import React, { useContext, useState } from 'react';
import './App.css';
import SearchComponent from './Components/Search';
import Header from './Components/Header';
import SideBarComponent from './Components/SideBar';
import CardComponent from './Components/Card';
import PostContext from './contexts/PostContext';

export default function App() {
  const [searching, setSearching] = useState(false);

  const toggleSearch = () => setSearching(!searching); // toggle search button

  const { name } = useContext(PostContext);

  return (
    <div className='container'>
      <Header location={name} toggleSearch={toggleSearch} />
      {searching ? (
        <SearchComponent />
      ) : (
        <>
          <SideBarComponent />
          <CardComponent />
        </>
      )}
      <footer className='footer'>(c) Josh Uvi</footer>
    </div>
  );
}
