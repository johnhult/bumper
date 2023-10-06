'use client';

import * as React from 'react';
import * as THREE from 'three';
import { useGetSocket } from '@/contexts/socketContext';
import { Position, TextureChoice, textureMap } from '@/types/player';
import {
  Html,
  Sphere,
  useKeyboardControls,
  useTexture,
} from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import {
  CoefficientCombineRule,
  CollisionPayload,
  RapierRigidBody,
  RigidBody,
  euler,
  interactionGroups,
  quat,
  useRapier,
  vec3,
} from '@react-three/rapier';
import { ColGroup, Controls, KeyPress, KeysPressed } from '@/types/game';
import { bindKeys, getRandomPosition } from '@/hooks/gameHelpers';
import { useGetPlayersInLobby } from '@/contexts/playersContext';

interface PlayerModelProps {
  connected: boolean;
  dashCD: number;
  id: string;
  playerMass: number;
  maxTorque: number;
  playerName: string;
  radius: number;
  startPosition: Position;
  textureChoice: TextureChoice;
}

const testVector = new THREE.Vector3(0, 0.5, 0);
const zeroVec = new THREE.Vector3(0, 0, 0);
let ballPosVec = new THREE.Vector3(0, 0, 0);
let xDirVec = new THREE.Vector3(0, 0, 0);
let zDirVec = new THREE.Vector3(0, 0, 0);
let ballDirection = new THREE.Vector3(0, 0, 0);
let impulseVector = new THREE.Vector3(-1, 0, 0);
let forceFromAngVel = new THREE.Vector3(0, 0, 0);

function Player({
  dashCD,
  id,
  maxTorque,
  playerName,
  radius,
  startPosition,
  textureChoice = TextureChoice.watermelon,
  ...props
}: PlayerModelProps) {
  const rigidBody = React.useRef<RapierRigidBody>(null);
  const immobile = React.useRef(false);
  const radiusVec = React.useRef(new THREE.Vector3(0, radius, 0));
  const mesh = React.useRef<
    THREE.Mesh<
      THREE.BufferGeometry<THREE.NormalBufferAttributes>,
      THREE.Material | THREE.Material[],
      THREE.Object3DEventMap
    >
  >(null!);
  const rapier = useRapier();
  const counter = React.useRef(0);
  const dashCDRef = React.useRef(false);
  const socket = useGetSocket();
  const players = useGetPlayersInLobby();
  const playerTexture = useTexture(textureMap[textureChoice]);
  const [sub, get] = useKeyboardControls<Controls>();
  const keysPressed = React.useRef<KeysPressed>({
    forward: false,
    back: false,
    left: false,
    right: false,
  });

  React.useEffect(() => {
    socket.on('playerKeyStatus', updateKeysPressed);
    socket.on('sendDash', addImpulse);
    socket.on('resetPlayerWithId', resetPosition);
    return () => {
      socket.off('playerKeyStatus', updateKeysPressed);
      socket.off('sendDash', addImpulse);
      socket.off('resetPlayerWithId', resetPosition);
    };
  }, [socket]);

  React.useEffect(() => {
    if (socket.id === id) {
      bindKeys(sub, socket, id);
    }
  }, []);

  function updateKeysPressed(playerId: string, keys: KeyPress) {
    if (id === playerId) {
      keysPressed.current = { ...keysPressed.current, [keys[0]]: keys[1] };
    }
  }

  function hit(payload: CollisionPayload) {
    const rb = rigidBody.current;
    if (
      payload.other.colliderObject &&
      payload.other.colliderObject.name === 'killzone' &&
      !immobile.current &&
      rb &&
      id === socket.id
    ) {
      // TODO: RESPAWN AND HP REDUCE LOGIC
      if (rb) {
        immobile.current = true;
        socket.emit('playerHit', id, getRandomPosition());
      }
    }
  }

  function addImpulse(playerId: string) {
    const rb = rigidBody.current;
    if (!dashCDRef.current && rb && playerId === id && !immobile.current) {
      const { forward, back, left, right } = keysPressed.current;
      dashCDRef.current = true;
      setTimeout(() => (dashCDRef.current = false), dashCD * 1000);

      impulseVector
        .set(+right - +left, 0, +back - +forward)
        .normalize()
        .multiplyScalar(50);
      rb.applyImpulse(impulseVector, true);
    }
  }

  function resetPosition(playerId: string, pos: Position) {
    if (rigidBody.current && id === playerId) {
      const rb = rigidBody.current;
      setTimeout(() => {
        rb.resetForces(false);
        rb.resetTorques(false);
        rb.setAngvel(zeroVec, false);
        rb.setLinvel(zeroVec, false);
        ballPosVec.set(...pos);
        rb.setTranslation(ballPosVec, false);
        immobile.current = false;
      }, 1000);
    }
  }

  useFrame((state) => {
    counter.current += 1;
    const rb = rigidBody.current;
    if (rb && !immobile.current) {
      const { forward, back, left, right } = keysPressed.current;

      rb.resetForces(true);
      rb.resetTorques(true);
      if ((forward || back || left || right) && rb.translation().y > 1.4) {
        if (rb.angvel().x > maxTorque && back) {
          xDirVec.set(0, 0, 0);
        } else if (rb.angvel().x < -maxTorque && forward) {
          xDirVec.set(0, 0, 0);
        } else {
          xDirVec.set(0, 0, +back - +forward);
        }
        if (rb.angvel().z > maxTorque && left) {
          zDirVec.set(0, 0, 0);
        } else if (rb.angvel().z < -maxTorque && right) {
          zDirVec.set(0, 0, 0);
        } else {
          zDirVec.set(+left - +right, 0, 0);
        }
        ballDirection
          .subVectors(xDirVec, zDirVec)
          .normalize()
          .multiplyScalar(100);
        rb.addForceAtPoint(
          ballDirection,
          vec3(rb.translation()).add(radiusVec.current),
          true
        );
      }
    }

    // LOG FROM TIME TO TIME
    // if (counter.current % 180 === 0) {
    //   console.log(rb.angvel());
    //   console.log(rb.translation().y);
    // }
  });

  return (
    <>
      <RigidBody
        ref={rigidBody}
        name={id}
        colliders='ball'
        mass={50}
        restitution={1}
        friction={0.2}
        position={startPosition}
        linearDamping={1}
        angularDamping={1}
        collisionGroups={interactionGroups(ColGroup.PLAYER)}
        onCollisionEnter={hit}
        {...props}
      >
        <group position={[0, radius, 0]}>
          <Html style={{ transform: 'translateX(-50%) translateY(-100%)' }}>
            {/* <Html> */}
            <span>{playerName}</span>
          </Html>
        </group>
        <Sphere args={[radius, 24, 24]} castShadow ref={mesh}>
          <meshBasicMaterial map={playerTexture}></meshBasicMaterial>
        </Sphere>
      </RigidBody>
    </>
  );
}

export default Player;
