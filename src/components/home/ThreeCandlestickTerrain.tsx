import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface CandleData {
  body: THREE.Mesh;
  wick: THREE.Mesh;
  target: number;
  current: number;
  open: number;
  close: number;
}

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

const ThreeCandlestickTerrain: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Renderer
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 140);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.55);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0xdbeafe, 1.25);
    dirLight1.position.set(6, 12, 9);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0x10b981, 0.8);
    dirLight2.position.set(-9, 3, -6);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(0x3b82f6, 55, 40);
    pointLight.position.set(-4, 6, 8);
    scene.add(pointLight);

    // Root groups
    const rootGroup = new THREE.Group();
    const terrainGroup = new THREE.Group();
    rootGroup.add(terrainGroup);
    scene.add(rootGroup);

    // Grid Floor
    const spacing = 0.72;
    const countX = 34;
    const totalWidth = countX * spacing;
    const gridPositions: number[] = [];

    for (let i = 0; i <= countX; i += 2) {
      const x = -totalWidth / 2 + i * spacing;
      gridPositions.push(x, 0, -3.4, x, 0, 3.4);
    }
    for (let z = -3; z <= 3; z++) {
      gridPositions.push(-totalWidth / 2, 0, z * 1.1, totalWidth / 2, 0, z * 1.1);
    }

    const gridGeometry = new THREE.BufferGeometry();
    gridGeometry.setAttribute('position', new THREE.Float32BufferAttribute(gridPositions, 3));
    const gridMaterial = new THREE.LineBasicMaterial({
      color: 0x1e3a5f,
      transparent: true,
      opacity: 0.55,
    });
    const gridLines = new THREE.LineSegments(gridGeometry, gridMaterial);
    gridLines.position.y = -0.02;
    terrainGroup.add(gridLines);

    // Candlestick Materials
    const greenMaterial = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      roughness: 0.32,
      metalness: 0.2,
      emissive: 0x064e3b,
      emissiveIntensity: 0.9,
    });

    const redMaterial = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      roughness: 0.32,
      metalness: 0.2,
      emissive: 0x7f1d1d,
      emissiveIntensity: 0.85,
    });

    const wickMaterial = new THREE.MeshStandardMaterial({
      color: 0x94a3b8,
      roughness: 0.5,
      transparent: true,
      opacity: 0.5,
    });

    const bodyGeometry = new THREE.BoxGeometry(0.4, 1, 0.4);
    bodyGeometry.translate(0, 0.5, 0);

    const wickGeometry = new THREE.CylinderGeometry(0.035, 0.035, 1, 6);
    wickGeometry.translate(0, 0.5, 0);

    // 3 Rows of Candlesticks
    const rows: CandleData[][] = [];
    let startClose = 3.1;

    for (let r = 0; r < 3; r++) {
      const rowCandles: CandleData[] = [];
      const zPos = (r - 1) * 2.1;
      const opacity = r === 1 ? 1.0 : 0.45;

      for (let c = 0; c < countX; c++) {
        const prevClose = startClose;
        startClose = clamp(startClose + (Math.random() - 0.5) * 0.85 + 0.045, 0.85, 6.4);
        const currClose = startClose;

        const isGreen = currClose >= prevClose;
        const mat = (isGreen ? greenMaterial : redMaterial).clone();
        mat.transparent = true;
        mat.opacity = opacity;

        const body = new THREE.Mesh(bodyGeometry, mat);
        const xPos = -totalWidth / 2 + c * spacing;
        const lower = Math.min(prevClose, currClose);
        const heightDiff = Math.max(0.12, Math.abs(currClose - prevClose));

        body.position.set(xPos, lower, zPos);
        body.scale.y = heightDiff;

        const wickMat = wickMaterial.clone();
        wickMat.opacity = 0.5 * opacity;
        const wick = new THREE.Mesh(wickGeometry, wickMat);
        wick.position.set(xPos, lower - 0.25, zPos);
        wick.scale.y = heightDiff + 0.75;

        terrainGroup.add(body);
        terrainGroup.add(wick);

        rowCandles.push({
          body,
          wick,
          target: currClose,
          current: currClose,
          open: prevClose,
          close: currClose,
        });
      }
      rows.push(rowCandles);
    }

    // Glowing Trendline on Middle Row
    const middleRow = rows[1];
    const linePositions = new Float32Array(countX * 3);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x60a5fa,
      transparent: true,
      opacity: 0.92,
      linewidth: 2,
    });
    const trendLine = new THREE.Line(lineGeometry, lineMaterial);
    terrainGroup.add(trendLine);

    // Glowing Lead Sphere
    const sphereGeometry = new THREE.SphereGeometry(0.14, 16, 16);
    const sphereMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
    });
    const leadSphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    terrainGroup.add(leadSphere);

    // Floating Particle Cloud
    const particleCount = 240;
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * totalWidth * 1.15;
      particlePositions[i * 3 + 1] = Math.random() * 9;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0x7dd3fc,
      size: 0.055,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const particleCloud = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleCloud);

    // Resize Handler
    let isMobile = false;
    const handleResize = () => {
      const width = canvas.clientWidth || window.innerWidth;
      const height = canvas.clientHeight || window.innerHeight;

      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      isMobile = width < 1024;

      camera.position.set(isMobile ? 0 : 2.4, isMobile ? 6.2 : 6.6, isMobile ? 15 : 14.5);
      rootGroup.position.set(isMobile ? 0 : 1.2, isMobile ? -5 : -6.35, 0);
      rootGroup.scale.setScalar(isMobile ? 0.82 : 1.12);
      camera.updateProjectionMatrix();
      particleCloud.visible = !isMobile;
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    // Pointer Interaction
    const mouse = { x: 0, y: 0 };
    const targetMouse = { x: 0, y: 0 };
    let dragRotSpeed = 0;
    let isDragging = false;
    let lastPointerX = 0;

    const parentSection = canvas.closest('section') || document.body;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = parentSection.getBoundingClientRect();
      targetMouse.x = (e.clientX - rect.left) / rect.width - 0.5;
      targetMouse.y = (e.clientY - rect.top) / rect.height - 0.5;

      if (isDragging) {
        dragRotSpeed += (e.clientX - lastPointerX) * 0.00035;
        lastPointerX = e.clientX;
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastPointerX = e.clientX;
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    parentSection.addEventListener('pointermove', handlePointerMove as EventListener);
    parentSection.addEventListener('pointerdown', handlePointerDown as EventListener);
    window.addEventListener('pointerup', handlePointerUp);

    // Periodic Candlestick Data Updates
    let tickInterval: number | null = null;
    if (!prefersReducedMotion) {
      tickInterval = window.setInterval(() => {
        for (const row of rows) {
          for (let i = 0; i < row.length - 1; i++) {
            row[i].target = row[i + 1].target;
            row[i].open = row[i + 1].open;
            row[i].close = row[i + 1].close;
          }
          const last = row[row.length - 1];
          const secondLast = row[row.length - 2];
          last.open = secondLast.close;
          last.close = clamp(secondLast.close + (Math.random() - 0.48) * 0.95, 0.85, 6.4);
          last.target = last.close;
        }
      }, 1100);
    }

    // Candle mesh update helper
    const updateCandleMesh = (candle: CandleData, rowOpacity: number) => {
      const isGreen = candle.close >= candle.open;
      const mat = candle.body.material as THREE.MeshStandardMaterial;
      mat.color.setHex(isGreen ? 0x10b981 : 0xef4444);
      mat.emissive.setHex(isGreen ? 0x064e3b : 0x7f1d1d);
      mat.opacity = rowOpacity;

      const lower = Math.min(candle.open, candle.close);
      const heightDiff = Math.max(0.12, Math.abs(candle.close - candle.open));

      candle.body.position.y += (lower - candle.body.position.y) * 0.12;
      candle.body.scale.y += (heightDiff - candle.body.scale.y) * 0.12;
      candle.wick.position.y += (lower - 0.28 - candle.wick.position.y) * 0.12;
      candle.wick.scale.y += (heightDiff + 0.8 - candle.wick.scale.y) * 0.12;
    };

    // Animation Loop
    const clock = new THREE.Clock();
    let sphereProgress = 0;
    let animationFrameId = 0;

    const animate = () => {
      const delta = Math.min(clock.getDelta(), 0.05);
      const elapsedTime = clock.elapsedTime;

      mouse.x += (targetMouse.x - mouse.x) * 0.05;
      mouse.y += (targetMouse.y - mouse.y) * 0.05;

      // Update rows
      for (let r = 0; r < 3; r++) {
        const rowOpacity = r === 1 ? 1.0 : 0.42;
        for (const candle of rows[r]) {
          updateCandleMesh(candle, rowOpacity);
        }
      }

      // Update Line Positions
      const positions = lineGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < countX; i++) {
        const candle = middleRow[i];
        positions[i * 3] = candle.body.position.x;
        positions[i * 3 + 1] = candle.body.position.y + candle.body.scale.y + 0.16;
        positions[i * 3 + 2] = candle.body.position.z;
      }
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.computeBoundingSphere();

      // Lead Sphere movement
      if (!prefersReducedMotion) {
        sphereProgress = (sphereProgress + delta * 0.14) % 1;
      }
      const activeIndex = Math.floor(sphereProgress * (countX - 1));
      leadSphere.position.set(
        positions[activeIndex * 3],
        positions[activeIndex * 3 + 1],
        positions[activeIndex * 3 + 2]
      );
      const sphereScale = 1 + Math.sin(elapsedTime * 5) * 0.22;
      leadSphere.scale.setScalar(sphereScale);

      // Rotations & Parallax
      if (!prefersReducedMotion) {
        dragRotSpeed *= 0.94;
        terrainGroup.rotation.y += dragRotSpeed + delta * 0.035;
        particleCloud.rotation.y += delta * 0.01;
      }

      rootGroup.rotation.x = -0.06 + mouse.y * 0.09;
      rootGroup.rotation.z = mouse.x * 0.03;
      camera.position.y += ((isMobile ? 6.2 : 6.6) - mouse.y * 1.6 - camera.position.y) * 0.05;
      camera.lookAt(rootGroup.position.x, rootGroup.position.y + 9.2, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      if (tickInterval) clearInterval(tickInterval);
      window.removeEventListener('resize', handleResize);
      parentSection.removeEventListener('pointermove', handlePointerMove as EventListener);
      parentSection.removeEventListener('pointerdown', handlePointerDown as EventListener);
      window.removeEventListener('pointerup', handlePointerUp);

      renderer.dispose();
      gridGeometry.dispose();
      gridMaterial.dispose();
      bodyGeometry.dispose();
      wickGeometry.dispose();
      greenMaterial.dispose();
      redMaterial.dispose();
      wickMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      sphereGeometry.dispose();
      sphereMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      <canvas ref={canvasRef} id="terrain" className="w-full h-full block" />
    </div>
  );
};

export default ThreeCandlestickTerrain;
