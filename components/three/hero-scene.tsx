"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshDistortMaterial, Sphere } from "@react-three/drei";
import { useEffect, useMemo, useRef, type ComponentRef, type RefObject } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// drei doesn't export the material's impl type — pull it back off the component.
type DistortMaterial = ComponentRef<typeof MeshDistortMaterial>;

// The hero canvas is only ~40% of the viewport wide, so at fov 40 / z 6 the visible half-width is
// about 1.4 world units. A shell starting at 2.4 put essentially the whole field off-canvas — the
// field is a box matched to the frustum instead, with the blob's volume carved out of it.
const FIELD_X = 2.0;
const FIELD_Y = 2.8;
const FIELD_Z = 2.0;
const BLOB_CLEARANCE = 1.75; // blob is a unit sphere at scale 1.42, plus margin
const RIPPLE_LIFE = 1.1; // seconds
const RIPPLE_SPEED = 7; // world units/sec the wavefront travels
const RIPPLE_FORCE = 1.5;

function damp(current: number, target: number, lambda: number, dt: number) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

/**
 * Particle budget. The scene never mounts on a phone at all — the hero gates three.js behind
 * (min-width: 768px) and (pointer: fine) — so this is really about small laptops and high-DPR
 * panels, where every particle costs more fill.
 */
function particleBudget() {
  if (typeof window === "undefined") return 900;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth;
  const base = w < 1100 ? 700 : w < 1600 ? 1200 : 1600;
  return Math.round(base / (dpr > 1.5 ? 1.6 : 1));
}

function Particles({ progress }: { progress: RefObject<number> }) {
  const count = useMemo(particleBudget, []);
  const points = useRef<THREE.Points>(null);
  const { size, camera } = useThree();

  // Typed arrays, allocated once. base holds the rest layout; offset is the live displacement the
  // ripple writes into and decays — mutating these beats re-creating geometry every frame.
  const { geometry, base, offset, material } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const lime = new THREE.Color("#cdff57");
    const cream = new THREE.Color("#e9e9e4");

    for (let i = 0; i < count; i++) {
      // Rejection-sample the box until the point clears the blob, so none are hidden inside it.
      let x = 0;
      let y = 0;
      let z = 0;
      for (let tries = 0; tries < 12; tries++) {
        x = (Math.random() * 2 - 1) * FIELD_X;
        y = (Math.random() * 2 - 1) * FIELD_Y;
        z = (Math.random() * 2 - 1) * FIELD_Z;
        if (Math.hypot(x, y, z) > BLOB_CLEARANCE) break;
      }
      pos[i * 3] = x;
      pos[i * 3 + 1] = y;
      pos[i * 3 + 2] = z;

      // A minority carry the accent, like the design's particle field.
      const c = Math.random() < 0.18 ? lime : cream;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.BufferAttribute(pos.slice(), 3));
    g.setAttribute("color", new THREE.BufferAttribute(col, 3));

    const m = new THREE.PointsMaterial({
      size: 0.055,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 1,
      depthWrite: false, // additive dots shouldn't occlude each other
      blending: THREE.AdditiveBlending,
    });

    return { geometry: g, base: pos, offset: new Float32Array(count * 3), material: m };
  }, [count]);

  // Dispose explicitly: r3f only auto-disposes objects it created from JSX, not these.
  useEffect(() => () => {
    geometry.dispose();
    material.dispose();
  }, [geometry, material]);

  const ripple = useRef({ age: Infinity, x: 0, y: 0, z: 0 });

  // Pointer-down anywhere over the canvas fires a wavefront from that point.
  useEffect(() => {
    const el = document.getElementById("hero");
    if (!el) return;
    const down = (e: PointerEvent) => {
      const nx = (e.clientX / size.width) * 2 - 1;
      const ny = -(e.clientY / size.height) * 2 + 1;
      // Unproject onto the z=0 plane so the ripple starts where the pointer visually is.
      const v = new THREE.Vector3(nx, ny, 0.5).unproject(camera);
      const dir = v.sub(camera.position).normalize();
      const p = camera.position.clone().add(dir.multiplyScalar(-camera.position.z / dir.z));
      ripple.current = { age: 0, x: p.x, y: p.y, z: 0 };
    };
    el.addEventListener("pointerdown", down);
    return () => el.removeEventListener("pointerdown", down);
  }, [camera, size.width, size.height]);

  useFrame((state, dt) => {
    const d = Math.min(dt, 0.1); // a backgrounded tab must not deliver one giant step
    const p = progress.current;
    const attr = geometry.attributes.position as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;

    const r = ripple.current;
    const active = r.age < RIPPLE_LIFE;
    if (active) r.age += d;
    const front = r.age * RIPPLE_SPEED;
    // Fades as the wavefront travels, so the impulse dies out rather than stopping abruptly.
    const strength = active ? RIPPLE_FORCE * (1 - r.age / RIPPLE_LIFE) : 0;

    const t = state.clock.elapsedTime;
    // Scroll pushes the whole field outward and fades it.
    const spread = 1 + p * 2.6;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const bx = base[i3];
      const by = base[i3 + 1];
      const bz = base[i3 + 2];

      if (active) {
        const dx = bx - r.x;
        const dy = by - r.y;
        const dist = Math.hypot(dx, dy, bz - r.z) || 1e-4;
        // Only the thin shell the wavefront is currently crossing gets pushed.
        const band = 1 - Math.min(1, Math.abs(dist - front) / 1.4);
        if (band > 0) {
          const push = (strength * band * band) / dist;
          offset[i3] += dx * push * d * 8;
          offset[i3 + 1] += dy * push * d * 8;
          offset[i3 + 2] += (bz - r.z) * push * d * 8;
        }
      }

      // Elastic settle back to rest.
      offset[i3] = damp(offset[i3], 0, 2.4, d);
      offset[i3 + 1] = damp(offset[i3 + 1], 0, 2.4, d);
      offset[i3 + 2] = damp(offset[i3 + 2], 0, 2.4, d);

      // Idle drift — phase keyed off the index so no two particles move together.
      const wob = Math.sin(t * 0.35 + i * 0.7) * 0.045;

      arr[i3] = (bx + offset[i3]) * spread;
      arr[i3 + 1] = (by + offset[i3 + 1] + wob) * spread;
      arr[i3 + 2] = (bz + offset[i3 + 2]) * spread;
    }
    attr.needsUpdate = true;

    material.opacity = 1 - p;
    if (points.current) points.current.rotation.y += d * 0.02; // slow constant drift
  });

  return <points ref={points} geometry={geometry} material={material} />;
}

function Blob({ progress }: { progress: RefObject<number> }) {
  const group = useRef<THREE.Group>(null);
  const material = useRef<DistortMaterial>(null);

  useFrame((state, dt) => {
    if (!group.current) return;
    const { x, y } = state.pointer; // normalised -1..1, already smoothed by r3f
    const d = Math.min(dt, 0.1); // clamp so a backgrounded tab doesn't snap the blob on return
    const p = progress.current;

    // Tilt toward the cursor rather than track it — a full follow reads as a toy.
    group.current.rotation.y = damp(group.current.rotation.y, x * 0.55, 2.5, d);
    group.current.rotation.x = damp(group.current.rotation.x, -y * 0.4, 2.5, d);
    // Base offset keeps the blob clear of the right edge, so the silhouette reads whole.
    group.current.position.x = damp(group.current.position.x, -0.35 + x * 0.28, 2, d);
    group.current.position.y = damp(
      group.current.position.y,
      y * 0.2 + Math.sin(state.clock.elapsedTime * 0.5) * 0.08,
      2,
      d
    );
    // Recedes with the particles so the whole scene leaves together.
    const s = 1 - p * 0.25;
    group.current.scale.setScalar(s);

    if (material.current) {
      const reach = Math.min(1, Math.hypot(x, y));
      material.current.distort = damp(material.current.distort, 0.42 + reach * 0.3, 2, d);
      material.current.opacity = 1 - p;
      material.current.transparent = p > 0.001;
    }
  });

  return (
    <group ref={group}>
      <Sphere args={[1, 160, 160]} scale={1.42}>
        <MeshDistortMaterial
          ref={material}
          color="#0d0d0c"
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
  // A ref, not state: this updates every scroll frame and re-rendering the R3F tree for it would
  // throw away the whole point of driving the scene from useFrame.
  const progress = useRef(0);

  useGSAP(() => {
    ScrollTrigger.create({
      trigger: "#hero",
      start: "top top",
      end: "bottom top",
      scrub: true,
      onUpdate: (self) => {
        progress.current = self.progress;
      },
    });
  });

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 40 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      // Nothing here needs shadows.
      shadows={false}
      onCreated={() => onReady?.()}
    >
      <Blob progress={progress} />
      <Particles progress={progress} />

      {/* Body shading comes from real lights, not the environment: any discrete lightformer in
          front reflects off the surface as a visible disc or patch. */}
      <ambientLight intensity={0.12} />
      <directionalLight position={[-4, 2.5, 4]} intensity={2.4} color="#eaffc0" />
      <directionalLight position={[4.5, -1, 2]} intensity={0.5} color="#8fa8b8" />

      {/* Lightformers instead of a preset HDR: same studio look, zero network requests. Both panels
          sit behind the blob so they only graze the silhouette as rim light. */}
      <Environment resolution={256}>
        <color attach="background" args={["#050505"]} />
        <Lightformer form="rect" intensity={5} color="#cdff57" position={[-4.5, 1.5, -4]} scale={[7, 9, 1]} />
        <Lightformer form="rect" intensity={2.6} color="#e9e9e4" position={[4.5, 2.5, -3.5]} scale={[5, 8, 1]} />
      </Environment>
    </Canvas>
  );
}
