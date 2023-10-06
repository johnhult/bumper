'use client';

import { gameConstants } from '@/types/game';
import { Cylinder } from '@react-three/drei';
import { CylinderCollider, RigidBody } from '@react-three/rapier';
import { Vector3 } from 'three';

function Platform() {
  const placement = new Vector3(0, 0, 0);
  return (
    <RigidBody
      type='fixed'
      name='platform'
      colliders={false}
      restitution={0.5}
      friction={0.6}
    >
      <CylinderCollider args={[5, gameConstants.platformRadius]} />
      <Cylinder
        args={[
          gameConstants.platformRadius,
          gameConstants.platformRadius,
          10,
          64,
          1,
        ]}
        castShadow
        receiveShadow
        position={placement}
      >
        <meshStandardMaterial
          color='#edc99f'
          roughness={0}
        ></meshStandardMaterial>
      </Cylinder>
    </RigidBody>
  );
}

export default Platform;
