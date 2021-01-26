import { useEffect, useReducer, useRef } from 'react';
import { apiBaseUrl, apiKey, page } from '../helpers/keys';
import fetchReducer from '../Reducers/fetchReducer';

export default function useFetch(url) {
  const cache = useRef({});

  const initialState = {
    status: 'idle',
    error: null,
    data: [],
  };

  const [state, dispatch] = useReducer(fetchReducer, initialState);

  useEffect(() => {
    let cancelRequest = false;
    if (!url) return;

    const fetchData = async () => {
      if (cache.current[url]) {
        const data = cache.current[url];
        dispatch({ type: 'FETCHED', payload: data });
      } else {
        try {
          const response = await fetch(url);
          const data = await response.json();
          cache.current[url] = data;
          if (cancelRequest) return;
          dispatch({ type: 'FETCHED', payload: data });
        } catch (error) {
          if (cancelRequest) return;
          dispatch({ type: 'FETCH_ERROR', payload: error.message });
        }
      }
    };

    fetchData();

    return () => {
      cancelRequest = true;
    };
  }, [url]);

  return state;
}

export const usePost = (category, country) =>
  useFetch(
    `${apiBaseUrl}&category=${category}&country=${country}&page_number=${page}&apiKey=${apiKey}`
  );
