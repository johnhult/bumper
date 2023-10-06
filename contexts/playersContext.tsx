'use client';

import * as React from 'react';
import { Player, Position, TextureChoice, textureMap } from '@/types/player';
import { useTexture } from '@react-three/drei';
import { useGetSocket } from './socketContext';
import { PlayerOnServer } from '@/types/socket';

interface PlayersContextInterface {
  players: Set<Player>;
  // playersGameData: Set<PlayerData>;
  // addPlayer: (p: Player) => void;
  // removePlayer: (pId: string) => void;
}

const PlayersContext = React.createContext<PlayersContextInterface | null>(
  null
);

function PlayersProvider({ children }: { children: React.ReactNode }) {
  const [players, setPlayers] = React.useState<Set<Player>>(new Set());
  const socket = useGetSocket();

  React.useEffect(() => {
    console.log('{PLAYER_CONTEXT}-WE GOT SOCKET: ', socket);

    socket.on('playerConnect', addToRoster);
    socket.on('playerDisconnect', removeFromRoster);
    return () => {
      socket.off('playerConnect', addToRoster);
      socket.off('playerDisconnect', removeFromRoster);
    };
  }, [socket]);

  React.useEffect(() => {
    console.log('{PLAYER_CONTEXT}-ROSTER: ', players);
  }, [players]);

  function addToRoster(users: PlayerOnServer[]) {
    console.log('{PLAYER_CONTEXT}-WE GOT SOCKET CONNECT: ', socket, users);

    let updatedPlayerList: Set<Player> = new Set();
    const playersOnServer: Set<PlayerOnServer> = new Set(users);
    for (const p of playersOnServer) {
      console.log('POSITION: ', p.startPosition);
      const player = {
        connected: true,
        dashCD: 0.8,
        hp: 5,
        id: p.id,
        mass: 5,
        maxTorque: 10,
        name: 'SAME NAME',
        radius: 1,
        startPosition: p.startPosition,
        textureUrl: TextureChoice.watermelon,
      };
      updatedPlayerList.add(player);
    }
    setPlayers(updatedPlayerList);
  }

  function removeFromRoster(id: string) {
    const newList = new Set(players);
    for (const p of players) {
      if (p.id === id) {
        newList.delete(p);
        setPlayers(newList);
        break;
      }
    }
  }

  const val = {
    players,
  };

  return (
    <PlayersContext.Provider value={val}>{children}</PlayersContext.Provider>
  );
}

export default PlayersProvider;

export function useGetPlayersInLobby() {
  const context = React.useContext(PlayersContext);
  if (!context) {
    throw new Error('PlayersContext can only be used in child components');
  }
  return context.players;
}
