import React from 'react';

export default function useLocalTime() {
  const options = {
    year: '2-digit',
    month: 'short',
    day: '2-digit',
    hour: 'numeric',
    minute: 'numeric',
    weekday: 'long',
    hour12: true,
    timeZone: userZone,
    // timeZoneName: 'short',
  };
  const date = new Date();
  const userZone = new Intl.DateTimeFormat().resolvedOptions().timeZone;
  const userTime = new Intl.DateTimeFormat('en-GB', options).format(date);

  return userTime;
}
