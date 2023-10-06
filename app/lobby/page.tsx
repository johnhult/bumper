'use client';

import * as React from 'react';
import * as THREE from 'three';
// import {
//   useAddPlayerToRoster,
//   useGetPlayersInLobby,
// } from '@/contexts/playersContext';
import {
  useConnectToSocket,
  useDisconnectFromSocket,
  useIsServerRunning,
} from '@/contexts/socketContext';
import { TextureChoice } from '@/types/player';

function Lobby() {
  const serverRunning = useIsServerRunning();
  const connect = useConnectToSocket();
  const disconnect = useDisconnectFromSocket();
  // const addPlayer = useAddPlayerToRoster();
  // const players = useGetPlayersInLobby();

  React.useEffect(() => {
    const controller = new AbortController();
    async function connectToSocket() {
      await connect(controller.signal);
    }
    if (serverRunning) {
      connectToSocket();
    }
    return () => {
      disconnect();
      controller.abort('unmounting lobby');
    };
  }, [connect, serverRunning]);

  return (
    <div className='w-full h-screen flex flex-col items-center px-5 py-5'>
      <h1 className='mb-5'>Lobby</h1>
      {/* <div className='w-1/2 border-slate-900 rounded-md border-solid border flex-1 self-start'></div> */}
    </div>
  );
}

export default Lobby;
