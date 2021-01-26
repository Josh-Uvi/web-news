import React from 'react';
import { apiKey, searchEndpoint } from '../helpers/keys';
import useFetch from '../hooks/useFetch';
import useForm from '../hooks/useForm';

export default function SearchComponent() {
  const { value, query, handleChange, handleSubmit } = useForm('');

  const { status, data, error } = useFetch(
    `${searchEndpoint}&language=en&apiKey=${apiKey}&keywords=${query}`
  );

  const posts = data.news;

  return (
    <>
      <div style={{ marginBottom: '20px', marginTop: '20px' }}>
        <form className='searchForm' onSubmit={handleSubmit}>
          <input
            type='text'
            autoFocus
            autoComplete='off'
            value={value}
            onChange={handleChange}
            placeholder='Search News Articles....'
          />
          <button type='submit' disabled={!value}>
            <i style={{ color: '#fff' }} className='fa fa-search'></i>
          </button>
        </form>
      </div>
      <div className='searchContainer'>
        {status === 'error' && <div>{error}</div>}
        {status === 'fetching' && <div className='loading'>Loading....</div>}
        {status === 'fetched' && (
          <>
            {posts.length === 0 && <div> No articles found! </div>}
            <div className='query'>Search result for {query}</div>
            {posts.map((article, key) => (
              <div className='searchList' key={key}>
                <p>
                  <a
                    target='_blank'
                    href={article.url}
                    rel='noopener noreferrer'>
                    {article.title}
                  </a>
                </p>
              </div>
            ))}
          </>
        )}
      </div>
    </>
  );
}
