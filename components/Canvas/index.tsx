'use client';
import * as React from 'react';
import * as THREE from 'three';
import { Canvas as ThreeCanvas } from '@react-three/fiber';
import Platform from '../Platform';
import {
  KeyboardControls,
  KeyboardControlsEntry,
  OrbitControls,
  OrthographicCamera,
  Stats,
  useHelper,
} from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { Physics, RapierRigidBody } from '@react-three/rapier';
import Killzone from '../Killzone';
import { useGetSocket } from '@/contexts/socketContext';
import { useGetPlayersInLobby } from '@/contexts/playersContext';
import { TextureChoice } from '@/types/player';
import Player from '../Player';
import { Controls } from '@/types/game';

const softShadowConfig = {
  size: 25,
  focus: 0,
  samples: 10,
  frustum: 3.75,
  near: 9.5,
  rings: 11,
};

function SceneContent() {
  const socket = useGetSocket();
  const groupRef = React.useRef<THREE.Group>(null!);
  const directionalLightRef = React.useRef<THREE.DirectionalLight>(null!);
  useHelper(directionalLightRef, THREE.DirectionalLightHelper, 1);
  const origin = React.useMemo(() => new THREE.Vector3(0, 0, 0), []);
  const state = useThree();
  const players = useGetPlayersInLobby();
  const playerObjectsRef = React.useRef<RapierRigidBody[]>();

  useThree((state) => {
    // console.log(state);
    state.camera.lookAt(origin);
  });

  return (
    <>
      <Stats />
      <ambientLight intensity={1.5} />
      <directionalLight
        ref={directionalLightRef}
        castShadow
        position={[10, 10, 5]}
        color='navajowhite'
        intensity={1}
        // shadow-bias={-0.0001}
        shadow-camera-near={5}
        shadow-camera-far={50}
        shadow-camera-top={10}
        shadow-camera-right={15}
        shadow-camera-bottom={-10}
        shadow-camera-left={-15}
        shadow-mapSize={[512, 512]}
        shadow-radius={5}
        shadow-blurSamples={25}
      ></directionalLight>
      {/* <SoftShadows {...softShadowConfig} /> */}
      {/* <PerspectiveCamera makeDefault position={[0, 20, 20]} /> */}
      <OrthographicCamera
        makeDefault
        position={[0, 10, 10]}
        zoom={50}
        near={0.0001}
      />
      {/* <fog attach='fog' args={['white', 30, 70]} /> */}
      <OrbitControls />
      {/* <Grid args={[100, 100]} /> */}
      <group ref={groupRef} position={[0, -4, 0]}>
        <Platform />
        {Array.from(players).map((player, i) => {
          return (
            <Player
              connected={player.connected}
              dashCD={player.dashCD}
              id={player.id}
              key={player.id + i}
              playerMass={player.mass}
              maxTorque={player.maxTorque}
              playerName={player.id}
              radius={player.radius}
              startPosition={player.startPosition}
              textureChoice={player.textureUrl}
            />
          );
        })}
      </group>
      <Killzone />
    </>
  );
}

function Canvas() {
  const ref = React.useRef<HTMLElement>(null!);
  React.useEffect(() => {
    ref.current = document.body;
  });
  const map = React.useMemo<KeyboardControlsEntry<Controls>[]>(
    () => [
      { name: Controls.forward, keys: ['ArrowUp', 'KeyW'] },
      { name: Controls.back, keys: ['ArrowDown', 'KeyS'] },
      { name: Controls.left, keys: ['ArrowLeft', 'KeyA'] },
      { name: Controls.right, keys: ['ArrowRight', 'KeyD'] },
      { name: Controls.dash, keys: ['Space'] },
    ],
    []
  );
  return (
    <div className='absolute inset-0 -z-50'>
      <ThreeCanvas shadows eventSource={ref}>
        <KeyboardControls map={map}>
          <Physics debug>
            <SceneContent />
          </Physics>
        </KeyboardControls>
      </ThreeCanvas>
    </div>
  );
}

export default Canvas;
