import * as THREE from 'three';
import { useRef, Suspense } from 'react';
import { Canvas, useFrame, useThree, ThreeElements } from '@react-three/fiber';
import { useGLTF, MeshTransmissionMaterial } from '@react-three/drei';
import { easing } from 'maath';

type ModeProps = Record<string, unknown>;

interface Bubble {
  id: string;
  name: string;
  icon: string;
  size: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
}

interface FluidGlassProps {
  mode?: 'lens';
  lensProps?: ModeProps;
  bubbles?: Bubble[];
  containerSize?: number;
  mousePosition?: { x: number; y: number };
}

type MeshProps = ThreeElements['mesh'];

function Model({ ...materialProps }: any) {
  const { nodes } = useGLTF('/assets/3d/lens.glb');
  return (
    <mesh 
      geometry={(nodes.Cylinder as THREE.Mesh)?.geometry}
      rotation-x={Math.PI / 2}
    >
      <MeshTransmissionMaterial
        ior={1.15}
        thickness={5}
        anisotropy={0.01}
        chromaticAberration={0.1}
        {...materialProps}
      />
    </mesh>
  );
}

function Lens({ 
  modeProps = {},
  bubbles = [],
  containerSize = 300,
  mousePosition = { x: 0, y: 0 },
  ...p 
}: { 
  modeProps?: ModeProps;
  bubbles?: Bubble[];
  containerSize?: number;
  mousePosition?: { x: number; y: number };
} & MeshProps) {
  const lens = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  
  useFrame((state, delta) => {
    if (lens.current) {
      const { pointer } = state;
      const v = viewport.getCurrentViewport(state.camera, [0, 0, 15]);
      
      const destX = (pointer.x * v.width) / 2;
      const destY = (pointer.y * v.height) / 2;
      
      easing.damp3(lens.current.position, [destX, destY, 15], 0.15, delta);
      lens.current.scale.setScalar(0.15);
    }
  });

  return (
    <group ref={lens}>
      <Suspense fallback={null}>
        <Model {...modeProps} />
      </Suspense>
    </group>
  );
}

export default function FluidGlass({ 
  mode = 'lens', 
  lensProps = {}, 
  bubbles = [],
  containerSize = 300,
  mousePosition = { x: 0, y: 0 }
}: FluidGlassProps) {
  return (
    <Canvas camera={{ position: [0, 0, 20], fov: 15 }} gl={{ alpha: true }}>
      <Lens 
        modeProps={lensProps}
        bubbles={bubbles}
        containerSize={containerSize}
        mousePosition={mousePosition}
      />
    </Canvas>
  );
}
