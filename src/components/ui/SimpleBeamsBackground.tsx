/// <reference path="../../types/three.d.ts" />
'use client';

import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function BeamsScene() {
  const meshRef = useRef<THREE.Mesh>(null!);

  // Create simple animated geometry
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 50, 50);
    return geo;
  }, []);

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          vUv = uv;
          vPosition = position;
          
          vec3 pos = position;
          pos.z += sin(pos.x * 2.0 + time) * 0.5;
          pos.z += sin(pos.y * 3.0 + time * 1.5) * 0.3;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        varying vec2 vUv;
        varying vec3 vPosition;
        
        void main() {
          float wave1 = sin(vUv.x * 10.0 + time * 2.0) * 0.5 + 0.5;
          float wave2 = sin(vUv.y * 8.0 + time * 1.5) * 0.5 + 0.5;

          vec3 color = vec3(0.5, 0.5, 0.5) * (wave1 + wave2);

          gl_FragColor = vec4(color, 0.2);
        }
      `,
      uniforms: {
        time: { value: 0 }
      },
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      material.uniforms.time.value = state.clock.elapsedTime;
    }
  });

  return (
    // @ts-ignore
    <mesh ref={meshRef} geometry={geometry} material={material} rotation={[-Math.PI / 4, 0, 0]} />
  );
}

export default function SimpleBeamsBackground() {
  return (
    <div className="w-full h-full">
      <Canvas className="w-full h-full">
        {/* @ts-ignore */}
        <ambientLight intensity={0.5} />
        {/* @ts-ignore */}
        <pointLight position={[10, 10, 10]} />
        <BeamsScene />
      </Canvas>
    </div>
  );
}
