import { useEffect, useRef } from 'react';

type SparkShape = 'streak' | 'diamond' | 'star' | 'sliver';

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;        // 0 → 1 (birth → death)
  decay: number;       // how fast it fades
  rotation: number;
  rotationSpeed: number;
  color: string;
  shape: SparkShape;
  trail: { x: number; y: number }[];
  trailLength: number;
  wobble: number;
  wobbleSpeed: number;
  wobbleAmt: number;
}

const COLORS = [
  '#FFD98A', '#F2C66D', '#CFA347',
  '#FF4A1C', '#FF5C21', '#E02E0B',
  '#ffffff', '#FFB347',
];

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

function spawnSpark(canvasWidth: number, canvasHeight: number): Spark {
  // Sparks originate from the bottom center area (lava zone)
  const xOrigin = canvasWidth * randomBetween(0.2, 0.8);
  const yOrigin = canvasHeight * randomBetween(0.6, 1.05);

  const angle = randomBetween(-Math.PI * 0.9, -Math.PI * 0.1); // mostly upward
  const speed = randomBetween(0.8, 3.5);
  const shapes: SparkShape[] = ['streak', 'diamond', 'star', 'sliver'];

  return {
    x: xOrigin,
    y: yOrigin,
    vx: Math.cos(angle) * speed + randomBetween(-0.3, 0.3),
    vy: Math.sin(angle) * speed - randomBetween(0.2, 1.0),
    size: randomBetween(1.5, 5),
    life: 0,
    decay: randomBetween(0.004, 0.014),
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: randomBetween(-0.08, 0.08),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: shapes[Math.floor(Math.random() * shapes.length)],
    trail: [],
    trailLength: Math.floor(randomBetween(3, 9)),
    wobble: Math.random() * Math.PI * 2,
    wobbleSpeed: randomBetween(0.03, 0.1),
    wobbleAmt: randomBetween(0.05, 0.4),
  };
}

function drawSpark(ctx: CanvasRenderingContext2D, s: Spark) {
  const alpha = Math.max(0, (1 - s.life) * (s.life < 0.2 ? s.life / 0.2 : 1));
  if (alpha <= 0) return;

  // Draw trail first
  if (s.trail.length > 1) {
    for (let i = 1; i < s.trail.length; i++) {
      const t = i / s.trail.length;
      ctx.save();
      ctx.globalAlpha = alpha * t * 0.4;
      ctx.strokeStyle = s.color;
      ctx.lineWidth = s.size * t * 0.6;
      ctx.shadowBlur = 6;
      ctx.shadowColor = s.color;
      ctx.beginPath();
      ctx.moveTo(s.trail[i - 1].x, s.trail[i - 1].y);
      ctx.lineTo(s.trail[i].x, s.trail[i].y);
      ctx.stroke();
      ctx.restore();
    }
  }

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.fillStyle = s.color;
  ctx.strokeStyle = s.color;
  ctx.shadowBlur = 12;
  ctx.shadowColor = s.color;
  ctx.translate(s.x, s.y);
  ctx.rotate(s.rotation);

  switch (s.shape) {
    case 'streak': {
      // Elongated bright streak
      const len = s.size * randomBetween(2.5, 5);
      ctx.shadowBlur = 8;
      ctx.lineWidth = s.size * 0.5;
      ctx.beginPath();
      ctx.moveTo(-len / 2, 0);
      ctx.lineTo(len / 2, 0);
      ctx.stroke();
      // bright center dot
      ctx.shadowBlur = 15;
      ctx.beginPath();
      ctx.arc(0, 0, s.size * 0.4, 0, Math.PI * 2);
      ctx.fill();
      break;
    }
    case 'diamond': {
      const w = s.size * 1.2;
      const h = s.size * 2.2;
      ctx.beginPath();
      ctx.moveTo(0, -h);
      ctx.lineTo(w, 0);
      ctx.lineTo(0, h);
      ctx.lineTo(-w, 0);
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'star': {
      // 4-point star / cross spark
      const r1 = s.size * 0.35;
      const r2 = s.size * 1.8;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        const r = i % 2 === 0 ? r2 : r1;
        i === 0
          ? ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r)
          : ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      break;
    }
    case 'sliver': {
      // Very thin elongated sliver
      const sl = s.size * randomBetween(3, 7);
      ctx.lineWidth = Math.max(0.5, s.size * 0.3);
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(-sl / 2, 0);
      ctx.quadraticCurveTo(0, s.size * 0.5, sl / 2, 0);
      ctx.stroke();
      break;
    }
  }

  ctx.restore();
}

export function EmberCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const sparks: Spark[] = [];
    const MAX_SPARKS = 70;

    // Pre-populate with sparks at various life stages
    for (let i = 0; i < MAX_SPARKS; i++) {
      const s = spawnSpark(canvas.width, canvas.height);
      s.life = Math.random(); // spread them across their lifetime
      sparks.push(s);
    }

    let frameId: number;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Spawn new sparks to replace dead ones
      while (sparks.length < MAX_SPARKS) {
        sparks.push(spawnSpark(canvas.width, canvas.height));
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];

        // Record trail
        s.trail.push({ x: s.x, y: s.y });
        if (s.trail.length > s.trailLength) s.trail.shift();

        // Physics: gravity + wobble drift
        s.vy += 0.012; // gravity
        s.wobble += s.wobbleSpeed;
        s.vx += Math.sin(s.wobble) * s.wobbleAmt * 0.05;

        // Damping
        s.vx *= 0.995;
        s.vy *= 0.995;

        s.x += s.vx;
        s.y += s.vy;
        s.rotation += s.rotationSpeed;
        s.life += s.decay;

        if (s.life >= 1) {
          sparks.splice(i, 1);
        } else {
          drawSpark(ctx, s);
        }
      }

      frameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ mixBlendMode: 'screen' }}
    />
  );
}
