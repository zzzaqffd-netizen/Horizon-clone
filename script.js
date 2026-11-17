const machines = [
  { name: "Thunderjaw", type: "Apex predator", threat: "Extreme threat", description: "An armored hunter with devastating ranged weapons and a relentless charge." },
  { name: "Watcher", type: "Recon", threat: "Pack scout", description: "A sharp-eyed patrol unit that spots movement and calls nearby machines." },
  { name: "Glinthawk", type: "Aerial", threat: "High threat", description: "A swift flier that dives from above and punishes exposed travelers." },
  { name: "Rockbreaker", type: "Heavy", threat: "Extreme threat", description: "A burrowing siege machine that erupts from the earth with crushing force." },
  { name: "Grazer", type: "Acquisition", threat: "Low threat", description: "A skittish herd machine carrying valuable blaze canisters along its back." },
  { name: "Sawtooth", type: "Stalker", threat: "High threat", description: "A fast close-range hunter built to flank and overwhelm its prey." },
  { name: "Snapmaw", type: "Aquatic", threat: "High threat", description: "A river predator with a frost attack and powerful snapping jaws." },
  { name: "Bellowback", type: "Heavy", threat: "High threat", description: "A walking arsenal whose elemental sacs make it dangerous at any range." },
  { name: "Longleg", type: "Disruptor", threat: "Medium threat", description: "A vigilant machine that uses sonic bursts to scatter nearby threats." },
  { name: "Stalker", type: "Hunter", threat: "Extreme threat", description: "A cloaked ambusher with mines, darts, and a deadly tripcaster." },
  { name: "Lancehorn", type: "Acquisition", threat: "Medium threat", description: "A resource gatherer that defends itself with sharp, forward-facing drills." },
  { name: "Stormbird", type: "Aerial apex", threat: "Extreme threat", description: "A colossal sky predator that commands wind and lightning." }
];

const missions = [
  { title: "Scout the eastern valley", status: "Active", detail: "Mark the machine trails before sunrise." },
  { title: "Disable the mine's shield grid", status: "Queued", detail: "Find the power couplings beneath the old relay." },
  { title: "Retrieve a forgotten signal core", status: "Pending", detail: "A faint transmission is coming from the red ruins." },
  { title: "Track the machine migration", status: "Priority", detail: "Keep the western pass clear for the settlement convoy." }
];

const machineGrid = document.getElementById("machine-grid");
const missionList = document.getElementById("mission-list");

machines.forEach((machine) => {
  const card = document.createElement("article");
  card.className = "machine-card";
  const badge = document.createElement("span");
  badge.className = "badge";
  badge.textContent = machine.type;
  const title = document.createElement("h3");
  title.textContent = machine.name;
  const description = document.createElement("p");
  description.textContent = machine.description;
  const threat = document.createElement("div");
  threat.className = "machine-threat";
  threat.textContent = machine.threat;
  card.append(badge, title, description, threat);
  machineGrid.appendChild(card);
});

missions.forEach((mission) => {
  const item = document.createElement("article");
  item.className = "mission-item";
  const copy = document.createElement("div");
  copy.className = "mission-copy";
  const title = document.createElement("div");
  title.className = "mission-title";
  const dot = document.createElement("span");
  dot.className = "dot";
  dot.setAttribute("aria-hidden", "true");
  title.append(dot, document.createTextNode(mission.title));
  const detail = document.createElement("p");
  detail.textContent = mission.detail;
  const status = document.createElement("div");
  status.className = "mission-status";
  status.textContent = mission.status;
  copy.append(title, detail);
  item.append(copy, status);
  missionList.appendChild(item);
});

const canvas = document.getElementById("game-canvas");
const ctx = canvas.getContext("2d");
const overlay = document.getElementById("game-overlay");
const overlayEyebrow = document.getElementById("overlay-eyebrow");
const overlayTitle = document.getElementById("overlay-title");
const overlayCopy = document.getElementById("overlay-copy");
const startButton = document.getElementById("game-start");
const pauseButton = document.getElementById("pause-button");
const scoreValue = document.getElementById("score-value");
const waveValue = document.getElementById("wave-value");
const healthFill = document.getElementById("health-fill");
const healthBar = document.querySelector(".health-track");

const game = {
  running: false,
  paused: false,
  over: false,
  score: 0,
  wave: 1,
  health: 100,
  lastTime: 0,
  elapsed: 0,
  spawnTimer: 0,
  fireTimer: 0,
  keys: new Set(),
  pointer: { x: canvas.width / 2, y: canvas.height / 2, down: false },
  player: { x: canvas.width / 2, y: canvas.height / 2, radius: 13, speed: 230, angle: 0 },
  enemies: [],
  shots: [],
  pickups: [],
  particles: []
};

function showOverlay(eyebrow, title, copy, buttonText) {
  overlayEyebrow.textContent = eyebrow;
  overlayTitle.textContent = title;
  overlayCopy.textContent = copy;
  startButton.textContent = buttonText;
  overlay.classList.remove("is-hidden");
}

function updateHud() {
  scoreValue.textContent = String(game.score).padStart(4, "0");
  waveValue.textContent = String(game.wave).padStart(2, "0");
  healthFill.style.width = `${Math.max(0, game.health)}%`;
  healthBar.setAttribute("aria-valuenow", String(Math.max(0, game.health)));
  healthFill.style.background = game.health < 30 ? "linear-gradient(90deg,#ff6d61,#f5bd6a)" : "linear-gradient(90deg,#63d987,#c3ed9c)";
}

function startGame() {
  game.running = true;
  game.paused = false;
  game.over = false;
  game.score = 0;
  game.wave = 1;
  game.health = 100;
  game.elapsed = 0;
  game.spawnTimer = 0.6;
  game.fireTimer = 0;
  game.enemies = [];
  game.shots = [];
  game.pickups = [];
  game.particles = [];
  game.player.x = canvas.width / 2;
  game.player.y = canvas.height / 2;
  game.keys.clear();
  pauseButton.textContent = "Pause";
  pauseButton.setAttribute("aria-pressed", "false");
  overlay.classList.add("is-hidden");
  updateHud();
  game.lastTime = performance.now();
  requestAnimationFrame(loop);
}

function togglePause() {
  if (!game.running || game.over) return;
  game.paused = !game.paused;
  pauseButton.textContent = game.paused ? "Resume" : "Pause";
  pauseButton.setAttribute("aria-pressed", String(game.paused));
  if (game.paused) {
    showOverlay("Expedition paused", "Catch your breath.", "The machines are waiting. Resume when you are ready.", "Resume mission");
  } else {
    overlay.classList.add("is-hidden");
    game.lastTime = performance.now();
    requestAnimationFrame(loop);
  }
}

function endGame() {
  game.running = false;
  game.over = true;
  game.paused = false;
  pauseButton.textContent = "Pause";
  pauseButton.setAttribute("aria-pressed", "false");
  showOverlay("Expedition report", "The wilds endure.", `You recovered ${game.score} salvage and reached wave ${game.wave}. Ready for another run?`, "Play again");
}

function spawnEnemy() {
  const edge = Math.floor(Math.random() * 4);
  const margin = 28;
  let x, y;
  if (edge === 0) { x = Math.random() * canvas.width; y = -margin; }
  else if (edge === 1) { x = canvas.width + margin; y = Math.random() * canvas.height; }
  else if (edge === 2) { x = Math.random() * canvas.width; y = canvas.height + margin; }
  else { x = -margin; y = Math.random() * canvas.height; }
  const heavy = Math.random() < Math.min(0.12 + game.wave * 0.025, 0.4);
  game.enemies.push({ x, y, radius: heavy ? 18 : 12, speed: heavy ? 43 + game.wave * 2 : 65 + game.wave * 3, hp: heavy ? 3 : 1, heavy, hitCooldown: 0 });
}

function fire() {
  const p = game.player;
  const angle = p.angle;
  game.shots.push({ x: p.x + Math.cos(angle) * 17, y: p.y + Math.sin(angle) * 17, vx: Math.cos(angle) * 520, vy: Math.sin(angle) * 520, life: 0.8 });
  for (let i = 0; i < 3; i++) game.particles.push({ x: p.x + Math.cos(angle) * 18, y: p.y + Math.sin(angle) * 18, vx: Math.cos(angle + (Math.random() - .5) * .8) * (40 + Math.random() * 90), vy: Math.sin(angle + (Math.random() - .5) * .8) * (40 + Math.random() * 90), life: .16, maxLife: .16, color: "#f6d27e", size: 2 + Math.random() * 2 });
}

function update(dt) {
  game.elapsed += dt;
  game.wave = 1 + Math.floor(game.elapsed / 22);
  game.spawnTimer -= dt;
  if (game.spawnTimer <= 0) {
    spawnEnemy();
    game.spawnTimer = Math.max(.38, 1.35 - game.wave * .08) * (0.72 + Math.random() * .55);
  }

  const p = game.player;
  let dx = 0, dy = 0;
  if (game.keys.has("w") || game.keys.has("arrowup")) dy -= 1;
  if (game.keys.has("s") || game.keys.has("arrowdown")) dy += 1;
  if (game.keys.has("a") || game.keys.has("arrowleft")) dx -= 1;
  if (game.keys.has("d") || game.keys.has("arrowright")) dx += 1;
  const length = Math.hypot(dx, dy) || 1;
  p.x = Math.max(p.radius, Math.min(canvas.width - p.radius, p.x + (dx / length) * p.speed * dt));
  p.y = Math.max(p.radius, Math.min(canvas.height - p.radius, p.y + (dy / length) * p.speed * dt));
  p.angle = Math.atan2(game.pointer.y - p.y, game.pointer.x - p.x);

  game.fireTimer -= dt;
  if ((game.pointer.down || game.keys.has(" ") || game.keys.has("enter")) && game.fireTimer <= 0) {
    fire();
    game.fireTimer = .19;
  }

  game.shots = game.shots.filter((shot) => {
    shot.x += shot.vx * dt; shot.y += shot.vy * dt; shot.life -= dt;
    return shot.life > 0 && shot.x > -10 && shot.x < canvas.width + 10 && shot.y > -10 && shot.y < canvas.height + 10;
  });

  game.enemies.forEach((enemy) => {
    const angle = Math.atan2(p.y - enemy.y, p.x - enemy.x);
    enemy.x += Math.cos(angle) * enemy.speed * dt;
    enemy.y += Math.sin(angle) * enemy.speed * dt;
    enemy.hitCooldown -= dt;
    if (Math.hypot(p.x - enemy.x, p.y - enemy.y) < p.radius + enemy.radius && enemy.hitCooldown <= 0) {
      game.health -= enemy.heavy ? 17 : 10;
      enemy.hitCooldown = .8;
      const push = Math.atan2(p.y - enemy.y, p.x - enemy.x);
      p.x = Math.max(p.radius, Math.min(canvas.width - p.radius, p.x + Math.cos(push) * 22));
      p.y = Math.max(p.radius, Math.min(canvas.height - p.radius, p.y + Math.sin(push) * 22));
      for (let i = 0; i < 9; i++) game.particles.push({ x:p.x, y:p.y, vx:(Math.random()-.5)*140, vy:(Math.random()-.5)*140, life:.35, maxLife:.35, color:"#f27d63", size:3 });
    }
  });

  game.shots.forEach((shot) => {
    for (const enemy of game.enemies) {
      if (shot.life > 0 && Math.hypot(shot.x - enemy.x, shot.y - enemy.y) < enemy.radius + 5) {
        shot.life = 0;
        enemy.hp -= 1;
        for (let i = 0; i < 5; i++) game.particles.push({ x:shot.x, y:shot.y, vx:(Math.random()-.5)*100, vy:(Math.random()-.5)*100, life:.22, maxLife:.22, color:"#92e0a3", size:2 + Math.random()*2 });
        if (enemy.hp <= 0) {
          game.score += enemy.heavy ? 30 : 10;
          if (Math.random() < .28) game.pickups.push({ x:enemy.x, y:enemy.y, radius:7, life:9 });
          enemy.dead = true;
        }
        break;
      }
    }
  });
  game.enemies = game.enemies.filter((enemy) => !enemy.dead);

  game.pickups = game.pickups.filter((pickup) => {
    pickup.life -= dt;
    if (Math.hypot(p.x - pickup.x, p.y - pickup.y) < p.radius + pickup.radius + 4) {
      game.score += 25;
      pickup.life = 0;
      for (let i = 0; i < 8; i++) game.particles.push({ x:pickup.x, y:pickup.y, vx:(Math.random()-.5)*100, vy:(Math.random()-.5)*100, life:.3, maxLife:.3, color:"#f0c56a", size:3 });
    }
    return pickup.life > 0;
  });
  game.particles = game.particles.filter((particle) => {
    particle.x += particle.vx * dt; particle.y += particle.vy * dt; particle.life -= dt;
    return particle.life > 0;
  });
  if (game.health <= 0) { game.health = 0; updateHud(); endGame(); return; }
  updateHud();
}

function draw() {
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#0b1711";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(146,224,163,.055)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y <= h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
  ctx.fillStyle = "rgba(146,224,163,.045)";
  for (let i = 0; i < 24; i++) { const x = (i * 131 + 37) % w, y = (i * 79 + 19) % h; ctx.beginPath(); ctx.arc(x, y, 2 + (i % 3), 0, Math.PI * 2); ctx.fill(); }

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

function loop(now) {
  if (!game.running || game.paused) return;
  const dt = Math.min((now - game.lastTime) / 1000, .04);
  game.lastTime = now;
  update(dt);
  draw();
  if (game.running && !game.paused) requestAnimationFrame(loop);
}

function pointerPosition(event) {
  const rect = canvas.getBoundingClientRect();
  game.pointer.x = (event.clientX - rect.left) * canvas.width / rect.width;
  game.pointer.y = (event.clientY - rect.top) * canvas.height / rect.height;
}

canvas.addEventListener("pointermove", pointerPosition);
canvas.addEventListener("pointerdown", (event) => { pointerPosition(event); game.pointer.down = true; canvas.setPointerCapture?.(event.pointerId); if (!game.running && !game.over) startGame(); });
canvas.addEventListener("pointerup", () => { game.pointer.down = false; });
canvas.addEventListener("pointercancel", () => { game.pointer.down = false; });
window.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(key)) event.preventDefault();
  if (key === "p" && !event.repeat) { togglePause(); return; }
  game.keys.add(key);
});
window.addEventListener("keyup", (event) => game.keys.delete(event.key.toLowerCase()));
window.addEventListener("blur", () => { game.keys.clear(); game.pointer.down = false; if (game.running && !game.paused) togglePause(); });
startButton.addEventListener("click", () => { if (game.paused) togglePause(); else startGame(); });
pauseButton.addEventListener("click", togglePause);
document.getElementById("trailer-button").addEventListener("click", () => document.getElementById("machines").scrollIntoView({ behavior:"smooth" }));

ctx.fillStyle = "#0b1711";
ctx.fillRect(0, 0, canvas.width, canvas.height);
ctx.strokeStyle = "rgba(146,224,163,.07)";
for (let x = 0; x < canvas.width; x += 40) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,canvas.height); ctx.stroke(); }
for (let y = 0; y < canvas.height; y += 40) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(canvas.width,y); ctx.stroke(); }
updateHud();
