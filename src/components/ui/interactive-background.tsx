"use client";

import { useEffect, useRef, useCallback } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseAlpha: number;
}

export function InteractiveBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const trailRef = useRef<{ x: number; y: number }[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);

  const initParticles = useCallback((width: number, height: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 1.5 + 0.5,
        baseAlpha: Math.random() * 0.3 + 0.1,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // --- Sizing ---
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (particlesRef.current.length === 0) {
        initParticles(window.innerWidth, window.innerHeight);
      }
    };
    resize();
    window.addEventListener("resize", resize);

    // --- Mouse tracking ---
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMouseMove);

    // --- Smoothed trail position ---
    const smoothPos = { x: mouseRef.current.x, y: mouseRef.current.y };

    // --- Animation loop ---
    const animate = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "screen";

      // ═══════════════════════════════════════
      // 1) Mouse Trail
      // ═══════════════════════════════════════
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // Spring-eased follow
      smoothPos.x += (mx - smoothPos.x) * 0.12;
      smoothPos.y += (my - smoothPos.y) * 0.12;

      const trail = trailRef.current;
      trail.unshift({ x: smoothPos.x, y: smoothPos.y });
      if (trail.length > 20) trail.pop();

      if (trail.length > 2 && mx > 0 && my > 0) {
        ctx.beginPath();
        ctx.moveTo(trail[0].x, trail[0].y);

        for (let i = 1; i < trail.length - 1; i++) {
          const cpx = (trail[i].x + trail[i + 1].x) / 2;
          const cpy = (trail[i].y + trail[i + 1].y) / 2;
          ctx.quadraticCurveTo(trail[i].x, trail[i].y, cpx, cpy);
        }

        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1.5;
        ctx.lineCap = "round";
        ctx.stroke();

        // Taper fade: draw fading segments
        for (let i = 0; i < trail.length - 1; i++) {
          const alpha = 0.05 * (1 - i / trail.length);
          ctx.beginPath();
          ctx.moveTo(trail[i].x, trail[i].y);
          ctx.lineTo(trail[i + 1].x, trail[i + 1].y);
          ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          ctx.lineWidth = 1.5 * (1 - i / trail.length);
          ctx.stroke();
        }
      }

      // ═══════════════════════════════════════
      // 2) Particles
      // ═══════════════════════════════════════
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Drift
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around edges
        if (p.x < 0) p.x = w;
        if (p.x > w) p.x = 0;
        if (p.y < 0) p.y = h;
        if (p.y > h) p.y = 0;

        // Repulsion from mouse
        if (mx > 0 && my > 0) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 200 && dist > 0) {
            const force = (200 - dist) / 200 * 0.15;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Damping to prevent runaway velocity
        p.vx *= 0.98;
        p.vy *= 0.98;

        // Draw particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.baseAlpha})`;
        ctx.fill();
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, [initParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[1] pointer-events-none"
      aria-hidden="true"
    />
  );
}
