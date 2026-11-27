struct Particle {
  offset: vec2f,
  center: vec2f,
}

struct Simulation {
  pointer: vec2f,
  time: f32,
  delta: f32,
  aspect: f32,
  pointerEnabled: f32,
}

@group(0) @binding(0) var<storage, read_write> particles: array<Particle>;
@group(0) @binding(1) var<uniform> simulation: Simulation;

fn random(seed: u32) -> f32 {
  var value = seed * 747796405u + 2891336453u;
  value = ((value >> ((value >> 28u) + 4u)) ^ value) * 277803737u;
  return f32((value >> 22u) ^ value) / 4294967296.0;
}

@compute @workgroup_size(64)
fn cs_main(@builtin(global_invocation_id) id: vec3u) {
  let index = id.x;
  if (index >= arrayLength(&particles)) { return; }

  let seed = index * 11u;
  let radius = pow(random(seed), 1.17);
  let jitter = random(seed + 1u) + random(seed + 2u) + random(seed + 3u) - 1.5;
  let angle = f32(index % 4u) * 1.570796 + radius * 6.65 +
    jitter * (0.24 + radius * 0.61) + simulation.time * (0.02 + (1.0 - radius) * 0.018);
  let orbit = vec2f(cos(angle), sin(angle) * 0.39) * radius;
  let tilt = vec2f(dot(orbit, vec2f(0.875, 0.484)), dot(orbit, vec2f(-0.484, 0.875)));
  let scatter = vec2f(random(seed + 4u), random(seed + 5u));
  let intro = 1.0 - smoothstep(0.0, 2.6, simulation.time);
  var home = vec2f(0.60, 0.47) + tilt * vec2f(0.49, 0.63) +
    (scatter - 0.5) * (0.035 + intro * 0.19);
  if (index % 9u == 0u) { home = scatter; }

  let scale = vec2f(simulation.aspect, 1.0);
  let direction = (home - simulation.pointer) * scale;
  let distance = length(direction);
  let force = (1.0 - smoothstep(0.0, 0.19, distance)) * 0.085 * simulation.pointerEnabled;
  let targetOffset = direction / max(distance, 0.001) / scale * force;
  let offset = mix(particles[index].offset, targetOffset, 1.0 - exp(-simulation.delta * 6.0));
  particles[index] = Particle(offset, (home + offset) * vec2f(2.0, -2.0) + vec2f(-1.0, 1.0));
}
