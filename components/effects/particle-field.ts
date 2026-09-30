import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  DynamicDrawUsage,
  LineSegments,
  NormalBlending,
  OrthographicCamera,
  Points,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from "three";
import type { Domain } from "@/content/types";

/**
 * Hero particle network (Three.js, framework-free).
 *
 * Screen-space orthographic scene: particles drift, connect to near neighbours
 * with faint links, lean away from the cursor, parallax with scroll, and can be
 * tinted toward one domain accent. Designed to stay cheap: capped count, capped
 * DPR, a single draw call per layer, adaptive quality, and no work when hidden.
 */

export type FieldPalette = Record<Domain, string>;
export type FieldTheme = "dark" | "light";

export interface FieldOptions {
  density: "low" | "full";
  /** Cursor + scroll response. */
  interactive: boolean;
  /** false → render a single static frame (reduced motion). */
  animate: boolean;
  palette: FieldPalette;
  theme: FieldTheme;
}

export interface ParticleField {
  start(): void;
  stop(): void;
  resize(width: number, height: number): void;
  setPointer(x: number, y: number, active: boolean): void;
  setScroll(offset: number): void;
  setDomain(domain: Domain | null): void;
  setAppearance(theme: FieldTheme, palette: FieldPalette): void;
  dispose(): void;
}

const DOMAINS: Domain[] = ["ai", "research", "automation", "data", "seo"];
// Leans toward the three core disciplines without hiding the other two.
const DOMAIN_WEIGHTS = [0.3, 0.25, 0.2, 0.15, 0.1];

const MARGIN = 24;
const PARALLAX = 0.35;

const POINT_VERTEX = /* glsl */ `
  attribute vec3 aColor;
  attribute float aSize;
  uniform float uPixelRatio;
  varying vec3 vColor;
  void main() {
    vColor = aColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPixelRatio;
  }
`;

const POINT_FRAGMENT = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    gl_FragColor = vec4(vColor, smoothstep(0.5, 0.12, d) * uOpacity);
  }
`;

const LINE_VERTEX = /* glsl */ `
  attribute vec3 aColor;
  attribute float aAlpha;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    vColor = aColor;
    vAlpha = aAlpha;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const LINE_FRAGMENT = /* glsl */ `
  uniform float uOpacity;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    gl_FragColor = vec4(vColor, vAlpha * uOpacity);
  }
`;

/** Parses "#rgb" / "#rrggbb" into sRGB floats (written straight to the canvas). */
function parseHex(value: string): [number, number, number] {
  let hex = value.trim().replace("#", "");
  if (hex.length === 3) hex = hex.replace(/./g, (c) => c + c);
  const n = Number.parseInt(hex.slice(0, 6), 16);
  if (Number.isNaN(n)) return [0.6, 0.6, 0.6];
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

function pickWeighted(): number {
  let r = Math.random();
  for (let i = 0; i < DOMAIN_WEIGHTS.length; i++) {
    r -= DOMAIN_WEIGHTS[i]!;
    if (r <= 0) return i;
  }
  return 0;
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function createParticleField(canvas: HTMLCanvasElement, options: FieldOptions): ParticleField {
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: "low-power",
  });
  const pixelRatio = Math.min(window.devicePixelRatio || 1, options.density === "low" ? 1.25 : 1.75);
  renderer.setPixelRatio(pixelRatio);
  renderer.setClearColor(0x000000, 0);

  let width = Math.max(1, canvas.clientWidth);
  let height = Math.max(1, canvas.clientHeight);
  renderer.setSize(width, height, false);

  const scene = new Scene();
  // y grows downward, matching DOM coordinates.
  const camera = new OrthographicCamera(0, width, 0, height, -1, 1);

  // ── Particles ────────────────────────────────────────────────────────────
  const count = clamp(
    Math.round((width * height) / (options.density === "low" ? 15000 : 9500)),
    24,
    options.density === "low" ? 56 : 160,
  );
  let activeCount = count;

  const px = new Float32Array(count);
  const py = new Float32Array(count);
  const vx = new Float32Array(count);
  const vy = new Float32Array(count);
  const bvx = new Float32Array(count);
  const bvy = new Float32Array(count);
  const depth = new Float32Array(count);
  const shade = new Float32Array(count);
  const home = new Uint8Array(count);

  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const targets = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    px[i] = Math.random() * width;
    py[i] = Math.random() * height;
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.06 + Math.random() * 0.16;
    bvx[i] = vx[i] = Math.cos(angle) * speed;
    bvy[i] = vy[i] = Math.sin(angle) * speed;
    depth[i] = 0.35 + Math.random() * 0.65;
    shade[i] = 0.78 + Math.random() * 0.22;
    home[i] = pickWeighted();
    sizes[i] = (1.4 + depth[i]! * 2.4) * (options.density === "low" ? 1.1 : 1);
  }

  const pointGeometry = new BufferGeometry();
  const positionAttr = new BufferAttribute(positions, 3).setUsage(DynamicDrawUsage);
  const colorAttr = new BufferAttribute(colors, 3).setUsage(DynamicDrawUsage);
  pointGeometry.setAttribute("position", positionAttr);
  pointGeometry.setAttribute("aColor", colorAttr);
  pointGeometry.setAttribute("aSize", new BufferAttribute(sizes, 1));

  const pointMaterial = new ShaderMaterial({
    vertexShader: POINT_VERTEX,
    fragmentShader: POINT_FRAGMENT,
    uniforms: { uPixelRatio: { value: pixelRatio }, uOpacity: { value: 0.9 } },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const points = new Points(pointGeometry, pointMaterial);
  points.frustumCulled = false;

  // ── Links ────────────────────────────────────────────────────────────────
  const maxSegments = count * 6;
  const linePositions = new Float32Array(maxSegments * 6);
  const lineColors = new Float32Array(maxSegments * 6);
  const lineAlphas = new Float32Array(maxSegments * 2);
  const lineGeometry = new BufferGeometry();
  const linePosAttr = new BufferAttribute(linePositions, 3).setUsage(DynamicDrawUsage);
  const lineColorAttr = new BufferAttribute(lineColors, 3).setUsage(DynamicDrawUsage);
  const lineAlphaAttr = new BufferAttribute(lineAlphas, 1).setUsage(DynamicDrawUsage);
  lineGeometry.setAttribute("position", linePosAttr);
  lineGeometry.setAttribute("aColor", lineColorAttr);
  lineGeometry.setAttribute("aAlpha", lineAlphaAttr);

  const lineMaterial = new ShaderMaterial({
    vertexShader: LINE_VERTEX,
    fragmentShader: LINE_FRAGMENT,
    uniforms: { uOpacity: { value: 0.5 } },
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const lines = new LineSegments(lineGeometry, lineMaterial);
  lines.frustumCulled = false;

  scene.add(lines, points);

  // ── State ────────────────────────────────────────────────────────────────
  let palette = DOMAINS.map((d) => parseHex(options.palette[d]));
  let domain: Domain | null = null;
  let excite = 0;
  let scroll = 0;
  const pointer = { x: -9999, y: -9999, active: false, influence: 0 };
  const pointerRadius = options.density === "low" ? 120 : 170;
  let linkDistance = clamp(Math.min(width, height) * 0.16, 90, 150);

  let raf = 0;
  let running = false;
  let last = 0;
  let frameTimeTotal = 0;
  let frameSamples = 0;
  let degradeSteps = 0;

  function computeTargets() {
    const tint = domain ? DOMAINS.indexOf(domain) : -1;
    for (let i = 0; i < count; i++) {
      const rgb = palette[tint >= 0 ? tint : home[i]!]!;
      const s = shade[i]!;
      targets[i * 3] = rgb[0] * s;
      targets[i * 3 + 1] = rgb[1] * s;
      targets[i * 3 + 2] = rgb[2] * s;
    }
  }

  function applyTheme(theme: FieldTheme) {
    const dark = theme === "dark";
    pointMaterial.blending = dark ? AdditiveBlending : NormalBlending;
    lineMaterial.blending = dark ? AdditiveBlending : NormalBlending;
    pointMaterial.uniforms.uOpacity!.value = dark ? 0.9 : 0.75;
    lineMaterial.uniforms.uOpacity!.value = dark ? 0.55 : 0.45;
    pointMaterial.needsUpdate = true;
    lineMaterial.needsUpdate = true;
  }

  computeTargets();
  colors.set(targets);
  applyTheme(options.theme);

  function wrapY(y: number) {
    const span = height + MARGIN * 2;
    return ((((y + MARGIN) % span) + span) % span) - MARGIN;
  }

  function step(dt: number) {
    const t60 = dt * 60;
    const interactive = options.interactive;
    pointer.influence += ((pointer.active && interactive ? 1 : 0) - pointer.influence) * Math.min(1, 0.12 * t60);
    excite += ((domain ? 1 : 0) - excite) * Math.min(1, 0.05 * t60);
    const colorK = t60 === 0 ? 1 : 1 - Math.pow(0.92, t60);
    const speedBoost = 1 + excite * 0.6;
    const r2 = pointerRadius * pointerRadius;
    const spanX = width + MARGIN * 2;

    for (let i = 0; i < activeCount; i++) {
      const i3 = i * 3;
      const ry = interactive ? wrapY(py[i]! - scroll * depth[i]! * PARALLAX) : py[i]!;
      const rx = px[i]!;

      if (pointer.influence > 0.01) {
        const dx = rx - pointer.x;
        const dy = ry - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < r2 && d2 > 1) {
          const d = Math.sqrt(d2);
          const force = (1 - d / pointerRadius) * 0.05 * pointer.influence * t60;
          vx[i] = vx[i]! + (dx / d) * force;
          vy[i] = vy[i]! + (dy / d) * force;
        }
      }

      // Relax toward the particle's own drift.
      vx[i] = vx[i]! + (bvx[i]! * speedBoost - vx[i]!) * Math.min(1, 0.02 * t60);
      vy[i] = vy[i]! + (bvy[i]! * speedBoost - vy[i]!) * Math.min(1, 0.02 * t60);
      px[i] = px[i]! + vx[i]! * t60;
      py[i] = py[i]! + vy[i]! * t60;

      if (px[i]! < -MARGIN) px[i] = px[i]! + spanX;
      else if (px[i]! > width + MARGIN) px[i] = px[i]! - spanX;
      if (py[i]! < -MARGIN) py[i] = py[i]! + height + MARGIN * 2;
      else if (py[i]! > height + MARGIN) py[i] = py[i]! - height - MARGIN * 2;

      positions[i3] = rx;
      positions[i3 + 1] = ry;
      colors[i3] = colors[i3]! + (targets[i3]! - colors[i3]!) * colorK;
      colors[i3 + 1] = colors[i3 + 1]! + (targets[i3 + 1]! - colors[i3 + 1]!) * colorK;
      colors[i3 + 2] = colors[i3 + 2]! + (targets[i3 + 2]! - colors[i3 + 2]!) * colorK;
    }

    positionAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
    pointGeometry.setDrawRange(0, activeCount);
    buildLinks();
  }

  function pushSegment(seg: number, ax: number, ay: number, bx: number, by: number, ia: number, ib: number, alpha: number) {
    const o = seg * 6;
    linePositions[o] = ax;
    linePositions[o + 1] = ay;
    linePositions[o + 2] = 0;
    linePositions[o + 3] = bx;
    linePositions[o + 4] = by;
    linePositions[o + 5] = 0;
    lineColors[o] = colors[ia * 3]!;
    lineColors[o + 1] = colors[ia * 3 + 1]!;
    lineColors[o + 2] = colors[ia * 3 + 2]!;
    lineColors[o + 3] = colors[ib * 3]!;
    lineColors[o + 4] = colors[ib * 3 + 1]!;
    lineColors[o + 5] = colors[ib * 3 + 2]!;
    lineAlphas[seg * 2] = alpha;
    lineAlphas[seg * 2 + 1] = alpha;
  }

  function buildLinks() {
    const reach = linkDistance * (1 + excite * 0.15);
    const reach2 = reach * reach;
    let seg = 0;

    outer: for (let i = 0; i < activeCount; i++) {
      const ax = positions[i * 3]!;
      const ay = positions[i * 3 + 1]!;
      for (let j = i + 1; j < activeCount; j++) {
        const dx = positions[j * 3]! - ax;
        if (dx > reach || dx < -reach) continue;
        const dy = positions[j * 3 + 1]! - ay;
        const d2 = dx * dx + dy * dy;
        if (d2 >= reach2) continue;
        const falloff = 1 - Math.sqrt(d2) / reach;
        pushSegment(seg, ax, ay, ax + dx, ay + dy, i, j, falloff * falloff * 0.7);
        if (++seg >= maxSegments) break outer;
      }
    }

    if (pointer.influence > 0.01) {
      const reachPointer = pointerRadius * 0.9;
      for (let i = 0; i < activeCount && seg < maxSegments; i++) {
        const ax = positions[i * 3]!;
        const ay = positions[i * 3 + 1]!;
        const dx = pointer.x - ax;
        const dy = pointer.y - ay;
        const d = Math.sqrt(dx * dx + dy * dy);
        if (d >= reachPointer) continue;
        pushSegment(seg, ax, ay, pointer.x, pointer.y, i, i, (1 - d / reachPointer) * 0.75 * pointer.influence);
        seg++;
      }
    }

    lineGeometry.setDrawRange(0, seg * 2);
    linePosAttr.needsUpdate = true;
    lineColorAttr.needsUpdate = true;
    lineAlphaAttr.needsUpdate = true;
  }

  function render() {
    renderer.render(scene, camera);
  }

  function renderStatic() {
    step(0);
    render();
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const elapsed = now - last;
    last = now;
    const dt = Math.min(0.05, elapsed / 1000 || 1 / 60);
    step(dt);
    render();

    // Adaptive quality: if the device can't hold ~40fps, thin the field (max twice).
    if (degradeSteps < 2 && elapsed < 250) {
      frameTimeTotal += elapsed;
      frameSamples++;
      if (frameSamples >= 90) {
        if (frameTimeTotal / frameSamples > 25) {
          activeCount = Math.max(20, Math.round(activeCount * 0.6));
          linkDistance *= 0.9;
          degradeSteps++;
        }
        frameTimeTotal = 0;
        frameSamples = 0;
      }
    }
  }

  if (!options.animate) renderStatic();

  return {
    start() {
      if (running || !options.animate) return;
      running = true;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    },
    stop() {
      running = false;
      cancelAnimationFrame(raf);
    },
    resize(nextWidth, nextHeight) {
      const w = Math.max(1, Math.round(nextWidth));
      const h = Math.max(1, Math.round(nextHeight));
      if (w === width && h === height) return;
      const sx = w / width;
      const sy = h / height;
      for (let i = 0; i < count; i++) {
        px[i] = px[i]! * sx;
        py[i] = py[i]! * sy;
      }
      width = w;
      height = h;
      linkDistance = clamp(Math.min(width, height) * 0.16, 90, 150);
      camera.right = width;
      camera.bottom = height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
      if (!running) renderStatic();
    },
    setPointer(x, y, active) {
      pointer.x = x;
      pointer.y = y;
      pointer.active = active;
    },
    setScroll(offset) {
      scroll = offset;
    },
    setDomain(next) {
      domain = next;
      computeTargets();
      if (!running) {
        colors.set(targets);
        renderStatic();
      }
    },
    setAppearance(theme, nextPalette) {
      palette = DOMAINS.map((d) => parseHex(nextPalette[d]));
      applyTheme(theme);
      computeTargets();
      colors.set(targets);
      if (!running) renderStatic();
    },
    dispose() {
      running = false;
      cancelAnimationFrame(raf);
      pointGeometry.dispose();
      lineGeometry.dispose();
      pointMaterial.dispose();
      lineMaterial.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
