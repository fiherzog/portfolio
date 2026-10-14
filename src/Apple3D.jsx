import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const GREEN = '#043c15';

/* Equirect "studio" backdrop painted on a canvas: soft lilac / pink / white
   panels plus green + violet accents, so reflections keep the brand tones. */
function makeEnvTexture(renderer) {
  const c = document.createElement('canvas');
  c.width = 1024;
  c.height = 512;
  const g = c.getContext('2d');

  const base = g.createLinearGradient(0, 0, 0, 512);
  base.addColorStop(0, '#ffffff');
  base.addColorStop(0.45, '#e7b8ff');
  base.addColorStop(0.75, '#8a3dd6');
  base.addColorStop(1, '#0d3b1c');
  g.fillStyle = base;
  g.fillRect(0, 0, 1024, 512);

  const blob = (x, y, r, color) => {
    const rg = g.createRadialGradient(x, y, 0, x, y, r);
    rg.addColorStop(0, color);
    rg.addColorStop(1, 'rgba(0,0,0,0)');
    g.fillStyle = rg;
    g.fillRect(x - r, y - r, r * 2, r * 2);
  };
  blob(220, 150, 190, 'rgba(255,255,255,1)');
  blob(700, 120, 150, 'rgba(255,214,250,0.95)');
  blob(480, 300, 170, 'rgba(160,64,255,0.9)');
  blob(880, 330, 160, 'rgba(18,120,56,0.85)');
  blob(60, 340, 140, 'rgba(18,120,56,0.7)');
  blob(560, 60, 90, 'rgba(255,255,255,1)');

  const tex = new THREE.CanvasTexture(c);
  tex.mapping = THREE.EquirectangularReflectionMapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  const pmrem = new THREE.PMREMGenerator(renderer);
  const env = pmrem.fromEquirectangular(tex).texture;
  tex.dispose();
  pmrem.dispose();
  return env;
}

function buildAppleGeometry() {
  const pts = [];
  const steps = 64;
  for (let i = 0; i <= steps; i++) {
    const th = (i / steps) * Math.PI;
    const r = 0.9 * Math.sin(th) * (1 + 0.09 * Math.cos(th));
    const dimple = 0.42 * Math.exp(-Math.pow(th / 0.36, 2));
    const y = 0.92 * Math.cos(th) - dimple;
    pts.push(new THREE.Vector2(Math.max(r, 0.0001), y));
  }
  const geo = new THREE.LatheGeometry(pts, 96);
  geo.computeVertexNormals();
  return geo;
}

function buildStarShape(size) {
  const s = new THREE.Shape();
  const R = size;
  const k = 0.16 * size;
  s.moveTo(0, R);
  s.quadraticCurveTo(k, k, R, 0);
  s.quadraticCurveTo(k, -k, 0, -R);
  s.quadraticCurveTo(-k, -k, -R, 0);
  s.quadraticCurveTo(-k, k, 0, R);
  return s;
}

function buildLeafShape() {
  const s = new THREE.Shape();
  s.moveTo(0, -0.04);
  s.bezierCurveTo(0.25, -0.3, 0.6, -0.3, 0.8, 0.0);
  s.bezierCurveTo(0.6, 0.3, 0.25, 0.3, 0, 0.04);
  s.closePath();
  return s;
}

export default function Apple3D({ width = 240, height = 280 }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return undefined;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.display = 'block';
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const env = makeEnvTexture(renderer);
    scene.environment = env;

    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 50);
    camera.position.set(0, 0.35, 7.4);
    camera.lookAt(0, 0.3, 0);

    scene.add(new THREE.AmbientLight('#ffe9ff', 0.45));
    const key = new THREE.DirectionalLight('#ffffff', 2.2);
    key.position.set(-2.5, 3, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight('#7cffa6', 1.2);
    rim.position.set(3, -1, -2);
    scene.add(rim);

    /* Body: glossy purple with iridescent sheen + clearcoat */
    const bodyMat = new THREE.MeshPhysicalMaterial({
      color: '#8f2bff',
      metalness: 0.3,
      roughness: 0.22,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
      iridescence: 0.55,
      iridescenceIOR: 1.35,
      iridescenceThicknessRange: [120, 420],
      envMapIntensity: 0.8,
    });
    const body = new THREE.Mesh(buildAppleGeometry(), bodyMat);

    const greenMat = new THREE.MeshPhysicalMaterial({
      color: '#0a6a2a',
      metalness: 0.2,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      iridescence: 0.3,
      envMapIntensity: 1.2,
    });
    const darkGreenMat = new THREE.MeshPhysicalMaterial({
      color: GREEN,
      metalness: 0.3,
      roughness: 0.28,
      clearcoat: 1,
      envMapIntensity: 1.3,
    });
    const starMat = new THREE.MeshPhysicalMaterial({
      color: '#ffd9fb',
      metalness: 0.35,
      roughness: 0.16,
      clearcoat: 1,
      iridescence: 0.8,
      iridescenceIOR: 1.5,
      envMapIntensity: 1.0,
    });

    /* Sparkle embossed on the front */
    const starGeo = new THREE.ExtrudeGeometry(buildStarShape(0.45), {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.035,
      bevelSegments: 5,
      curveSegments: 24,
    });
    /* Bend the flat star onto the body's surface so it never floats off at steep angles */
    const SURFACE_R = 0.985 * 0.9;
    const STAR_Y = -0.12;
    const sp = starGeo.attributes.position;
    for (let i = 0; i < sp.count; i++) {
      const x = sp.getX(i);
      const y = sp.getY(i) + STAR_Y;
      const z0 = sp.getZ(i);
      const surface = Math.sqrt(Math.max(SURFACE_R * SURFACE_R - x * x - y * y, 0.05));
      sp.setXYZ(i, x, y, surface + ((z0 + 0.04) / 0.24) * 0.1 - 0.02);
    }
    starGeo.computeVertexNormals();
    const star = new THREE.Mesh(starGeo, starMat);

    /* Stem + leaf: one group so they share an axis. The stem is a lathe with a flared
       foot that sits in the dimple, hiding the seam where it meets the body. */
    const stemProfile = [
      [0.0, -0.1],
      [0.2, -0.06],
      [0.15, 0.0],
      [0.1, 0.06],
      [0.07, 0.14],
      [0.052, 0.26],
      [0.042, 0.5],
      [0.0, 0.51],
    ].map(([r, y]) => new THREE.Vector2(r, y));
    const stem = new THREE.Mesh(new THREE.LatheGeometry(stemProfile, 32), darkGreenMat);

    const leafGeo = new THREE.ExtrudeGeometry(buildLeafShape(), {
      depth: 0.05,
      bevelEnabled: true,
      bevelThickness: 0.025,
      bevelSize: 0.02,
      bevelSegments: 4,
      curveSegments: 24,
    });
    leafGeo.translate(0, 0, -0.025); // centre the leaf on the stem's axis
    const leaf = new THREE.Mesh(leafGeo, greenMat);
    leaf.position.set(0, 0.49, 0); // base of the leaf is the stem's tip
    leaf.rotation.z = 0.5;

    const stemGroup = new THREE.Group();
    stemGroup.add(stem, leaf);
    stemGroup.position.set(0, 0.6, 0);
    stemGroup.rotation.z = -0.1;

    const group = new THREE.Group();
    group.add(body, star, stemGroup);
    group.rotation.z = 0.32;
    group.scale.setScalar(1.0);
    scene.add(group);

    /* Cursor tracking (window-wide so it reacts anywhere on the page) */
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    const onMove = (e) => {
      target.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (!reduceMotion) window.addEventListener('pointermove', onMove);

    let raf = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const t = (now - t0) / 1000;
      current.x += (target.x - current.x) * 0.07;
      current.y += (target.y - current.y) * 0.07;

      group.rotation.y = current.x * 0.9;
      group.rotation.x = current.y * 0.55;
      group.position.y = reduceMotion ? 0 : Math.sin(t * 1.4) * 0.05 - 0.1;

      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      [body, star, stem, leaf].forEach((m) => m.geometry.dispose());
      [bodyMat, greenMat, darkGreenMat, starMat].forEach((m) => m.dispose());
      env.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, [width, height]);

  return (
    <div
      ref={mountRef}
      className="apple3d"
      style={{ width, height }}
      role="img"
      aria-label="3D purple apple that follows your cursor"
    />
  );
}
