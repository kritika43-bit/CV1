// Silk animated background for club page only
// Requires three.js (CDN loaded)
(function() {
  // Load three.js if not already loaded
  function loadScript(src, cb) {
    if (document.querySelector('script[src="' + src + '"]')) { cb(); return; }
    var s = document.createElement('script');
    s.src = src;
    s.onload = cb;
    document.head.appendChild(s);
  }

  loadScript('https://cdn.jsdelivr.net/npm/three@0.152.2/build/three.min.js', function() {
    const container = document.getElementById('silk-bg');
    if (!container) return;
    
    // Set container to cover entire viewport
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100vw';
    container.style.height = '100vh';
    container.style.zIndex = '-1';
    container.style.pointerEvents = 'none';
    container.style.overflow = 'hidden';
    container.style.background = '#3a006a'; // fallback solid color
    
    // Create canvas that fills the container
    const canvas = document.createElement('canvas');
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.display = 'block';
    container.appendChild(canvas);
    
    // Set canvas size to match viewport
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    var renderer = new THREE.WebGLRenderer({ 
        canvas: canvas,
        alpha: true,
        antialias: true 
    });
    
    // Update camera and renderer on resize
    const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();

    var vertexShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      void main() {
        vPosition = position;
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `;
    var fragmentShader = `
      varying vec2 vUv;
      varying vec3 vPosition;
      uniform float uTime;
      uniform vec3  uColor;
      uniform float uSpeed;
      uniform float uScale;
      uniform float uRotation;
      uniform float uNoiseIntensity;
      const float e = 2.71828182845904523536;
      float noise(vec2 texCoord) {
        float G = e;
        vec2  r = (G * sin(G * texCoord));
        return fract(r.x * r.y * (1.0 + texCoord.x));
      }
      vec2 rotateUvs(vec2 uv, float angle) {
        float c = cos(angle);
        float s = sin(angle);
        mat2  rot = mat2(c, -s, s, c);
        return rot * uv;
      }
      void main() {
        float rnd        = noise(gl_FragCoord.xy);
        vec2  uv         = rotateUvs(vUv * uScale, uRotation);
        vec2  tex        = uv * uScale;
        float tOffset    = uSpeed * uTime;
        tex.y += 0.03 * sin(8.0 * tex.x - tOffset);
        float pattern = 0.6 +
                        0.4 * sin(5.0 * (tex.x + tex.y +
                                         cos(3.0 * tex.x + 5.0 * tex.y) +
                                         0.02 * tOffset) +
                                 sin(20.0 * (tex.x + tex.y - 0.1 * tOffset)));
        vec4 col = vec4(uColor, 1.0) * vec4(pattern) - rnd / 15.0 * uNoiseIntensity;
        col.a = 1.0;
        gl_FragColor = col;
      }
    `;
    function hexToNormalizedRGB(hex) {
      hex = hex.replace('#', '');
      return [
        parseInt(hex.slice(0, 2), 16) / 255,
        parseInt(hex.slice(2, 4), 16) / 255,
        parseInt(hex.slice(4, 6), 16) / 255,
      ];
    }
    var uniforms = {
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(...hexToNormalizedRGB('#3a006a')) },
      uSpeed: { value: 5 },
      uScale: { value: 1 },
      uRotation: { value: 0 },
      uNoiseIntensity: { value: 1.5 },
    };
    var geometry = new THREE.PlaneGeometry(2, 2, 1, 1);
    var material = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vertexShader,
      fragmentShader: fragmentShader,
      transparent: true,
      depthWrite: false,
    });
    var mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    function animate() {
      uniforms.uTime.value += 0.03;
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  });
})();