const fetchReducer = (state, action) => {
  switch (action.type) {
    case 'FETCHING':
      return { ...state, status: 'fetching' };
    case 'FETCHED':
      return { ...state, status: 'fetched', data: action.payload };
    case 'FETCH_ERROR':
      return { ...state, status: 'error', error: action.payload };
    default:
      return state;
  }
};

export default fetchReducer;
