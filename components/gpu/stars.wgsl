struct Particle {
  offset: vec2f,
  center: vec2f,
}

struct View {
  size: vec2f,
  dpr: f32,
}

struct Star {
  @builtin(position) position: vec4f,
  @location(0) corner: vec2f,
  @location(1) tone: f32,
  @location(2) opacity: f32,
}

@group(0) @binding(0) var<storage, read> particles: array<Particle>;
@group(0) @binding(1) var<uniform> view: View;

@vertex
fn vs_main(@builtin(vertex_index) vertex: u32, @builtin(instance_index) index: u32) -> Star {
  let corners = array<vec2f, 6>(
    vec2f(-1, -1), vec2f(1, -1), vec2f(-1, 1),
    vec2f(-1, 1), vec2f(1, -1), vec2f(1, 1),
  );
  let corner = corners[vertex];
  let tone = fract(f32(index) * 0.6180339887);
  let radius = mix(0.55, 2.0, pow(tone, 4.0)) * view.dpr;
  let opacity = select(0.30 + tone * 0.58, 0.25, index % 9u == 0u);
  let center = particles[index].center;
  return Star(vec4f(center + corner * radius * 2.0 / view.size, 0.0, 1.0), corner, tone, opacity);
}

@fragment
fn fs_main(star: Star) -> @location(0) vec4f {
  let alpha = (1.0 - smoothstep(0.12, 1.0, length(star.corner))) * star.opacity;
  let color = mix(vec3f(0.73, 0.78, 0.88), vec3f(0.91, 0.93, 0.97), star.tone);
  return vec4f(color * alpha, alpha);
}
