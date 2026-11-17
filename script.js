function drawGround() {
  const w = canvas.width;
  const h = canvas.height;
  const ground = ctx.createLinearGradient(0, 0, 0, h);
  ground.addColorStop(0, "#0d1f1a");
  ground.addColorStop(1, "#153825");
  ctx.fillStyle = ground;
  ctx.fillRect(0, 0, w, h);

  for (let i = 0; i < 120; i++) {
    const x = (i * 61 + (game.elapsed * 14)) % (w + 30);
    const y = h - 10 - (i % 7) * 6;
    const blade = 10 + (i % 5) * 3;
    ctx.strokeStyle = i % 3 === 0 ? "rgba(173, 245, 162, 0.7)" : "rgba(99, 181, 118, 0.8)";
    ctx.lineWidth = 1.4 + (i % 3) * 0.2;
    ctx.beginPath();
    ctx.moveTo(x, h);
    ctx.lineTo(x, y);
    ctx.moveTo(x, y + 1);
    ctx.lineTo(x - 4, y + blade * 0.65);
    ctx.moveTo(x, y + 1);
    ctx.lineTo(x + 4, y + blade * 0.7);
    ctx.stroke();
  }

  ctx.fillStyle = "rgba(13, 31, 23, 0.16)";
  for (let x = 0; x <= w; x += 40) {
    ctx.fillRect(x + 1, h - 18, 18, 18);
  }
}

function draw() {
  const w = canvas.width, h = canvas.height;
  drawGround();
  ctx.strokeStyle = "rgba(146,224,163,.055)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += 40) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y <= h; y += 40) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  ctx.fillStyle = "rgba(146,224,163,.045)";
  for (let i = 0; i < 24; i++) {
    const x = (i * 131 + 37) % w, y = (i * 79 + 19) % h;
    ctx.beginPath(); ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2); ctx.fill();
  }

  game.pickups.forEach((pickup) => {
    ctx.save(); ctx.translate(pickup.x, pickup.y); ctx.rotate(Math.PI / 4);
    ctx.fillStyle = "#f0c56a"; ctx.shadowColor = "#f0c56a"; ctx.shadowBlur = 14; ctx.fillRect(-6, -6, 12, 12); ctx.restore();
  });
  game.shots.forEach((shot) => { ctx.fillStyle = "#f8e6a1"; ctx.shadowColor = "#f0c56a"; ctx.shadowBlur = 12; ctx.beginPath(); ctx.arc(shot.x, shot.y, 4, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; });
  game.enemies.forEach((enemy) => {
    ctx.save(); ctx.translate(enemy.x, enemy.y); ctx.rotate(Math.atan2(game.player.y - enemy.y, game.player.x - enemy.x));
    ctx.fillStyle = enemy.heavy ? "#b36d50" : "#6e9978"; ctx.strokeStyle = enemy.heavy ? "#f0a06f" : "#a9d8a5"; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#f0c56a"; ctx.fillRect(2, -3, enemy.radius - 3, 6);
    if (enemy.hp > 1) { ctx.fillStyle = "rgba(0,0,0,.6)"; ctx.fillRect(-enemy.radius, -enemy.radius - 8, enemy.radius * 2, 3); ctx.fillStyle = "#f0c56a"; ctx.fillRect(-enemy.radius, -enemy.radius - 8, enemy.radius * 2 * enemy.hp / 3, 3); }
    ctx.restore();
  });
  game.particles.forEach((particle) => { ctx.globalAlpha = Math.max(0, particle.life / particle.maxLife); ctx.fillStyle = particle.color; ctx.beginPath(); ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2); ctx.fill(); });
  ctx.globalAlpha = 1;
  const p = game.player;
  ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.angle);
  ctx.strokeStyle = "rgba(146,224,163,.25)"; ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(0,0); ctx.lineTo(32,0); ctx.stroke();
  ctx.fillStyle = "#c2efb9"; ctx.shadowColor = "#66d786"; ctx.shadowBlur = 18; ctx.beginPath(); ctx.arc(0,0,p.radius,0,Math.PI*2); ctx.fill();
  ctx.shadowBlur = 0; ctx.fillStyle = "#213c2d"; ctx.beginPath(); ctx.arc(0,0,5,0,Math.PI*2); ctx.fill();
  ctx.fillStyle = "#f0c56a"; ctx.fillRect(6,-3,14,6); ctx.restore();
  if (game.paused) { ctx.fillStyle = "rgba(4,10,7,.36)"; ctx.fillRect(0,0,w,h); }
}

ctx.fillStyle = "#0b1711";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "rgba(146,224,163,.07)";
for (let x = 0; x < canvas.width; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
for (let y = 0; y < canvas.height; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }
updateHud();
