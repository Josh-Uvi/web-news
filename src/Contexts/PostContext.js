import React, { createContext, useContext } from 'react';
import useSWR from 'swr';
import App from '../App';
import { apiBaseUrl, apiKey, category, page } from '../helpers/keys';
import { useStorage } from '../hooks/useStorage';
import UserIPContext from './IPContext';

const PostContext = createContext();
export default PostContext;

export const PostContextProvider = () => {
  // global state
  const userIp = useContext(UserIPContext);
  const { data } = userIp;
  const { code, name } = data;

  // use local storage to persist category and country
  const [storedCategory, setStoreCategory] = useStorage(
    'News-App-key-Category',
    category
  );
  const [storedCountry, setStoreCountry] = useStorage(
    'News-App-key-Country',
    code
  );

  // choose country
  const selectedCountry =
    typeof storedCountry === 'undefined' ? code : storedCountry;

  //make api call to fetch data
  const url = `${apiBaseUrl}&category=${storedCategory}&country=${selectedCountry}&page_number=${page}&apiKey=${apiKey}`;

  const { data: post, error } = useSWR(url, { revalidateOnFocus: false });

  if (error) return <div className='error'>Something went wrong!</div>;
  if (!post) return <div className='loading'></div>;

  // console.log('data', post);

  return (
    <>
      <PostContext.Provider
        value={{
          post,
          name,
          setStoreCategory,
          setStoreCountry,
          storedCategory,
          selectedCountry,
        }}>
        <App />
      </PostContext.Provider>
    </>
  );
};
