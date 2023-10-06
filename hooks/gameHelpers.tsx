import * as React from 'react';
import * as THREE from 'three';
import { StoreApi } from 'zustand';
import { Controls, gameConstants } from '@/types/game';
import { Socket } from 'socket.io-client';
import { ClientToServerEvents, ServerToClientEvents } from '@/types/socket';
import { KeyboardControls, useKeyboardControls } from '@react-three/drei';

// ===== DUPLICATE OF KEYBOARDCONTROLS BECAUSE TYPESCRIPT
type State = object;
type StateSelector<T extends State, U> = (state: T) => U;
type EqualityChecker<T> = (state: T, newState: T) => boolean;
type StateListener<T> = (state: T, previousState: T) => void;
type KeyboardControlsState<T extends string = string> = {
  [K in T]: boolean;
};
type StoreApiWithSubscribeWithSelector<T extends State> = Omit<
  StoreApi<T>,
  'subscribe'
> & {
  subscribe: {
    (listener: StateListener<T>): () => void;
    <StateSlice>(
      selector: StateSelector<T, StateSlice>,
      listener: StateListener<StateSlice>,
      options?: {
        equalityFn?: EqualityChecker<StateSlice>;
        fireImmediately?: boolean;
      }
    ): () => void;
  };
};

const randomPos = new THREE.Vector3(0, 0, 0);

export function getRandomPosition() {
  const angle = 2 * Math.PI * Math.random();
  const p: [number, number, number] = [
    (gameConstants.platformRadius / 2) * Math.sin(angle),
    gameConstants.spawnHeight,
    (gameConstants.platformRadius / 2) * Math.cos(angle),
  ];
  randomPos.set(...p);
  if (p) {
    // TODO: CHECK OTHER POSITIONS
  }
  return p;
}

export function bindKeys(
  sub: StoreApiWithSubscribeWithSelector<
    KeyboardControlsState<Controls>
  >['subscribe'],
  socket: Socket<ServerToClientEvents, ClientToServerEvents>,
  id: string
) {
  sub(
    (state) => state.forward,
    (pressed) => {
      if (pressed) {
        socket.emit('playerKeyStatus', id, ['forward', true]);
      } else if (!pressed) {
        socket.emit('playerKeyStatus', id, ['forward', false]);
      }
    }
  );
  sub(
    (state) => state.back,
    (pressed) => {
      if (pressed) {
        socket.emit('playerKeyStatus', id, ['back', true]);
      } else if (!pressed) {
        socket.emit('playerKeyStatus', id, ['back', false]);
      }
    }
  );
  sub(
    (state) => state.left,
    (pressed) => {
      if (pressed) {
        socket.emit('playerKeyStatus', id, ['left', true]);
      } else if (!pressed) {
        socket.emit('playerKeyStatus', id, ['left', false]);
      }
    }
  );
  sub(
    (state) => state.right,
    (pressed) => {
      if (pressed) {
        socket.emit('playerKeyStatus', id, ['right', true]);
      } else if (!pressed) {
        socket.emit('playerKeyStatus', id, ['right', false]);
      }
    }
  );
  sub(
    (state) => state.dash,
    (pressed) => {
      if (pressed) {
        socket.emit('playerDash', id);
      }
    }
  );
}
