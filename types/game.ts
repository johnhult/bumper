export enum Controls {
  forward = 'forward',
  back = 'back',
  left = 'left',
  right = 'right',
  dash = 'dash',
}

export enum ColGroup {
  PLAYER = 0,
  PLATFORM = 1,
  KILLZONE = 2,
}

export type KeysPressed = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
};

export type KeyPress = [keyof KeysPressed, boolean];

export const gameConstants = {
  platformRadius: 10,
  spawnHeight: 6.5,
};
