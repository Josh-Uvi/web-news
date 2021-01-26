import React, { createContext, useEffect, useState } from 'react';
import App from '../App';
import { fetchIp } from '../helpers/utils';
import { PostContextProvider } from './PostContext';

const UserIPContext = createContext();
export default UserIPContext;

export function UserIPContextProvider() {
  const [userIP, setUserIP] = useState();

  useEffect(() => {
    let fetching = true;
    const getIP = async () => {
      try {
        const result = await fetchIp();
        setUserIP(result);
        fetching = false;
      } catch (error) {
        console.error(error);
      }
    };

    getIP();

    return () => (fetching = false);
  }, []);

  const ContextWrapper = ({ data }) => (
    <UserIPContext.Provider value={{ data }}>
      <PostContextProvider />
    </UserIPContext.Provider>
  );

  return typeof userIP !== 'undefined' ? (
    <ContextWrapper data={userIP} />
  ) : (
    <div className='loading'></div>
  );
}
