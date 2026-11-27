// Adapted from vgpu's MIT-licensed Liquid Layout refracting bezel.
struct Glass {
  viewport: vec2f,
  texel: vec2f,
  light: vec2f,
}

@group(0) @binding(0) var field: texture_2d<f32>;
@group(0) @binding(1) var fieldSampler: sampler;
@group(0) @binding(2) var<uniform> glass: Glass;

fn fieldAt(uv: vec2f) -> vec2f {
  return textureSampleLevel(field, fieldSampler, uv, 0.0).rg;
}

fn backdrop(point: vec2f) -> vec3f {
  let origin = vec2f(glass.viewport.x * 0.22, -80.0);
  let studio = exp(-length(point - origin) / max(210.0, glass.viewport.x * 0.55));
  let shine = exp(-length(point - glass.light) / 150.0);
  let edge = abs(fract(point / 24.0 + 0.5) - 0.5) * 24.0;
  let grid = (1.0 - smoothstep(0.0, 0.8, min(edge.x, edge.y))) * (0.006 + 0.014 * shine);
  return vec3f(0.054, 0.059, 0.072) +
    vec3f(0.031, 0.040, 0.060) * studio +
    vec3f(0.019, 0.024, 0.043) * shine + grid;
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let hit = fieldAt(uv);
  let distance = hit.x;
  let alpha = 1.0 - smoothstep(-0.85, 0.85, distance);
  if (alpha <= 0.0) { return vec4f(0.0); }

  let p = uv * glass.viewport;
  let depth = max(-distance, 0.0);
  let body = vec3f(0.008, 0.010, 0.016);
  if (depth > 12.0) { return vec4f((backdrop(p) + body) * alpha, alpha); }

  let dx = vec2f(glass.texel.x, 0.0);
  let dy = vec2f(0.0, glass.texel.y);
  let grad = vec2f(fieldAt(uv + dx).x - fieldAt(uv - dx).x, fieldAt(uv + dy).x - fieldAt(uv - dy).x);
  let strength = smoothstep(0.0, 1.25, length(grad));
  let normal = grad / max(length(grad), 0.001);
  let bevel = clamp(1.0 - depth / 12.0, 0.0, 1.0);
  let bend = -normal * (6.0 + 3.0 * hit.y) * bevel * bevel * strength;
  let floor = vec3f(backdrop(p + bend * 0.94).r, backdrop(p + bend).g, backdrop(p + bend * 1.06).b);
  let toLight = glass.light - p;
  let facing = max(dot(normal, toLight / max(length(toLight), 1.0)), 0.0);
  let specular = pow(facing, 4.0) * exp(-length(toLight) / 220.0);
  let rim = exp(-depth * depth * 0.36) * (0.22 + 0.66 * specular + 0.2 * hit.y);
  let color = floor + body + vec3f(0.25, 0.33, 0.53) * rim * strength;
  return vec4f(color * alpha, alpha);
}
