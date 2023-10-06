export enum TextureChoice {
  watermelon = 'watermelon',
  zebra = 'zebra',
}

export const textureMap = {
  watermelon: '/textures/watermelon/color.jpg',
  zebra: '/textures/zebra/color.jpg',
};

export type Position = [number, number, number];

export interface Player {
  connected: boolean;
  dashCD: number;
  id: string;
  mass: number;
  maxTorque: number;
  startPosition: Position;
  name: string;
  radius: number;
  textureUrl: TextureChoice;
}
