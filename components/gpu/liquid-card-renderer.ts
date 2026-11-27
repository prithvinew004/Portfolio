import { effect, frame, init, sampler, surface, target, type Gpu } from "vgpu";
import fieldShader from "./liquid-field.wgsl";
import glassShader from "./liquid-glass.wgsl";

const MAX_CARDS = 8;
const CLEAR = [0, 0, 0, 0] as const;
type Point = [number, number];

export type LiquidCardGroup = {
  host: HTMLElement;
  canvas: HTMLCanvasElement;
  cards: HTMLElement[];
  hovered: HTMLElement | null;
  pointer: Point | null;
  visible: boolean;
};

function createScene(gpu: Gpu, group: LiquidCardGroup) {
  const output = surface(gpu, group.canvas, { dpr: [0.75, 1], alphaMode: "premultiplied" });
  const distance = target(gpu, { size: output.size, format: "rgba16float" });
  const field = effect(gpu, fieldShader, { label: "portfolio-liquid-field" });
  const glass = effect(gpu, glassShader, {
    label: "portfolio-liquid-glass",
    set: { field: distance, fieldSampler: sampler(gpu, { minFilter: "linear", magFilter: "linear" }) },
  });
  const values = Array.from({ length: MAX_CARDS * 2 }, () => new Float32Array(4));
  const energy = new Float32Array(MAX_CARDS);
  let light: Point | undefined;
  let ready = false;
  let presented = false;
  const compiled = Promise.all([field.compile(distance), glass.compile(output)]).then(() => {
    ready = true;
  });

  function draw(onPresented: () => void) {
    if (!ready) return false;
    const rect = group.canvas.getBoundingClientRect();
    const viewport: Point = [rect.width, rect.height];
    if (rect.width < 1 || rect.height < 1) return false;
    const resting: Point = [rect.width * 0.28, -36];
    const pointer = group.pointer;
    const focus = !pointer && group.hovered?.getBoundingClientRect();
    const destination: Point = pointer
      ? [pointer[0] - rect.left, pointer[1] - rect.top]
      : focus
        ? [focus.left - rect.left + focus.width * 0.5, focus.top - rect.top]
        : resting;
    light ??= [...resting];
    let settling = Math.hypot(destination[0] - light[0], destination[1] - light[1]) > 0.5;
    light[0] += (destination[0] - light[0]) * 0.28;
    light[1] += (destination[1] - light[1]) * 0.28;
    const spot = light;

    group.cards.forEach((card, index) => {
      const box = card.getBoundingClientRect();
      const goal = card === group.hovered ? 1 : 0;
      energy[index] += (goal - energy[index]) * 0.28;
      if (Math.abs(goal - energy[index]) > 0.015) settling = true;
      values[index * 2].set([
        box.left - rect.left + box.width / 2,
        box.top - rect.top + box.height / 2,
        box.width / 2,
        box.height / 2,
      ]);
      values[index * 2 + 1].set([12, energy[index]]);
    });

    const submitted = frame(gpu, (currentFrame) => {
      const size = output.size;
      if (distance.size[0] !== size[0] || distance.size[1] !== size[1]) distance.resize(size);
      field.set({ field: { viewport, light: spot, count: group.cards.length, cards: values } });
      glass.set({ glass: { viewport, texel: distance.texelSize, light: spot } });
      currentFrame.pass({ target: distance, clear: CLEAR }, (pass) => pass.draw(field));
      currentFrame.pass({ target: output, clear: CLEAR }, (pass) => pass.draw(glass));
    });

    if (!presented) {
      presented = true;
      void submitted.done.then(onPresented);
    }
    return settling;
  }

  return { compiled, draw };
}

export async function createLiquidCardRenderer(signal: AbortSignal, onFailure: () => void) {
  signal.throwIfAborted();
  const gpu = await init({ powerPreference: "low-power" });
  if (signal.aborted) {
    gpu.dispose();
    signal.throwIfAborted();
  }
  const scenes = new Map<HTMLCanvasElement, ReturnType<typeof createScene>>();

  function dispose() {
    scenes.clear();
    gpu.dispose();
  }
  function fail() {
    if (gpu.disposed) return;
    dispose();
    if (!signal.aborted) onFailure();
  }
  gpu.onError(fail);
  void gpu.lost.then(fail);

  return {
    render(group: LiquidCardGroup, schedule: () => void) {
      if (gpu.disposed || group.cards.length > MAX_CARDS) return false;
      try {
        let scene = scenes.get(group.canvas);
        if (!scene) {
          scene = createScene(gpu, group);
          scenes.set(group.canvas, scene);
          void scene.compiled.then(schedule, fail);
          return false;
        }
        return scene.draw(() => {
          if (!gpu.disposed && !signal.aborted) group.host.dataset.liquidStatus = "active";
        });
      } catch {
        fail();
        return false;
      }
    },
    dispose,
  };
}

export type LiquidCardRenderer = Awaited<ReturnType<typeof createLiquidCardRenderer>>;
