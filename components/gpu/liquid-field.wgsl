// Adapted from vgpu's MIT-licensed Liquid Layout distance field.
struct Field {
  viewport: vec2f,
  light: vec2f,
  count: u32,
  cards: array<vec4f, 16>,
}

@group(0) @binding(0) var<uniform> field: Field;

fn roundRect(point: vec2f, half: vec2f, corner: f32) -> f32 {
  let radius = min(corner, min(half.x, half.y));
  let q = abs(point) - half + radius;
  return length(max(q, vec2f(0.0))) + min(max(q.x, q.y), 0.0) - radius;
}

@fragment fn fs_main(@location(0) uv: vec2f) -> @location(0) vec4f {
  let point = uv * field.viewport;
  let proximity = 1.0 - smoothstep(36.0, 150.0, length(point - field.light));
  var distance = 256.0;
  var energy = 0.0;
  var softness = 4.0;

  for (var i = 0u; i < min(field.count, 8u); i++) {
    let bounds = field.cards[i * 2u];
    let style = field.cards[i * 2u + 1u];
    let nextSoftness = 4.0 + 41.0 * style.y * proximity;
    let d = roundRect(point - bounds.xy, bounds.zw + style.y * proximity, style.x);
    let k = max(softness, nextSoftness);
    let h = clamp(0.5 + 0.5 * (d - distance) / k, 0.0, 1.0);
    distance = mix(d, distance, h) - k * h * (1.0 - h);
    energy = mix(style.y, energy, h);
    softness = mix(nextSoftness, softness, h);
  }

  return vec4f(clamp(distance, -256.0, 256.0), energy, 0.0, 1.0);
}
