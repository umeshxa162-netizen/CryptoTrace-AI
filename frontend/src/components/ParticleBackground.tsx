import React, { useEffect, useRef } from 'react';
import { ThemeMode } from '../types';

interface ParticleBackgroundProps {
  theme: ThemeMode;
}

export const ParticleBackground: React.FC<ParticleBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const dpr = window.devicePixelRatio || 1;
    let displayWidth = window.innerWidth;
    let displayHeight = window.innerHeight;

    let width = (canvas.width = displayWidth * dpr);
    let height = (canvas.height = displayHeight * dpr);
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      if (!canvas) return;
      displayWidth = window.innerWidth;
      displayHeight = window.innerHeight;
      width = canvas.width = displayWidth * dpr;
      height = canvas.height = displayHeight * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    const mouse = {
      x: displayWidth / 2,
      y: displayHeight / 2,
      targetX: displayWidth / 2,
      targetY: displayHeight / 2,
      radius: 190,
      active: false,
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    // Particles setup
    const particleCount = Math.min(Math.floor((displayWidth * displayHeight) / 16000), 75);
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      alpha: number;
      baseAlpha: number;
      isHubNode: boolean;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      const baseAlpha = Math.random() * 0.35 + 0.12;
      particles.push({
        x: Math.random() * displayWidth,
        y: Math.random() * displayHeight,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        size: Math.random() * 2 + 1,
        alpha: baseAlpha,
        baseAlpha,
        isHubNode: Math.random() > 0.82,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      // Smooth mouse interpolation
      mouse.x += (mouse.targetX - mouse.x) * 0.08;
      mouse.y += (mouse.targetY - mouse.y) * 0.08;

      const isDark = theme === 'dark';
      const particleColor = isDark ? '6, 182, 212' : '14, 116, 144'; // cyan
      const hubColor = isDark ? '99, 102, 241' : '79, 70, 229'; // indigo
      const lineColor = isDark ? '30, 41, 59' : '203, 213, 225';

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges smoothly
        if (p.x < 0) p.x = displayWidth;
        if (p.x > displayWidth) p.x = 0;
        if (p.y < 0) p.y = displayHeight;
        if (p.y > displayHeight) p.y = 0;

        // Interactive mouse deflection
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius && dist > 0) {
            const force = (mouse.radius - dist) / mouse.radius;
            p.x -= (dx / dist) * force * 0.8;
            p.y -= (dy / dist) * force * 0.8;
            p.alpha = Math.min(p.baseAlpha + force * 0.6, 0.95);
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.05;
          }
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.isHubNode ? p.size * 1.5 : p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.isHubNode
          ? `rgba(${hubColor}, ${p.alpha * 1.2})`
          : `rgba(${particleColor}, ${p.alpha})`;
        ctx.fill();

        // Extra halo for hub nodes
        if (p.isHubNode && isDark) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * 3.5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(6, 182, 212, ${p.alpha * 0.18})`;
          ctx.fill();
        }

        // Connect nearby particles (Blockchain network lattice)
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist2 = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist2 < 135) {
            const lineAlpha = (1 - dist2 / 135) * 0.22 * (isDark ? 1 : 0.7);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.isHubNode || p2.isHubNode
              ? `rgba(6, 182, 212, ${lineAlpha * 1.4})`
              : `rgba(${lineColor}, ${lineAlpha})`;
            ctx.lineWidth = p.isHubNode || p2.isHubNode ? 1 : 0.6;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-80"
      style={{ width: '100%', height: '100%' }}
    />
  );
};
