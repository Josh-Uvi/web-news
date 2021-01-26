import moment from 'moment';

import { endPoint, ipUrl } from './keys';

export const formatTime = (props) => {
  const formatTime = new Date(props).toISOString();
  const newTime = moment(formatTime).fromNow();
  return newTime;
};

export const sortPost = (props) => {
  return props.sort((a, b) => new Date(b.published) - new Date(a.published));
};

export const sortList = (props) => (a, b) => {
  if (a[props] > b[props]) {
    return 1;
  } else if (a[props] < b[props]) return -1;
  return 0;
};

export const fetchIp = async () => {
  try {
    const response = await fetch(ipUrl);
    const value = await response.json();

    return {
      code: value.country.toLowerCase(),
      name: value.name,
    };
  } catch (err) {
    err.message;
  }
};

export const fetchPost = async () => {
  try {
    const response = await fetch(endPoint);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return error;
  }
};
