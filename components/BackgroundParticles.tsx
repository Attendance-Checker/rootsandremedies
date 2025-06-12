
'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const BackgroundParticles: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    const currentMount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      currentMount.clientWidth / currentMount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 50; // Position camera further back to see more spread

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    currentMount.appendChild(renderer.domElement);

    // Particles
    const particleCount = 400; // Reduced count for sparser feel
    const particlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 3);

    const spread = 300; // Increased spread for sparser distribution

    for (let i = 0; i < particleCount * 3; i += 3) {
      // Position
      positions[i] = (Math.random() - 0.5) * spread;
      positions[i + 1] = (Math.random() - 0.5) * spread;
      positions[i + 2] = (Math.random() - 0.5) * spread;

      // Velocity (very slow)
      velocities[i] = (Math.random() - 0.5) * 0.01;
      velocities[i + 1] = (Math.random() - 0.5) * 0.01;
      velocities[i + 2] = (Math.random() - 0.5) * 0.01;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particlesGeometry.setAttribute('velocity', new THREE.BufferAttribute(velocities, 3));

    const particleMaterial = new THREE.PointsMaterial({
      color: 0x90ee90, // Light Green (matches theme's primary color)
      size: 0.6,       // Small particles
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(particleSystem);

    // Animation loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const posAttribute = particleSystem.geometry.attributes.position as THREE.BufferAttribute;
      const velAttribute = particleSystem.geometry.attributes.velocity as THREE.BufferAttribute;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        posAttribute.array[i3] += velAttribute.array[i3];
        posAttribute.array[i3 + 1] += velAttribute.array[i3 + 1];
        posAttribute.array[i3 + 2] += velAttribute.array[i3 + 2];

        // Boundary check - simple wrap-around for a continuous field effect
        const boundary = spread / 1.8; // Adjusted boundary for smoother wrapping
        if (Math.abs(posAttribute.array[i3]) > boundary) posAttribute.array[i3] = -Math.sign(posAttribute.array[i3]) * boundary;
        if (Math.abs(posAttribute.array[i3+1]) > boundary) posAttribute.array[i3+1] = -Math.sign(posAttribute.array[i3+1]) * boundary;
        if (Math.abs(posAttribute.array[i3+2]) > boundary) posAttribute.array[i3+2] = -Math.sign(posAttribute.array[i3+2]) * boundary;
      }
      posAttribute.needsUpdate = true;
      
      particleSystem.rotation.x += 0.0001;
      particleSystem.rotation.y += 0.0002;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      if (currentMount) {
        camera.aspect = currentMount.clientWidth / currentMount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(currentMount.clientWidth, currentMount.clientHeight);
      }
    };
    window.addEventListener('resize', handleResize);
    // Initial call to set size correctly
    handleResize();


    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (currentMount && renderer.domElement) {
         // Check if domElement is still a child before removing
        if (currentMount.contains(renderer.domElement)) {
            currentMount.removeChild(renderer.domElement);
        }
      }
      // Dispose of Three.js objects
      scene.remove(particleSystem);
      particlesGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, overflow: 'hidden' }} />;
};

export default BackgroundParticles;
