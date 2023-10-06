'use client';
import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket';
import React from 'react';

import { io, type Socket } from 'socket.io-client';
// import {
//   useAddPlayerToRoster,
//   useRemovePlayerFromRoster,
// } from './playersContext';
import { TextureChoice } from '@/types/player';

interface SocketContextProps {
  children: React.ReactNode;
}
interface SocketContextInterface {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  serverRunning: boolean;
  connect: (
    signal: AbortSignal
  ) => Promise<Socket<ServerToClientEvents, ClientToServerEvents>>;
  disconnect: () => void;
}

export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  autoConnect: false,
});
const SocketContext = React.createContext<SocketContextInterface | null>(null);

function SocketProvider({ children }: SocketContextProps) {
  const [serverRunning, setServerRunning] = React.useState(false);
  // const socketRef =
  //   React.useRef<Socket<ServerToClientEvents, ClientToServerEvents>>();
  // const [socket, setSocket] =
  //   React.useState<Socket<ServerToClientEvents, ClientToServerEvents>>();
  // const addPlayer = useAddPlayerToRoster();
  // const removePlayer = useRemovePlayerFromRoster();

  // const setupServer = React.useCallback(async function runServer(signal: AbortSignal) {

  // }, [])

  React.useEffect(() => {
    const controller = new AbortController();
    async function startServer() {
      const res = await fetch('/api/socket', { signal: controller.signal });
      console.log(res);
      setServerRunning(true);
    }
    startServer();
    return () => {
      controller.abort();
    };
  }, []);

  const connect = React.useCallback(async function connectSocket(
    signal: AbortSignal
  ) {
    socket.connect();
    socket.on('connect', () => {
      console.log(`{SOCKET_CONTEXT}-PLAYER_CONNECTED: ${socket.id}`);
      // socket.emit('addToPlayerList', );
    });
    socket.on('playerDisconnect', (id) => {
      console.log('{SOCKET_CONTEXT}-PLAYER_DISCONNECTED', id);
    });
    return socket;
  },
  []);

  const disconnect = React.useCallback(function disconnectSocket() {
    socket.disconnect();
  }, []);

  const val = {
    socket,
    serverRunning,
    connect,
    disconnect,
  };

  return (
    <SocketContext.Provider value={val}>{children}</SocketContext.Provider>
  );
}

export default SocketProvider;

export function useIsServerRunning() {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error('SocketContext can only be used in child components');
  }
  return context.serverRunning;
}

export function useConnectToSocket() {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error('SocketContext can only be used in child components');
  }
  return context.connect;
}

export function useDisconnectFromSocket() {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error('SocketContext can only be used in child components');
  }
  return context.disconnect;
}
export function useGetSocket() {
  const context = React.useContext(SocketContext);
  if (!context) {
    throw new Error('SocketContext can only be used in child components');
  }
  return context.socket;
}
