"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useRef, type ComponentRef } from "react";
import type { Group } from "three";

// drei doesn't export the material's impl type — pull it back off the component.
type DistortMaterial = ComponentRef<typeof MeshDistortMaterial>;

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

function Blob() {
  const group = useRef<Group>(null);
  const material = useRef<DistortMaterial>(null);

  useFrame((state, dt) => {
    if (!group.current) return;
    const { x, y } = state.pointer; // normalised -1..1, already smoothed by r3f
    const d = Math.min(dt, 0.1); // clamp so a backgrounded tab doesn't snap the blob on return

    // Tilt toward the cursor rather than track it — a full follow reads as a toy.
    group.current.rotation.y = damp(group.current.rotation.y, x * 0.55, 2.5, d);
    group.current.rotation.x = damp(group.current.rotation.x, -y * 0.4, 2.5, d);
    // Base offset keeps the blob clear of the right edge, so the silhouette reads whole.
    group.current.position.x = damp(group.current.position.x, -0.35 + x * 0.28, 2, d);
    group.current.position.y = damp(group.current.position.y, y * 0.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08, 2, d);

    // Cursor distance from centre drives how molten the surface gets.
    if (material.current) {
      const reach = Math.min(1, Math.hypot(x, y));
      material.current.distort = damp(material.current.distort, 0.42 + reach * 0.3, 2, d);
    }
  });

  return (
    <group ref={group}>
      <Sphere args={[1, 160, 160]} scale={1.42}>
        <MeshDistortMaterial
          ref={material}
          color="#100b07"
          distort={0.5}
          speed={1.1}
          roughness={0.36}
          metalness={0.4}
          clearcoat={1}
          clearcoatRoughness={0.32}
          envMapIntensity={1.5}
        />
      </Sphere>
    </group>
  );
}

export default function HeroScene({ onReady }: { onReady?: () => void }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      // The blob is the whole scene; nothing here needs shadows.
      shadows={false}
      onCreated={() => onReady?.()}
    >
      <Blob />

      {/* Body shading comes from real lights, not the environment: any discrete lightformer in
          front reflects off the surface as a visible disc or patch. */}
      <ambientLight intensity={0.12} />
      <directionalLight position={[-4, 2.5, 4]} intensity={2.4} color="#ffce8a" />
      <directionalLight position={[4.5, -1, 2]} intensity={0.45} color="#2f9e93" />

      {/* Lightformers instead of a preset HDR: same studio look, zero network requests. Both panels
          sit behind the blob so they only graze the silhouette as rim light. */}
      <Environment resolution={256}>
        <color attach="background" args={["#040605"]} />
        <Lightformer form="rect" intensity={5} color="#ffb627" position={[-4.5, 1.5, -4]} scale={[7, 9, 1]} />
        <Lightformer form="rect" intensity={3.2} color="#2f9e93" position={[4.5, 2.5, -3.5]} scale={[5, 8, 1]} />
      </Environment>
    </Canvas>
  );
}
