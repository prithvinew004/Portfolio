import { draw, effect, frame, geometry, init, surface, target, type Target } from "vgpu";
import fxaaShader from "./footer-aa-fxaa.wgsl";
import resolveShader from "./footer-aa-resolve.wgsl";
import sceneShader from "./footer-aa-scene.wgsl";

export type AaMode = "off" | "msaa" | "ssaa" | "fxaa";

export async function createFooterAaRenderer(canvas: HTMLCanvasElement, signal: AbortSignal, onFailure: () => void) {
  signal.throwIfAborted();
  const gpu = await init({ powerPreference: "low-power" });

  function fail() {
    if (gpu.disposed) return;
    gpu.dispose();
    if (!signal.aborted) onFailure();
  }

  try {
    signal.throwIfAborted();
    gpu.onError(fail);
    void gpu.lost.then(fail);
    const output = surface(gpu, canvas, { dpr: [1, 2] });
    const vertices = createSpokeVertices();
    const mesh = geometry(gpu, {
      buffers: [{
        data: vertices.buffer as ArrayBuffer,
        stride: 12,
        attributes: { local_position: "float32x2", accent: "float32" },
      }],
    });
    const scene = draw(gpu, { shader: sceneShader, geometry: mesh });
    const resolve = effect(gpu, resolveShader);
    const fxaa = effect(gpu, fxaaShader);
    const targets = new Map<AaMode, Target>();

    return {
      render(mode: AaMode, time: number) {
        try {
          return frame(gpu, (currentFrame) => {
            const [width, height] = output.size;
            scene.set({ uniforms: { time, logical_resolution: [width, height] } });
            if (mode === "off") {
              currentFrame.pass({ target: output }, (pass) => pass.draw(scene));
              return;
            }

            const factor = mode === "ssaa" ? 2 : 1;
            const size = [width * factor, height * factor] as const;
            let source = targets.get(mode);
            if (!source) {
              source = target(gpu, { size, msaa: mode === "msaa", label: `footer-aa-${mode}` });
              targets.set(mode, source);
            } else if (source.size[0] !== size[0] || source.size[1] !== size[1]) {
              source.resize(size);
            }

            const filter = mode === "fxaa"
              ? fxaa.set({ scene_tex: source })
              : resolve.set({ uniforms: { kind: mode === "ssaa" ? 1 : 0 }, scene_tex: source });
            currentFrame.pass({ target: source }, (pass) => pass.draw(scene));
            currentFrame.pass({ target: output }, (pass) => pass.draw(filter));
          }).done;
        } catch {
          fail();
        }
      },
      dispose() {
        gpu.dispose();
      },
    };
  } catch (error) {
    gpu.dispose();
    throw error;
  }
}

export type FooterAaRenderer = Awaited<ReturnType<typeof createFooterAaRenderer>>;

// Spoke mesh from vgpu's MIT-licensed Anti-Aliasing example.
function createSpokeVertices(): Float32Array {
  const data: number[] = [];
  const spokeCount = 44;

  for (let i = 0; i < spokeCount; i++) {
    const angle = (i / spokeCount) * Math.PI * 2;
    const x = Math.cos(angle);
    const y = Math.sin(angle);
    const nx = -y;
    const ny = x;
    const inner = i % 4 === 0 ? 0.06 : 0.13;
    const outer = i % 5 === 0 ? 0.88 : 0.72 + (i % 3) * 0.055;
    const halfWidth = i % 5 === 0 ? 0.009 : 0.0045;
    const accent = (i % 7) / 6;
    const a = [x * inner + nx * halfWidth, y * inner + ny * halfWidth];
    const b = [x * inner - nx * halfWidth, y * inner - ny * halfWidth];
    const c = [x * outer - nx * halfWidth, y * outer - ny * halfWidth];
    const d = [x * outer + nx * halfWidth, y * outer + ny * halfWidth];
    data.push(...a, accent, ...b, accent, ...c, accent, ...a, accent, ...c, accent, ...d, accent);
  }

  return new Float32Array(data);
}
