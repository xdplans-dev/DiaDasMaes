/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
}

export default function ParticleEngine({ count = 50, theme = 'light' }: { count?: number; theme?: 'light' | 'dark' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    const createParticle = (): Particle => {
      const isPetal = Math.random() > 0.5;
      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: isPetal ? Math.random() * 8 + 5 : Math.random() * 2 + 1,
        speedX: (Math.random() - 0.5) * 1.5,
        speedY: Math.random() * 1 + 0.5,
        opacity: Math.random() * 0.5 + 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
        color: isPetal 
          ? (theme === 'light' ? '#FFD1DC' : '#F7E7CE') 
          : (theme === 'light' ? '#F7E7CE' : '#FFFFFF')
      };
    };

    particles.current = Array.from({ length: count }, createParticle);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.y > canvas.height) {
          p.y = -p.size;
          p.x = Math.random() * canvas.width;
        }
        if (p.x > canvas.width) p.x = 0;
        if (p.x < 0) p.x = canvas.width;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = p.color;

        if (p.size > 3) {
          // Petal shape
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.bezierCurveTo(p.size, -p.size, p.size * 2, p.size, 0, p.size);
          ctx.bezierCurveTo(-p.size * 2, p.size, -p.size, -p.size, 0, 0);
          ctx.fill();
        } else {
          // Sparkle shape
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fill();
          // Glow effect
          ctx.shadowBlur = 10;
          ctx.shadowColor = p.color;
        }

        ctx.restore();
      });

      requestAnimationFrame(animate);
    };

    const animationId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', setCanvasSize);
      cancelAnimationFrame(animationId);
    };
  }, [count, theme]);

  return (
    <canvas
      id="magic-particles"
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
