import { NextApiRequest } from 'next';
import * as THREE from 'three';
import { Server as IOServer } from 'socket.io';
import {
  ClientToServerEvents,
  InterServerEvents,
  NextApiResponseWithSocket,
  PlayerOnServer,
  ServerToClientEvents,
  SocketData,
} from '@/types/socket';
import { gameConstants } from '@/types/game';
import { getRandomPosition } from '@/hooks/gameHelpers';

const randomPos = new THREE.Vector3(0, 0, 0);

// function getRandomStartPosition() {
//   const angle = 2 * Math.PI * Math.random();
//   const p: [number, number, number] = [
//     (gameConstants.platformRadius / 2) * Math.sin(angle),
//     6.5,
//     (gameConstants.platformRadius / 2) * Math.cos(angle),
//   ];
//   randomPos.set(...p);
//   if (p) {
//     // TODO: CHECK OTHER POSITIONS
//   }
//   return p;
// }

function updatePositions() {}

function SocketHandler(req: NextApiRequest, res: NextApiResponseWithSocket) {
  let users = new Set<PlayerOnServer>();
  if (res.socket.server.io) {
    console.log('We got a socket server');
  } else {
    console.log('Initializing socket server');
    const io = new IOServer<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(res.socket.server);
    res.socket.server.io = io;
    io.on('connection', (socket) => {
      io.emit(
        'collectPlayerPositions',
        [...users].map((p) => p.id)
      );
      const player: PlayerOnServer = {
        id: socket.id,
        startPosition: getRandomPosition(),
        hp: 5,
      };
      users.add(player);
      console.log('ALL USERS: ', users);

      io.emit('playerConnect', [...users]);
      socket.on('playerKeyStatus', (id, keys) => {
        io.emit('playerKeyStatus', id, keys);
      });
      socket.on('playerDash', (id) => {
        io.emit('sendDash', id);
      });
      socket.on('playerHit', (id, pos) => {
        console.log('PLAYER HIT THE GROUND');
        io.emit('resetPlayerWithId', id, pos);
      });

      socket.on('disconnect', (reason) => {
        console.log('PLAYER ID: ', player.id, reason);
        io.emit('playerDisconnect', player.id);
        users.delete(player);
      });
    });
  }
  res.end();
}

export default SocketHandler;
