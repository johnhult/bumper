'use client';

import * as React from 'react';
import * as THREE from 'three';
import { Plane } from '@react-three/drei';
import {
  CollisionPayload,
  CuboidCollider,
  RapierCollider,
  interactionGroups,
} from '@react-three/rapier';
import { ColGroup } from '@/types/game';

function Killzone() {
  const colliderRef = React.useRef<RapierCollider>(null!);
  const startRot = new THREE.Euler(THREE.MathUtils.degToRad(-90), 0, 0);

  return (
    <CuboidCollider
      ref={colliderRef}
      args={[100, 1, 100]}
      position={[0, -2, 0]}
      name='killzone'
      collisionGroups={interactionGroups(ColGroup.KILLZONE, ColGroup.PLAYER)}
    >
      <Plane
        args={[100, 100]}
        position={[0, 2, 0]}
        receiveShadow
        rotation={startRot}
      >
        <meshStandardMaterial
          opacity={0.8}
          transparent={true}
          color='#6c8c9b'
        />
      </Plane>
    </CuboidCollider>
  );
}

export default Killzone;
