import { useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────
   TMNAA — Cinematic Fire & Spark System
   Three layers:
   1. Rising fire wisps  (soft, large, glowing)
   2. Flying embers      (mid-size, bright shapes)
   3. Micro sparks       (tiny, fast, white-hot)
───────────────────────────────────────────── */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;   // 0..1
  decay: number;
  size: number;
  color: string;
  type: 'wisp' | 'ember' | 'micro';
  angle: number;
  spin: number;
  // for ember trail
  px: number;
  py: number;
}

const FIRE_COLORS   = ['#FF4A1C','#FF5C21','#FF6B1A','#E02E0B','#FF3300'];
const EMBER_COLORS  = ['#FFD98A','#F2C66D','#CFA347','#FFB347','#FFCC44','#ffffff'];
const WISP_COLORS   = ['#FF2200','#CC1100','#FF4A1C','#991100','#FF6622'];

function rand(a: number, b: number) { return a + Math.random() * (b - a); }
function pick<T>(arr: T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

function spawn(W: number, H: number): Particle {
  // Originate from bottom 30% width center-ish
  const xBase = W * rand(0.25, 0.75);
  const yBase = H * rand(0.70, 1.05);
  const roll  = Math.random();

  if (roll < 0.25) {
    // WISP — slow large rising fire cloud
    return {
      x: xBase, y: yBase,
      vx: rand(-0.4, 0.4),
      vy: rand(-1.2, -0.5),
      life: 0, decay: rand(0.004, 0.008),
      size: rand(18, 45),
      color: pick(WISP_COLORS),
      type: 'wisp',
      angle: rand(0, Math.PI * 2),
      spin: rand(-0.02, 0.02),
      px: xBase, py: yBase,
    };
  } else if (roll < 0.65) {
    // EMBER — bright medium spark flying upward
    const spd = rand(2.5, 6.5);
    const ang = rand(-Math.PI * 0.85, -Math.PI * 0.15);
    return {
      x: xBase, y: yBase,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd,
      life: 0, decay: rand(0.008, 0.018),
      size: rand(2.5, 6),
      color: pick(EMBER_COLORS),
      type: 'ember',
      angle: ang,
      spin: rand(-0.15, 0.15),
      px: xBase, py: yBase,
    };
  } else {
    // MICRO — tiny fast white-hot spark
    const spd = rand(4, 10);
    const ang = rand(-Math.PI * 0.92, -Math.PI * 0.08);
    return {
      x: xBase, y: yBase,
      vx: Math.cos(ang) * spd,
      vy: Math.sin(ang) * spd,
      life: 0, decay: rand(0.015, 0.035),
      size: rand(0.8, 2.2),
      color: Math.random() > 0.5 ? '#ffffff' : pick(EMBER_COLORS),
      type: 'micro',
      angle: ang,
      spin: rand(-0.3, 0.3),
      px: xBase, py: yBase,
    };
  }
}

function drawWisp(ctx: CanvasRenderingContext2D, p: Particle) {
  // Soft radial glow that fades in then out
  const ease  = p.life < 0.3 ? p.life / 0.3 : 1 - (p.life - 0.3) / 0.7;
  const alpha = Math.max(0, ease * 0.28);
  const r     = p.size * (0.5 + p.life * 0.5);

  const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
  grad.addColorStop(0,   p.color + 'AA');
  grad.addColorStop(0.4, p.color + '55');
  grad.addColorStop(1,   p.color + '00');

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'screen';
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawEmber(ctx: CanvasRenderingContext2D, p: Particle) {
  const fade  = p.life < 0.15 ? p.life / 0.15 : 1 - (p.life - 0.15) / 0.85;
  const alpha = Math.max(0, fade);
  const spd   = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
  const streak = Math.min(spd * 2.5, 22);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'screen';
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle + p.spin * p.life * 50);

  // Outer glow halo
  ctx.shadowBlur = 18;
  ctx.shadowColor = p.color;

  // Elongated bright body
  const grd = ctx.createLinearGradient(-streak, 0, streak * 0.3, 0);
  grd.addColorStop(0,   p.color + '00');
  grd.addColorStop(0.6, p.color + 'CC');
  grd.addColorStop(1,   '#ffffff');
  ctx.fillStyle = grd;

  ctx.beginPath();
  ctx.ellipse(0, 0, streak, p.size * 0.45, 0, 0, Math.PI * 2);
  ctx.fill();

  // Bright core dot
  ctx.shadowBlur = 25;
  ctx.fillStyle = '#ffffff';
  ctx.globalAlpha = alpha * 0.9;
  ctx.beginPath();
  ctx.arc(streak * 0.2, 0, p.size * 0.35, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

function drawMicro(ctx: CanvasRenderingContext2D, p: Particle) {
  const fade  = p.life < 0.1 ? p.life / 0.1 : 1 - (p.life - 0.1) / 0.9;
  const alpha = Math.max(0, fade);
  const spd   = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
  const tail  = Math.min(spd * 1.8, 14);

  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.globalCompositeOperation = 'screen';
  ctx.translate(p.x, p.y);
  ctx.rotate(p.angle);

  ctx.shadowBlur = 10;
  ctx.shadowColor = p.color;

  // Thin bright line tail
  ctx.strokeStyle = p.color;
  ctx.lineWidth = p.size * 0.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-tail, 0);
  ctx.lineTo(p.size * 0.5, 0);
  ctx.stroke();

  // Bright tip
  ctx.fillStyle = '#ffffff';
  ctx.shadowBlur = 12;
  ctx.beginPath();
  ctx.arc(p.size * 0.5, 0, p.size * 0.5, 0, Math.PI * 2);
  ctx.fill();

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
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const MAX   = 120;
    const pool: Particle[] = [];

    // pre-seed at random life stages
    for (let i = 0; i < MAX; i++) {
      const p = spawn(canvas.width, canvas.height);
      p.life  = Math.random();
      pool.push(p);
    }

    let raf: number;
    const TURB_T = { t: 0 };

    const tick = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      TURB_T.t += 0.012;

      // Replenish
      while (pool.length < MAX) pool.push(spawn(canvas.width, canvas.height));

      for (let i = pool.length - 1; i >= 0; i--) {
        const p = pool[i];
        p.px = p.x;
        p.py = p.y;

        // Turbulence: perlin-ish using sin/cos layering
        const turb = Math.sin(TURB_T.t * 1.3 + p.y * 0.015) * 0.06
                   + Math.cos(TURB_T.t * 0.8 + p.x * 0.012) * 0.04;

        p.vx += turb;
        p.vy += p.type === 'wisp' ? -0.005 : 0.018;   // gravity (less for wisps)
        p.vx *= p.type === 'wisp' ? 0.993 : 0.988;
        p.vy *= p.type === 'wisp' ? 0.993 : 0.988;

        p.x  += p.vx;
        p.y  += p.vy;
        p.angle += p.spin;
        p.life  += p.decay;

        if (p.life >= 1) { pool.splice(i, 1); continue; }

        if (p.type === 'wisp')  drawWisp(ctx, p);
        else if (p.type === 'ember') drawEmber(ctx, p);
        else                         drawMicro(ctx, p);
      }

      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-10"
    />
  );
}
