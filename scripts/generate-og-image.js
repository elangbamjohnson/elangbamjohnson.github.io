const { createCanvas, loadImage } = require('canvas');
const fs = require('fs');

async function generateOGImage() {
  const W = 1200, H = 630;
  const canvas = createCanvas(W, H);
  const ctx = canvas.getContext('2d');

  // ── Background ──────────────────────────────────────────
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, W, H);

  // ── Matrix rain (subtle background) ─────────────────────
  const matrixChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ@#$%&*<>[]{}';
  ctx.font = '13px monospace';
  ctx.fillStyle = 'rgba(0, 255, 70, 0.12)';
  for (let x = 0; x < W; x += 18) {
    for (let y = 0; y < H; y += 18) {
      const char = matrixChars[Math.floor(Math.random() * matrixChars.length)];
      ctx.fillText(char, x, y);
    }
  }

  // ── Green left border accent ─────────────────────────────
  ctx.fillStyle = '#00ff46';
  ctx.fillRect(0, 0, 4, H);

  // ── Profile photo (left side) ───────────────────────────
  const photo = await loadImage('./profile.png');
  const photoSize = 180;
  const photoX = 60, photoY = 80;

  // Circular clip for photo
  ctx.save();
  ctx.beginPath();
  ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(photo, photoX, photoY, photoSize, photoSize);
  ctx.restore();

  // Green ring around photo
  ctx.beginPath();
  ctx.arc(photoX + photoSize / 2, photoY + photoSize / 2, photoSize / 2 + 3, 0, Math.PI * 2);
  ctx.strokeStyle = '#00ff46';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  // ── Name ────────────────────────────────────────────────
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px Arial, sans-serif';
  ctx.fillText('Johnson Elangbam', 60, 310);

  // ── Title ───────────────────────────────────────────────
  ctx.fillStyle = '#00ff46';
  ctx.font = 'bold 22px Arial, sans-serif';
  ctx.fillText('Senior / Staff iOS Engineer', 60, 348);

  // ── Available badge ──────────────────────────────────────
  ctx.fillStyle = 'rgba(0, 255, 70, 0.12)';
  ctx.beginPath();
  ctx.roundRect(60, 370, 200, 32, 16);
  ctx.fill();
  ctx.fillStyle = '#00ff46';
  ctx.font = '13px Arial, sans-serif';
  ctx.fillText('● Available for work', 76, 391);

  // ── Divider ──────────────────────────────────────────────
  ctx.fillStyle = 'rgba(0, 255, 70, 0.2)';
  ctx.fillRect(60, 420, 420, 1);

  // ── Description ──────────────────────────────────────────
  ctx.fillStyle = '#9ca3af';
  ctx.font = '17px Arial, sans-serif';
  ctx.fillText('18+ years · VoIP · AI/ML · CoreML', 60, 448);
  ctx.fillText('Enterprise iOS across automotive,', 60, 474);
  ctx.fillText('retail, and on-device AI.', 60, 500);

  // ── Right side — Stats ───────────────────────────────────
  const stats = [
    { value: '99%',   label: 'Crash-free rate'    },
    { value: '30-70%', label: 'Build time faster' },
    { value: '18+',   label: 'Years iOS'           },
    { value: '10+',   label: 'Enterprise clients'  },
  ];

  const statX = 580;
  stats.forEach((stat, i) => {
    const statY = 120 + i * 120;

    // Stat card background
    ctx.fillStyle = 'rgba(0, 255, 70, 0.06)';
    ctx.beginPath();
    ctx.roundRect(statX, statY, 540, 90, 12);
    ctx.fill();

    ctx.strokeStyle = 'rgba(0, 255, 70, 0.2)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(statX, statY, 540, 90, 12);
    ctx.stroke();

    // Value
    ctx.fillStyle = '#00ff46';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.fillText(stat.value, statX + 24, statY + 44);

    // Label
    ctx.fillStyle = '#9ca3af';
    ctx.font = '16px Arial, sans-serif';
    ctx.fillText(stat.label, statX + 24, statY + 68);
  });

  // ── URL watermark ────────────────────────────────────────
  ctx.fillStyle = 'rgba(0, 255, 70, 0.4)';
  ctx.font = '18px monospace';
  ctx.textAlign = 'right';
  ctx.fillText('elangbamjohnson.github.io', W - 40, H - 24);

  // ── Save ─────────────────────────────────────────────────
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./og-image.png', buffer);
  console.log('✅ og-image.png generated (1200×630) — Matrix theme');
}

generateOGImage().catch(console.error);
