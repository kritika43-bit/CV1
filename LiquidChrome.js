// LiquidChrome.js
// Requires ogl (https://github.com/oframe/ogl)
// Usage: LiquidChrome.init(domElement, { baseColor, speed, amplitude, interactive })
import { Renderer, Camera, Transform, Program, Mesh, Plane, Vec2, Vec3 } from 'https://cdn.skypack.dev/ogl@0.0.32';

export const LiquidChrome = {
  init: function(container, opts = {}) {
    const baseColor = opts.baseColor || [0.1, 0.1, 0.1];
    const speed = opts.speed || 1;
    const amplitude = opts.amplitude || 0.6;
    const interactive = opts.interactive !== false;

    // Set up renderer
    const renderer = new Renderer({ dpr: 2, alpha: true });
    const gl = renderer.gl;
    container.appendChild(gl.canvas);
    gl.canvas.style.position = 'absolute';
    gl.canvas.style.top = 0;
    gl.canvas.style.left = 0;
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';
    gl.canvas.style.zIndex = 0;
    gl.clearColor(0, 0, 0, 0);

    // Camera
    const camera = new Camera(gl, { fov: 45 });
    camera.position.set(0, 0, 2.5);

    // Scene
    const scene = new Transform();

    // Plane geometry
    const geometry = new Plane(gl, { width: 2, height: 2 });

    // Shader
    const program = new Program(gl, {
      vertex: `
        attribute vec2 uv;
        attribute vec3 position;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        varying vec2 vUv;
        uniform float uTime;
        uniform float uAmplitude;
        uniform vec3 uBaseColor;
        void main() {
          float wave = sin((vUv.x + uTime * 0.2) * 8.0) * cos((vUv.y + uTime * 0.3) * 8.0);
          float chrome = 0.5 + 0.5 * sin(uTime + vUv.x * 10.0 + vUv.y * 10.0);
          float mask = smoothstep(0.0, 1.0, 0.5 + 0.5 * wave * uAmplitude);
          vec3 color = mix(uBaseColor, vec3(0.9, 0.9, 1.0), chrome * mask);
          gl_FragColor = vec4(color, 0.85);
        }
      `,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uBaseColor: { value: baseColor },
      },
      transparent: true,
    });

    const mesh = new Mesh(gl, { geometry, program });
    mesh.setParent(scene);

    // Animation
    let t = 0;
    function animate() {
      t += 0.016 * speed;
      program.uniforms.uTime.value = t;
      renderer.render({ scene, camera });
      requestAnimationFrame(animate);
    }
    animate();

    // Handle resize
    function resize() {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h, false);
    }
    window.addEventListener('resize', resize);
    resize();

    // Optional: interactive mouse effect
    if (interactive) {
      container.addEventListener('mousemove', (e) => {
        const x = e.offsetX / container.offsetWidth;
        const y = e.offsetY / container.offsetHeight;
        program.uniforms.uAmplitude.value = amplitude + 0.2 * (x - 0.5) + 0.2 * (y - 0.5);
      });
      container.addEventListener('mouseleave', () => {
        program.uniforms.uAmplitude.value = amplitude;
      });
    }
  }
};