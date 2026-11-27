import { compute, draw, frame, init, storage, surface } from "vgpu";
import simulationShader from "./simulation.wgsl";
import drawShader from "./stars.wgsl";

type Point = [number, number];

type RendererOptions = {
  mobile: boolean;
  signal: AbortSignal;
  onFirstFrame: () => void;
  onFailure: () => void;
};

export type ParticleRenderer = {
  start: () => void;
  stop: () => void;
  dispose: () => void;
  setPointer: (point: Point | null) => void;
};

export async function createParticleRenderer(
  canvas: HTMLCanvasElement,
  { mobile, signal, onFirstFrame, onFailure }: RendererOptions
): Promise<ParticleRenderer> {
  signal.throwIfAborted();
  const gpu = await init({
    powerPreference: "low-power",
    requiredLimits: { maxStorageBuffersInVertexStage: 1 },
  });

  let running = false;
  let animation = 0;
  let pointer: Point | null = null;
  let previous = 0;
  let time = 0;
  let first = true;
  const count = mobile ? 576 : 1344;
  const interval = 1000 / (mobile ? 24 : 30);

  function stop() {
    running = false;
    cancelAnimationFrame(animation);
    pointer = null;
  }

  function dispose() {
    stop();
    gpu.dispose();
  }

  function fail() {
    if (gpu.disposed) return;
    dispose();
    if (!signal.aborted) onFailure();
  }

  try {
    signal.throwIfAborted();
    gpu.onError(fail);
    void gpu.lost.then(fail);

    const output = surface(gpu, canvas, {
      dpr: mobile ? [0.85, 1] : [1, 1.5],
      alphaMode: "premultiplied",
      clearColor: [0, 0, 0, 0],
    });
    // Two vec2f values per star: persistent displacement and the projected position.
    const particles = storage(gpu, count * 16, "read-write");
    const simulate = compute(gpu, simulationShader, { set: { particles } });
    const stars = draw(gpu, {
      shader: drawShader,
      vertices: 6,
      instances: count,
      blend: "premultiplied",
      set: { particles },
    });

    await Promise.all([simulate.compile(), stars.compile(output)]);
    signal.throwIfAborted();
    if (gpu.disposed) throw new Error("Particle device unavailable");

    function tick(now: number) {
      if (!running) return;
      const elapsed = now - previous;
      if (elapsed >= interval - 1) {
        const delta = Math.min(elapsed / 1000, 0.06);
        previous = now;
        time += delta;

        try {
          const submitted = frame(gpu, (currentFrame) => {
            const [width, height] = output.size;
            simulate.set({
              simulation: {
                time,
                delta,
                aspect: Math.max(1, width) / Math.max(1, height),
                pointer: pointer ?? [0, 0],
                pointerEnabled: pointer ? 1 : 0,
              },
            });
            stars.set({ view: { size: [width, height], dpr: output.dpr } });
            currentFrame.computePass((pass) => pass.dispatch(simulate, count / 64));
            currentFrame.pass(output, stars);
          });

          if (first) {
            first = false;
            void submitted.done.then(() => {
              if (!gpu.disposed && !signal.aborted) onFirstFrame();
            });
          }
        } catch {
          fail();
          return;
        }
      }
      animation = requestAnimationFrame(tick);
    }

    return {
      start() {
        if (running || gpu.disposed) return;
        running = true;
        previous = performance.now() - interval;
        animation = requestAnimationFrame(tick);
      },
      stop,
      dispose,
      setPointer(point) {
        pointer = mobile ? null : point;
      },
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
