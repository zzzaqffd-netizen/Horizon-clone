(() => {
  const KEY = "horizon-frontier-save-v1";
  const saveButton = document.getElementById("save-game");
  const status = document.getElementById("save-status");
  const originalBegin = begin;
  const originalPause = pause;

  function readSave() {
    try {
      const value = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!value || value.version !== 1 || !value.player) return null;
      if (![value.player.x, value.player.y, value.score, value.health, value.time].every(Number.isFinite)) return null;
      return value;
    } catch (error) {
      return null;
    }
  }

  function updateStatus(savedAt) {
    if (!status) return;
    status.textContent = savedAt ? `Saved ${new Date(savedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}` : "No save yet";
  }

  function saveGame(showMessage = true) {
    if (!game.running && !game.paused) {
      if (showMessage) show("Start an expedition before saving.");
      return false;
    }
    const record = {
      version: 1,
      savedAt: Date.now(),
      player: { x: game.player.x, y: game.player.y },
      score: game.score,
      health: game.health,
      time: game.time,
      wave: game.wave,
      weapon: game.weapon
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(record));
      updateStatus(record.savedAt);
      if (showMessage) show("Expedition saved on this device.");
      return true;
    } catch (error) {
      if (showMessage) show("Save failed. Check this browser's storage settings.");
      return false;
    }
  }

  function restore(record) {
    game.player.x = Math.max(game.player.r, Math.min(WORLD.w - game.player.r, record.player.x));
    game.player.y = Math.max(game.player.r, Math.min(WORLD.h - game.player.r, record.player.y));
    game.score = Math.max(0, Math.floor(record.score));
    game.health = Math.max(1, Math.min(100, record.health));
    game.time = Math.max(0, record.time);
    game.wave = Math.max(1, Math.floor(record.wave || 1));
    game.weapon = record.weapon === 2 ? 2 : 1;
    game.camera.x = Math.max(0, Math.min(WORLD.w - canvas.width, game.player.x - canvas.width / 2));
    game.camera.y = Math.max(0, Math.min(WORLD.h - canvas.height, game.player.y - canvas.height / 2));
    game.enemies = [];
    game.shots = [];
    game.enemyShots = [];
    game.loot = [];
    game.particles = [];
    hud();
    draw();
  }

  begin = function () {
    const record = readSave();
    originalBegin();
    if (record) {
      restore(record);
      show("Expedition resumed from your last save.");
      localStorage.removeItem(KEY);
      updateStatus(null);
    }
  };

  pause = function () {
    originalPause();
    if (game.paused) saveGame(false);
  };

  saveButton.addEventListener("click", () => saveGame(true));
  window.addEventListener("pagehide", () => saveGame(false));

  const existing = readSave();
  if (existing) {
    updateStatus(existing.savedAt);
    ui.label.textContent = "Expedition checkpoint found";
    ui.title.textContent = "Continue your journey";
    ui.text.textContent = "Your last position, salvage, health, and progress are saved on this device.";
    ui.start.textContent = "Continue expedition";
  }

  setInterval(() => {
    if (game.running && !game.paused) saveGame(false);
  }, 15000);
})();
