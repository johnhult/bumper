import { NextApiResponse } from 'next';
import { Server as HTTPServer } from 'http';
import { Socket as NetSocket } from 'net';
import { Server as IOServer } from 'socket.io';
import { KeyPress, KeysPressed } from './game';
import { Position } from './player';

export interface CustomDataServer
  extends IOServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  > {}

interface SocketServer extends HTTPServer {
  io?: CustomDataServer | undefined;
}

interface SocketWithIO extends NetSocket {
  server: SocketServer;
}

export interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO;
}

export interface ServerToClientEvents {
  playerDisconnect: (id: string) => void;
  playerConnect: (users: PlayerOnServer[]) => void;
  playerKeyStatus: (id: string, keysPressed: KeyPress) => void;
  sendDash: (id: string) => void;
  resetPlayerWithId: (id: string, newPos: Position) => void;
  collectPlayerPositions: (ids: string[]) => void;
}

export interface ClientToServerEvents {
  addToPlayerList: (id: string) => void;
  playerKeyStatus: (id: string, keyPress: KeyPress) => void;
  playerDash: (id: string) => void;
  playerHit: (id: string, newPos: Position) => void;
}

export interface InterServerEvents {
  ping: () => void;
  sling: () => void;
}

export interface SocketData {}

export interface PlayerOnServer {
  id: string;
  startPosition: Position;
  hp: number;
}
