// Dark fantasy visual pass for the Canvas prototype. Draws original, procedural
// pseudo-3D silhouettes; no external model assets or franchise artwork are used.
(function installSoulsVisuals() {
  const originalDraw = draw;
  const terrainPalette = {
    Greenreach: { ground: "#18281e", grass: "#536548", stone: "#514d42", edge: "#aaa184" },
    Emberwild: { ground: "#2d211b", grass: "#76503a", stone: "#625044", edge: "#c08c5a" },
    Frostline: { ground: "#202c30", grass: "#607274", stone: "#59666a", edge: "#b0c1ba" }
  };

  function ellipse(x, y, rx, ry, fill, stroke) {
    ctx.beginPath();
    ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    ctx.fillStyle = fill;
    ctx.fill();
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1.5; ctx.stroke(); }
  }

  function drawKnight(x, y, angle, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(angle);
    ctx.scale(scale, scale);
    // Grounding shadow and trailing, tattered cloak.
    ellipse(-2, 8, 21, 10, "rgba(0,0,0,.42)");
    ctx.fillStyle = "#382a28";
    ctx.beginPath();
    ctx.moveTo(-8, -8); ctx.lineTo(-22, -18); ctx.lineTo(-20, 2);
    ctx.lineTo(-14, 17); ctx.lineTo(-3, 10); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = "rgba(190,153,106,.35)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-18, -8); ctx.lineTo(-10, -1); ctx.lineTo(-15, 9); ctx.stroke();
    // Legs and boots.
    ctx.lineCap = "round";
    ctx.strokeStyle = "#282a2b"; ctx.lineWidth = 7;
    ctx.beginPath(); ctx.moveTo(-5, 6); ctx.lineTo(-9, 15); ctx.moveTo(5, 6); ctx.lineTo(9, 15); ctx.stroke();
    ctx.strokeStyle = "#8c826d"; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.moveTo(-9, 15); ctx.lineTo(-14, 17); ctx.moveTo(9, 15); ctx.lineTo(14, 17); ctx.stroke();
    // Torso: layered dark steel with a warm rim highlight.
    ctx.fillStyle = "#454541"; ctx.strokeStyle = "#b09a72"; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(-10, -10); ctx.lineTo(-8, -20); ctx.lineTo(0, -23);
    ctx.lineTo(8, -20); ctx.lineTo(11, -10); ctx.lineTo(7, 7); ctx.lineTo(-7, 7); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#242829"; ctx.fillRect(-2, -20, 4, 25);
    // Arms are empty; explicitly no torch or held prop.
    ctx.strokeStyle = "#3e4140"; ctx.lineWidth = 6;
    ctx.beginPath(); ctx.moveTo(-8, -17); ctx.lineTo(-15, -9); ctx.lineTo(-17, -2);
    ctx.moveTo(8, -17); ctx.lineTo(15, -9); ctx.lineTo(17, -2); ctx.stroke();
    ctx.fillStyle = "#b6a482"; ellipse(-17, -1, 3.2, 3.8, "#b6a482"); ellipse(17, -1, 3.2, 3.8, "#b6a482");
    // Closed helm with narrow amber visor.
    ctx.fillStyle = "#66645a"; ctx.strokeStyle = "#d2b579"; ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(-8, -22); ctx.lineTo(-6, -31); ctx.lineTo(0, -35);
    ctx.lineTo(7, -31); ctx.lineTo(9, -22); ctx.lineTo(5, -17); ctx.lineTo(-5, -17); ctx.closePath(); ctx.fill(); ctx.stroke();
    ctx.fillStyle = "#d9aa58"; ctx.fillRect(-5, -27, 10, 2);
    ctx.strokeStyle = "rgba(238,220,174,.65)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, -34); ctx.lineTo(0, -23); ctx.stroke();
    ctx.restore();
  }

  function drawMachine(enemy, x, y) {
    ctx.save();
    ctx.translate(x, y);
    const scale = enemy.boss ? 1.55 : enemy.heavy ? 1.2 : 1;
    ctx.scale(scale, scale);
    const base = enemy.boss ? "#4d3832" : enemy.heavy ? "#51483c" : "#38443b";
    const trim = enemy.boss ? "#d3a963" : "#aaa17a";
    ellipse(0, 8, enemy.r * .95, enemy.r * .46, "rgba(0,0,0,.45)");
    // Jointed legs and shoulder plates give enemies a more modeled silhouette.
    ctx.strokeStyle = "#252a27"; ctx.lineWidth = enemy.boss ? 7 : 5; ctx.lineCap = "round";
    for (const side of [-1, 1]) {
      ctx.beginPath(); ctx.moveTo(side * 7, 1); ctx.lineTo(side * 17, 12); ctx.lineTo(side * 22, 16); ctx.stroke();
      ctx.fillStyle = trim; ctx.fillRect(side * 22 - 3, 13, 8, 4);
    }
    ctx.fillStyle = base; ctx.strokeStyle = trim; ctx.lineWidth = enemy.boss ? 2.5 : 1.5;
    ctx.beginPath(); ctx.moveTo(-enemy.r * .8, -2); ctx.lineTo(-enemy.r * .55, -enemy.r * .68);
    ctx.lineTo(-3, -enemy.r); ctx.lineTo(enemy.r * .58, -enemy.r * .72);
    ctx.lineTo(enemy.r, -2); ctx.lineTo(enemy.r * .55, 9); ctx.lineTo(-enemy.r * .65, 8); ctx.closePath(); ctx.fill(); ctx.stroke();
    // Segment plates and luminous core.
    ctx.strokeStyle = "rgba(235,216,169,.36)"; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(-enemy.r * .52, -enemy.r * .42); ctx.lineTo(enemy.r * .48, -enemy.r * .42);
    ctx.moveTo(-enemy.r * .62, -enemy.r * .05); ctx.lineTo(enemy.r * .65, -enemy.r * .05); ctx.stroke();
    ellipse(0, -2, enemy.boss ? 8 : 5.5, enemy.boss ? 5 : 3.5, enemy.boss ? "#f3bb63" : "#dfc47b");
    if (enemy.boss || enemy.heavy) {
      ctx.fillStyle = "rgba(8,10,9,.8)"; ctx.fillRect(-enemy.r, -enemy.r - 11, enemy.r * 2, 4);
      ctx.fillStyle = "#d4ad67"; ctx.fillRect(-enemy.r, -enemy.r - 11, enemy.r * 2 * enemy.hp / enemy.max, 4);
    }
    ctx.restore();
  }

  function draw() {
    const cam = game.camera, w = canvas.width, h = canvas.height;
    const sky = ctx.createLinearGradient(0, 0, 0, h);
    sky.addColorStop(0, "#1c2826"); sky.addColorStop(.55, "#26322c"); sky.addColorStop(1, "#111a15");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
    const left = Math.floor(cam.x / 100) * 100, top = Math.floor(cam.y / 100) * 100;
    for (let ty = top; ty < cam.y + h + 100; ty += 100) for (let tx = left; tx < cam.x + w + 100; tx += 100) {
      const palette = terrainPalette[biomeAt(tx).name] || terrainPalette.Greenreach;
      const sx = tx - cam.x, sy = ty - cam.y;
      ctx.fillStyle = palette.ground; ctx.fillRect(sx, sy, 101, 101);
      const grain = seeded(Math.floor(tx / 100) + Math.floor(ty / 100) * 97);
      ctx.fillStyle = palette.grass; ctx.globalAlpha = .1 + grain * .1;
      ctx.beginPath(); ctx.ellipse(sx + 20 + grain * 55, sy + 18 + seeded(grain * 100) * 60, 22 + grain * 18, 7 + grain * 9, grain * 2, 0, Math.PI * 2); ctx.fill(); ctx.globalAlpha = 1;
    }
    // Atmospheric fog bands and faint path markings.
    const fog = ctx.createLinearGradient(0, h * .38, 0, h * .77);
    fog.addColorStop(0, "rgba(193,190,157,0)"); fog.addColorStop(.5, "rgba(193,190,157,.07)"); fog.addColorStop(1, "rgba(193,190,157,0)");
    ctx.fillStyle = fog; ctx.fillRect(0, h * .35, w, h * .45);
    ctx.strokeStyle = "rgba(230,216,180,.035)";
    for (let gx = left; gx < cam.x + w + 100; gx += 100) { ctx.beginPath(); ctx.moveTo(gx - cam.x, 0); ctx.lineTo(gx - cam.x, h); ctx.stroke(); }

    // Draw platforms as broken stone ledges instead of plain cubicles.
    for (const platform of game.platforms) {
      const x = platform.x - cam.x, y = platform.y - cam.y;
      if (x + platform.w < -20 || x > w + 20 || y + platform.h < -30 || y > h + 30) continue;
      const palette = terrainPalette[biomeAt(platform.x).name] || terrainPalette.Greenreach;
      ctx.save(); ctx.shadowColor = "rgba(0,0,0,.5)"; ctx.shadowBlur = 12; ctx.shadowOffsetY = 7;
      ctx.fillStyle = platform.kind === "camp" ? "#49372c" : palette.stone;
      ctx.beginPath(); ctx.moveTo(x + 5, y + platform.h * .24); ctx.lineTo(x + 19, y + 3);
      ctx.lineTo(x + platform.w * .38, y + 7); ctx.lineTo(x + platform.w * .51, y);
      ctx.lineTo(x + platform.w - 8, y + 5); ctx.lineTo(x + platform.w - 2, y + platform.h * .45);
      ctx.lineTo(x + platform.w - 15, y + platform.h); ctx.lineTo(x + 13, y + platform.h - 2); ctx.closePath(); ctx.fill(); ctx.restore();
      ctx.strokeStyle = palette.edge; ctx.globalAlpha = .5; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(x + 19, y + 3); ctx.lineTo(x + platform.w * .38, y + 7); ctx.lineTo(x + platform.w * .51, y); ctx.lineTo(x + platform.w - 8, y + 5); ctx.stroke(); ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(18,20,18,.55)"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x + platform.w * .35, y + 10); ctx.lineTo(x + platform.w * .29, y + platform.h - 8); ctx.moveTo(x + platform.w * .7, y + 8); ctx.lineTo(x + platform.w * .76, y + platform.h - 5); ctx.stroke();
    }
    // Trees and brush.
    for (const tree of game.trees) {
      if (tree.x < cam.x - 50 || tree.x > cam.x + w + 50 || tree.y < cam.y - 60 || tree.y > cam.y + h + 60) continue;
      const palette = terrainPalette[biomeAt(tree.x).name] || terrainPalette.Greenreach;
      ellipse(tree.x - cam.x + 5, tree.y - cam.y + tree.r * .55, tree.r * .85, tree.r * .3, "rgba(0,0,0,.38)");
      ctx.fillStyle = palette.grass; ctx.beginPath(); ctx.moveTo(tree.x - cam.x, tree.y - cam.y - tree.r * 1.35); ctx.lineTo(tree.x - cam.x - tree.r * .8, tree.y - cam.y + tree.r * .35); ctx.lineTo(tree.x - cam.x + tree.r * .8, tree.y - cam.y + tree.r * .35); ctx.closePath(); ctx.fill();
      ellipse(tree.x - cam.x, tree.y - cam.y - tree.r * .15, tree.r * .7, tree.r * .75, palette.grass, "rgba(214,202,157,.13)");
      ctx.fillStyle = "rgba(240,226,180,.12)"; ellipse(tree.x - cam.x - tree.r * .2, tree.y - cam.y - tree.r * .38, tree.r * .3, tree.r * .25, "rgba(240,226,180,.12)");
    }

    // Beacon, salvage, and attacks.
    const bx = game.beacon.x - cam.x, by = game.beacon.y - cam.y;
    ctx.save(); ctx.translate(bx, by); ctx.globalAlpha = .35 + .2 * Math.sin(game.time * 3); ctx.strokeStyle = "#e4bf79"; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(0, 0, 36 + Math.sin(game.time * 2) * 4, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 1; ellipse(0, 0, 10, 22, "#76654a", "#e4bf79"); ctx.fillStyle = "#efcf87"; ctx.fillRect(-2, -27, 4, 12); ctx.restore();
    for (const item of game.loot) { ctx.fillStyle = item.type === "heal" ? "#83c99b" : "#d7b76c"; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 13; ellipse(item.x - cam.x, item.y - cam.y, 7, 7, ctx.fillStyle); ctx.shadowBlur = 0; }
    for (const shot of game.shots) { ctx.strokeStyle = "#e8c986"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(shot.x - cam.x, shot.y - cam.y); ctx.lineTo(shot.x - cam.x - shot.vx * .025, shot.y - cam.y - shot.vy * .025); ctx.stroke(); }
    for (const enemy of game.enemies) {
      const x = enemy.x - cam.x, y = enemy.y - cam.y;
      if (x < -70 || x > w + 70 || y < -70 || y > h + 70) continue;
      drawMachine(enemy, x, y);
    }
    for (const particle of game.particles) { ctx.globalAlpha = Math.max(0, particle.life / particle.max); ellipse(particle.x - cam.x, particle.y - cam.y, particle.r, particle.r, particle.color); }
    ctx.globalAlpha = 1;

    const player = game.player;
    drawKnight(player.x - cam.x, player.y - cam.y, player.angle);

    // Compass map retained in the upper-right.
    ctx.fillStyle = "rgba(8,12,10,.78)"; ctx.fillRect(w - 146, 16, 130, 86); ctx.strokeStyle = "rgba(210,194,150,.7)"; ctx.strokeRect(w - 146, 16, 130, 86);
    for (const region of regions) { ctx.fillStyle = region.base; ctx.fillRect(w - 142 + region.x / WORLD.w * 122, 20, region.w / WORLD.w * 122, 78); }
    ctx.fillStyle = "#d4bd82"; ctx.beginPath(); ctx.arc(w - 142 + player.x / WORLD.w * 122, 20 + player.y / WORLD.h * 78, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#f0c56a"; ctx.beginPath(); ctx.arc(w - 142 + game.beacon.x / WORLD.w * 122, 20 + game.beacon.y / WORLD.h * 78, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#edf1e8"; ctx.font = "11px sans-serif"; ctx.fillText("FRONTIER MAP", w - 137, 115);
  }

  // Keep the original routine available for debugging if needed.
  window.drawFrontierOriginal = originalDraw;
  draw = draw;
})();
