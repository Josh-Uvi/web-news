import React from 'react';
import { SWRConfig } from 'swr';
import { UserIPContextProvider } from './contexts/IPContext';

export default function Main() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());

  return (
    <SWRConfig value={{ fetcher }}>
      <UserIPContextProvider />
    </SWRConfig>
  );
}
