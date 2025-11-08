import React, { Suspense, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture, Html, OrbitControls } from '@react-three/drei';

function CardMesh({ textureUrl }) {
  const ref = useRef();
  const tex = useTexture(textureUrl);
  // subtle hover/tilt state via pointer position from three's viewport
  const { mouse, viewport } = useThree();
  useFrame((state, dt) => {
    if (!ref.current) return;
    // float
    ref.current.rotation.x = (-mouse.y / viewport.height) * 0.25 + Math.sin(state.clock.elapsedTime * 0.6) * 0.02;
    ref.current.rotation.y = (mouse.x / viewport.width) * 0.45 + Math.sin(state.clock.elapsedTime * 0.4) * 0.01;
    // slight subtle scale breathing
    const s = 1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.005;
    ref.current.scale.set(s, s, s);
  });

  return (
    <group ref={ref}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[1.6, 1.0, 1, 1]} />
        <meshStandardMaterial map={tex} toneMapped={false} metalness={0.1} roughness={0.6} />
      </mesh>
      {/* a soft rim light using a transparent plane behind for subtle depth */}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[1.62, 1.02]} />
        <meshBasicMaterial transparent opacity={0.04} color="#000000" />
      </mesh>
    </group>
  );
}

export default function ThreeCardFront({ src, title }) {
  // We map the card area to Canvas aspect; Canvas is styled to fill the card face
  if (!src) {
    return <div style={{ width: '100%', height: '100%', background: '#081426' }} />;
  }

  return (
    <div className="three-card-canvas" aria-hidden>
      <Canvas shadows flat linear camera={{ position: [0, 0, 2.2], fov: 35 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 5]} intensity={0.6} />
        <Suspense fallback={<Html center style={{ color: '#fff' }}>Loading…</Html>}>
          <CardMesh textureUrl={src} />
        </Suspense>
        {/* small orbit controls disabled for interaction but helpful for pointer rendering */}
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}
