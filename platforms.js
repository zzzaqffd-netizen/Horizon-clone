// Extra world geometry: 50 additional platforms distributed across all three biomes.
// This loads after game.js so it can add to the existing collision/render list.
(function addFrontierPlatforms() {
  const extraPlatforms = [];
  const kinds = ["rock", "ruin", "camp"];
  for (let i = 0; i < 50; i += 1) {
    const column = i % 5;
    const row = Math.floor(i / 5);
    const x = 95 + column * 690 + ((i * 73) % 260);
    const y = 110 + row * 245 + ((i * 47) % 110);
    const w = 110 + ((i * 37) % 120);
    const h = 30 + ((i * 13) % 25);
    const nearStart = Math.hypot(x - 300, y - 1300) < 180;
    const nearBeacon = Math.hypot(x - 3300, y - 1300) < 180;
    if (nearStart || nearBeacon) continue;
    extraPlatforms.push({ id: 100 + i, x, y, w, h, kind: kinds[i % kinds.length] });
  }
  game.platforms.push(...extraPlatforms);
})();
