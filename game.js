const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const goldEl = document.getElementById("goldValue");
const livesEl = document.getElementById("livesValue");
const waveEl = document.getElementById("waveValue");
const scoreEl = document.getElementById("scoreValue");
const chargeEl = document.getElementById("chargeValue");
const towerButtonsEl = document.getElementById("towerButtons");
const mobileTowerButtonsEl = document.getElementById("mobileTowerButtons");
const statusHintEl = document.getElementById("statusHint");
const selectedTowerInfoEl = document.getElementById("selectedTowerInfo");
const eventLogEl = document.getElementById("eventLog");
const waveStatusEl = document.getElementById("waveStatus");
const startWaveBtn = document.getElementById("startWaveBtn");
const abilityBtn = document.getElementById("abilityBtn");
const speedBtn = document.getElementById("speedBtn");
const autoWaveBtn = document.getElementById("autoWaveBtn");
const installBtn = document.getElementById("installBtn");
const upgradeBtn = document.getElementById("upgradeBtn");
const sellBtn = document.getElementById("sellBtn");
const restartBtn = document.getElementById("restartBtn");
const mobileWaveBtn = document.getElementById("mobileWaveBtn");
const mobileAbilityBtn = document.getElementById("mobileAbilityBtn");
const mobileSpeedBtn = document.getElementById("mobileSpeedBtn");
const mobileAutoBtn = document.getElementById("mobileAutoBtn");
const nextWavePreviewEl = document.getElementById("nextWavePreview");
const phaseButtonsEl = document.getElementById("phaseButtons");
const difficultyButtonsEl = document.getElementById("difficultyButtons");
const bossHud = document.getElementById("bossHud");
const bossNameEl = document.getElementById("bossName");
const bossBarFillEl = document.getElementById("bossBarFill");
const overlay = document.getElementById("overlay");
const overlayTitle = document.getElementById("overlayTitle");
const overlayText = document.getElementById("overlayText");
const overlayAction = document.getElementById("overlayAction");

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
const rand = (min, max) => Math.random() * (max - min) + min;

const phaseConfigs = {
  alpha: {
    label: "Fase 1 — Bastião Alfa",
    description: "Rota introdutória com curvas bem distribuídas para aprender o fluxo do jogo.",
    startGold: 190,
    startLives: 22,
    totalWaves: 8,
    path: [
      { x: -30, y: 104 },
      { x: 116, y: 104 },
      { x: 116, y: 238 },
      { x: 336, y: 238 },
      { x: 336, y: 118 },
      { x: 650, y: 118 },
      { x: 650, y: 364 },
      { x: 236, y: 364 },
      { x: 236, y: 500 },
      { x: 772, y: 500 },
      { x: 1030, y: 500 },
    ],
    buildSpots: [
      { x: 182, y: 52 }, { x: 250, y: 168 }, { x: 218, y: 286 }, { x: 410, y: 178 },
      { x: 432, y: 72 }, { x: 560, y: 184 }, { x: 726, y: 86 }, { x: 742, y: 240 },
      { x: 560, y: 302 }, { x: 458, y: 430 }, { x: 166, y: 430 }, { x: 304, y: 560 },
      { x: 550, y: 560 }, { x: 694, y: 430 }, { x: 840, y: 560 }, { x: 862, y: 420 },
    ],
  },
  delta: {
    label: "Fase 2 — Corredor Delta",
    description: "Mapa com curvas longas, rota em zigue-zague e pressão crescente nas bordas.",
    startGold: 205,
    startLives: 20,
    totalWaves: 10,
    path: [
      { x: -30, y: 300 }, { x: 150, y: 300 }, { x: 150, y: 120 }, { x: 470, y: 120 },
      { x: 470, y: 420 }, { x: 310, y: 420 }, { x: 310, y: 540 }, { x: 780, y: 540 },
      { x: 780, y: 180 }, { x: 620, y: 180 }, { x: 620, y: 320 }, { x: 1030, y: 320 },
    ],
    buildSpots: [
      { x: 88, y: 190 }, { x: 228, y: 220 }, { x: 234, y: 70 }, { x: 360, y: 198 },
      { x: 540, y: 60 }, { x: 560, y: 218 }, { x: 392, y: 356 }, { x: 230, y: 480 },
      { x: 410, y: 560 }, { x: 612, y: 560 }, { x: 834, y: 502 }, { x: 708, y: 258 },
      { x: 850, y: 118 }, { x: 922, y: 252 }, { x: 670, y: 390 }, { x: 526, y: 358 },
    ],
  },
  omega: {
    label: "Fase 3 — Citadela Ômega",
    description: "Setor avançado com cruzamentos fechados, ideal para combos de área e suporte.",
    startGold: 220,
    startLives: 18,
    totalWaves: 12,
    path: [
      { x: -30, y: 100 }, { x: 210, y: 100 }, { x: 210, y: 220 }, { x: 110, y: 220 },
      { x: 110, y: 480 }, { x: 410, y: 480 }, { x: 410, y: 300 }, { x: 720, y: 300 },
      { x: 720, y: 90 }, { x: 900, y: 90 }, { x: 900, y: 500 }, { x: 1030, y: 500 },
    ],
    buildSpots: [
      { x: 118, y: 54 }, { x: 286, y: 96 }, { x: 268, y: 260 }, { x: 62, y: 354 },
      { x: 184, y: 392 }, { x: 226, y: 548 }, { x: 358, y: 420 }, { x: 352, y: 236 },
      { x: 522, y: 250 }, { x: 562, y: 532 }, { x: 644, y: 384 }, { x: 792, y: 222 },
      { x: 790, y: 52 }, { x: 938, y: 182 }, { x: 842, y: 360 }, { x: 836, y: 556 },
    ],
  },
};

const difficultyConfigs = {
  casual: {
    label: "Casual",
    goldBonus: 35,
    livesBonus: 4,
    enemyScale: 0.9,
    rewardScale: 0.95,
    overcharge: 45,
  },
  standard: {
    label: "Padrão",
    goldBonus: 0,
    livesBonus: 0,
    enemyScale: 1,
    rewardScale: 1,
    overcharge: 35,
  },
  veteran: {
    label: "Veterano",
    goldBonus: -20,
    livesBonus: -3,
    enemyScale: 1.14,
    rewardScale: 1.12,
    overcharge: 28,
  },
};

let path = [];
let buildSpots = [];

const towerTypes = {
  bolt: {
    label: "Ninho Tesla",
    cost: 60,
    damage: 15,
    range: 150,
    reload: 0.42,
    projectileSpeed: 420,
    color: "#69f0ae",
    description: "Tiro rápido e estável para segurar as primeiras ondas.",
  },
  cannon: {
    label: "Canhão Vulcânico",
    cost: 90,
    damage: 34,
    range: 172,
    reload: 0.95,
    projectileSpeed: 310,
    splash: 58,
    color: "#ffb86a",
    description: "Explosões pesadas com dano em área.",
  },
  frost: {
    label: "Prisma Criogênico",
    cost: 80,
    damage: 10,
    range: 164,
    reload: 0.72,
    projectileSpeed: 360,
    slow: 0.52,
    slowDuration: 1.7,
    color: "#76d7ff",
    description: "Reduz a velocidade dos alvos e controla a rota.",
  },
  ember: {
    label: "Forja Solar",
    cost: 110,
    damage: 18,
    range: 178,
    reload: 0.52,
    projectileSpeed: 390,
    burn: 9,
    burnDuration: 2.4,
    color: "#ff6e83",
    description: "Projéteis incendiários com dano contínuo.",
  },
  rail: {
    label: "Raio Íon",
    cost: 140,
    damage: 24,
    range: 194,
    reload: 0.36,
    projectileSpeed: 560,
    chain: 2,
    color: "#b592ff",
    description: "Dispara feixes velozes e salta entre inimigos.",
  },
  beacon: {
    label: "Nexus de Comando",
    cost: 125,
    damage: 0,
    range: 148,
    reload: 1.15,
    projectileSpeed: 0,
    auraDamageBoost: 0.12,
    auraRangeBoost: 0.07,
    auraReloadBoost: 0.06,
    support: true,
    color: "#7af7ff",
    description: "Não ataca. Amplifica torres próximas e acelera a sobrecarga.",
  },
};

const enemyTypes = {
  scout: {
    label: "Sprinter",
    hp: 46,
    speed: 86,
    reward: 10,
    size: 12,
    color: "#83ffd4",
  },
  brute: {
    label: "Juggernaut",
    hp: 112,
    speed: 55,
    reward: 16,
    size: 15,
    color: "#ffc172",
  },
  wisp: {
    label: "Wisp",
    hp: 62,
    speed: 102,
    reward: 14,
    size: 10,
    color: "#78d9ff",
    shield: 18,
  },
  splitter: {
    label: "Splitter",
    hp: 150,
    speed: 64,
    reward: 22,
    size: 14,
    color: "#ff86cf",
    spawnChildren: 2,
  },
  phantom: {
    label: "Phantom",
    hp: 84,
    speed: 88,
    reward: 20,
    size: 12,
    color: "#b899ff",
    shield: 12,
    phase: true,
  },
  titan: {
    label: "Titan",
    hp: 440,
    speed: 44,
    reward: 60,
    size: 22,
    color: "#ffe070",
    shield: 90,
  },
};

function createDefaultState() {
  return {
    started: false,
    paused: false,
    gameOver: false,
    wave: 0,
    gold: 170,
    lives: 20,
    score: 0,
    overcharge: 35,
    selectedBuild: "bolt",
    selectedPhase: "alpha",
    selectedDifficulty: "standard",
    selectedTowerId: null,
    waveActive: false,
    waveModifier: null,
    speedMultiplier: 1,
    autoWaveEnabled: false,
    autoWaveTimer: 0,
    spawnQueue: [],
    spawnTimer: 0,
    pendingAbility: false,
    hoveredSpotId: null,
    cursor: { x: 0, y: 0 },
  };
}

const state = createDefaultState();
let towers = [];
let enemies = [];
let projectiles = [];
let particles = [];
let messages = [];
let nextTowerId = 1;
let lastFrame = performance.now();
let deferredInstallPrompt = null;

class Enemy {
  constructor(typeKey, scale = 1, options = {}) {
    const base = enemyTypes[typeKey];
    const modifier = options.modifier || state.waveModifier || {};
    const difficulty = difficultyConfigs[state.selectedDifficulty] || difficultyConfigs.standard;
    this.typeKey = typeKey;
    this.label = base.label;
    this.size = base.size;
    this.color = base.color;
    this.maxHp = Math.round(base.hp * scale * difficulty.enemyScale * (modifier.hpScale || 1));
    this.hp = this.maxHp;
    this.speed = base.speed * (1 + Math.max(0, state.wave - 1) * 0.018) * Math.max(0.85, difficulty.enemyScale) * (modifier.speedScale || 1);
    this.reward = Math.round(base.reward * (0.9 + scale * 0.3) * difficulty.rewardScale * (modifier.rewardBonus || 1));
    this.shield = Math.round((base.shield || 0) * scale * 0.9 * (modifier.shieldScale || 1));
    this.spawnChildren = base.spawnChildren || 0;
    this.phase = Boolean(base.phase);
    this.phaseCycle = rand(0, 2.2);
    this.phased = false;
    this.x = options.x ?? path[0].x;
    this.y = options.y ?? path[0].y;
    this.pathIndex = options.pathIndex ?? 1;
    this.progress = this.pathIndex * 1000;
    this.dead = false;
    this.slowFactor = 1;
    this.slowTimer = 0;
    this.burnDps = 0;
    this.burnTimer = 0;
  }

  applySlow(factor, duration) {
    if (!factor || duration <= 0) return;
    this.slowFactor = Math.min(this.slowFactor, factor);
    this.slowTimer = Math.max(this.slowTimer, duration);
  }

  applyBurn(dps, duration) {
    if (!dps || duration <= 0) return;
    this.burnDps = Math.max(this.burnDps, dps);
    this.burnTimer = Math.max(this.burnTimer, duration);
  }

  takeDamage(amount) {
    if (this.dead) return;

    let remaining = amount;
    if (this.phase && this.phased) {
      remaining *= 0.35;
      spawnBurst(this.x, this.y, "#c8a9ff", 2, 0.7);
    }

    if (this.shield > 0) {
      const blocked = Math.min(this.shield, remaining);
      this.shield -= blocked;
      remaining -= blocked;
      if (blocked > 0) {
        spawnBurst(this.x, this.y, "#7fd7ff", 3, 1.2);
      }
    }

    if (remaining > 0) {
      this.hp -= remaining;
    }

    if (this.hp <= 0) {
      this.onKilled();
    }
  }

  onKilled() {
    if (this.dead) return;
    this.dead = true;
    state.gold += this.reward;
    state.score += Math.round(this.maxHp * 2);
    state.overcharge = clamp(state.overcharge + (this.typeKey === "titan" ? 18 : 6), 0, 100);

    spawnBurst(this.x, this.y, this.color, this.typeKey === "titan" ? 18 : 10, 1.8);

    if (this.spawnChildren > 0) {
      for (let i = 0; i < this.spawnChildren; i += 1) {
        spawnEnemy("scout", 0.78, {
          x: this.x + rand(-10, 10),
          y: this.y + rand(-10, 10),
          pathIndex: this.pathIndex,
        });
      }
      addMessage("Um Splitter se dividiu em alvos menores.", "warn");
    }

    if (this.typeKey === "titan") {
      addMessage("Titã abatido. A muralha resistiu.", "good");
    }
  }

  reachBase() {
    if (this.dead) return;
    this.dead = true;
    state.lives = Math.max(0, state.lives - 1);
    state.overcharge = clamp(state.overcharge + 3, 0, 100);
    spawnBurst(this.x, this.y, "#ff8ca1", 10, 1.6);
    addMessage(`${this.label} rompeu a linha de defesa.`, "warn");

    if (state.lives <= 0) {
      triggerGameOver();
    }
  }

  update(dt) {
    if (this.dead) return;

    if (this.phase) {
      this.phaseCycle = (this.phaseCycle + dt) % 2.2;
      this.phased = this.phaseCycle > 1.25;
    } else {
      this.phased = false;
    }

    if (this.burnTimer > 0) {
      this.burnTimer -= dt;
      this.hp -= this.burnDps * dt;
      if (this.hp <= 0) {
        this.onKilled();
        return;
      }
    } else {
      this.burnDps = 0;
    }

    let currentSpeed = this.speed;
    if (this.slowTimer > 0) {
      this.slowTimer -= dt;
      currentSpeed *= this.slowFactor;
    } else {
      this.slowFactor = 1;
    }

    const nextPoint = path[this.pathIndex];
    if (!nextPoint) {
      this.reachBase();
      return;
    }

    const dx = nextPoint.x - this.x;
    const dy = nextPoint.y - this.y;
    const distance = Math.hypot(dx, dy);
    const step = currentSpeed * dt;

    if (distance <= step) {
      this.x = nextPoint.x;
      this.y = nextPoint.y;
      this.pathIndex += 1;
      if (this.pathIndex >= path.length) {
        this.reachBase();
        return;
      }
    } else {
      this.x += (dx / distance) * step;
      this.y += (dy / distance) * step;
    }

    this.progress = this.pathIndex * 1000 - distance;
  }

  draw() {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.phase && this.phased) {
      ctx.globalAlpha = 0.58;
    }

    if (this.shield > 0) {
      ctx.beginPath();
      ctx.arc(0, 0, this.size + 6, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(127, 215, 255, 0.65)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    if (this.phase && this.phased) {
      ctx.beginPath();
      ctx.arc(0, 0, this.size + 4, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(197, 153, 255, 0.75)";
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(255,255,255,0.28)";
    ctx.beginPath();
    ctx.arc(-this.size * 0.25, -this.size * 0.25, Math.max(2, this.size * 0.26), 0, Math.PI * 2);
    ctx.fill();

    const barWidth = Math.max(26, this.size * 2.4);
    const hpRatio = clamp(this.hp / this.maxHp, 0, 1);
    ctx.fillStyle = "rgba(5, 12, 18, 0.9)";
    ctx.fillRect(-barWidth / 2, -this.size - 12, barWidth, 5);
    ctx.fillStyle = "#ff6e83";
    ctx.fillRect(-barWidth / 2, -this.size - 12, barWidth * hpRatio, 5);

    ctx.restore();
  }
}

class Tower {
  constructor(spot, typeKey) {
    this.id = nextTowerId;
    nextTowerId += 1;
    this.spotId = spot.id;
    this.x = spot.x;
    this.y = spot.y;
    this.typeKey = typeKey;
    this.level = 1;
    this.cooldown = 0;
    this.angle = -Math.PI / 2;
  }

  getBaseStats() {
    return towerTypes[this.typeKey];
  }

  getSupportLinks() {
    if (this.typeKey === "beacon") return [];
    return towers.filter(
      (tower) =>
        tower.id !== this.id &&
        tower.typeKey === "beacon" &&
        dist(this.x, this.y, tower.x, tower.y) <= tower.getBaseStats().range + tower.level * 10
    );
  }

  getStats() {
    const base = this.getBaseStats();
    const levelBonus = this.level - 1;
    const supportStrength = this.typeKey === "beacon"
      ? 0
      : this.getSupportLinks().reduce((sum, tower) => sum + 1 + (tower.level - 1) * 0.55, 0);
    const damageBoost = supportStrength * 0.12;
    const rangeBoost = supportStrength * 0.07;
    const reloadBoost = supportStrength * 0.06;

    return {
      ...base,
      damage: base.support ? 0 : Math.round(base.damage * (1 + levelBonus * 0.28 + damageBoost)),
      range: Math.round((base.range + levelBonus * 12) * (1 + rangeBoost)),
      reload: base.support
        ? Math.max(0.65, base.reload * Math.pow(0.95, levelBonus))
        : Math.max(0.16, base.reload * Math.pow(0.92, levelBonus) * Math.max(0.58, 1 - reloadBoost)),
      splash: base.splash ? Math.round(base.splash + levelBonus * 6) : 0,
      burn: base.burn ? +(base.burn * (1 + levelBonus * 0.24)).toFixed(1) : 0,
      slow: base.slow || 0,
      slowDuration: base.slowDuration ? +(base.slowDuration + levelBonus * 0.16).toFixed(2) : 0,
      chain: base.chain ? base.chain + (levelBonus >= 2 ? 1 : 0) : 0,
      projectileSpeed: base.projectileSpeed + levelBonus * 24,
      auraDamageBoost: base.auraDamageBoost ? +(base.auraDamageBoost * (1 + levelBonus * 0.25)).toFixed(2) : 0,
      auraRangeBoost: base.auraRangeBoost ? +(base.auraRangeBoost * (1 + levelBonus * 0.2)).toFixed(2) : 0,
      auraReloadBoost: base.auraReloadBoost ? +(base.auraReloadBoost * (1 + levelBonus * 0.2)).toFixed(2) : 0,
      supportBoost: supportStrength,
    };
  }

  upgradeCost() {
    const baseCost = this.getBaseStats().cost;
    return Math.round(baseCost * (0.8 + this.level * 0.75));
  }

  sellValue() {
    const baseCost = this.getBaseStats().cost;
    return Math.round(baseCost * (0.55 + (this.level - 1) * 0.18));
  }

  findTarget(range) {
    const candidates = enemies.filter((enemy) => !enemy.dead && dist(this.x, this.y, enemy.x, enemy.y) <= range);
    candidates.sort((a, b) => b.progress - a.progress || a.hp - b.hp);
    return candidates[0] || null;
  }

  update(dt) {
    if (state.paused || state.gameOver || !state.started) return;

    const stats = this.getStats();

    if (this.typeKey === "beacon") {
      this.angle += dt * (1.4 + this.level * 0.12);
      this.cooldown -= dt;
      if (this.cooldown <= 0) {
        state.overcharge = clamp(state.overcharge + 0.8 * this.level, 0, 100);
        this.cooldown = stats.reload;
        spawnRing(this.x, this.y, stats.color, 10 + this.level * 2);
      }
      return;
    }

    const target = this.findTarget(stats.range);
    if (target) {
      this.angle = Math.atan2(target.y - this.y, target.x - this.x);
    }

    this.cooldown -= dt;
    if (target && this.cooldown <= 0) {
      this.cooldown = stats.reload;
      this.fire(target, stats);
    }
  }

  fire(target, stats) {
    projectiles.push(
      new Projectile({
        x: this.x,
        y: this.y,
        target,
        damage: stats.damage,
        speed: stats.projectileSpeed,
        color: stats.color,
        splash: stats.splash,
        slow: stats.slow,
        slowDuration: stats.slowDuration,
        burn: stats.burn,
        burnDuration: stats.burnDuration,
        chain: stats.chain,
      })
    );

    spawnBurst(this.x + Math.cos(this.angle) * 16, this.y + Math.sin(this.angle) * 16, stats.color, 3, 0.8);
  }

  draw() {
    const stats = this.getStats();
    const selected = state.selectedTowerId === this.id;

    if (selected || this.typeKey === "beacon") {
      ctx.beginPath();
      ctx.arc(this.x, this.y, stats.range, 0, Math.PI * 2);
      ctx.fillStyle = this.typeKey === "beacon" ? "rgba(122, 247, 255, 0.045)" : "rgba(116, 215, 255, 0.06)";
      ctx.fill();
      ctx.strokeStyle = this.typeKey === "beacon" ? "rgba(122, 247, 255, 0.24)" : "rgba(116, 215, 255, 0.2)";
      ctx.setLineDash([5, 7]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.beginPath();
    ctx.fillStyle = "#101a25";
    ctx.arc(0, 0, 17, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = stats.color;
    ctx.stroke();

    if (this.typeKey === "beacon") {
      ctx.rotate(this.angle);
      ctx.beginPath();
      ctx.moveTo(0, -15);
      ctx.lineTo(15, 0);
      ctx.lineTo(0, 15);
      ctx.lineTo(-15, 0);
      ctx.closePath();
      ctx.fillStyle = "rgba(122, 247, 255, 0.18)";
      ctx.fill();
      ctx.strokeStyle = stats.color;
      ctx.stroke();
      ctx.strokeRect(-11, -11, 22, 22);
    } else {
      ctx.rotate(this.angle);
      ctx.fillStyle = stats.color;
      ctx.fillRect(-2, -4, 24, 8);

      if (this.typeKey === "rail") {
        ctx.fillRect(6, -7, 18, 3);
        ctx.fillRect(6, 4, 18, 3);
      } else if (this.typeKey === "cannon") {
        ctx.fillRect(0, -6, 18, 12);
      }
    }

    ctx.beginPath();
    ctx.fillStyle = "#d9f6ff";
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.fillStyle = "rgba(0,0,0,0.3)";
    ctx.font = "bold 12px Inter, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`L${this.level}`, this.x, this.y + 34);
  }
}

class Projectile {
  constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.target = config.target;
    this.damage = config.damage;
    this.speed = config.speed;
    this.color = config.color;
    this.splash = config.splash || 0;
    this.slow = config.slow || 0;
    this.slowDuration = config.slowDuration || 0;
    this.burn = config.burn || 0;
    this.burnDuration = config.burnDuration || 0;
    this.chain = config.chain || 0;
    this.dead = false;
    this.radius = this.splash > 0 ? 5 : 4;
  }

  update(dt) {
    if (this.dead) return;
    if (!this.target || this.target.dead) {
      this.dead = true;
      return;
    }

    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.hypot(dx, dy);
    const step = this.speed * dt;

    if (distance <= step) {
      this.x = this.target.x;
      this.y = this.target.y;
      this.impact();
      return;
    }

    this.x += (dx / distance) * step;
    this.y += (dy / distance) * step;
  }

  applyHit(enemy, multiplier = 1) {
    enemy.takeDamage(this.damage * multiplier);
    if (this.slow) enemy.applySlow(this.slow, this.slowDuration);
    if (this.burn) enemy.applyBurn(this.burn, this.burnDuration);
  }

  impact() {
    if (this.dead) return;
    this.dead = true;

    if (this.splash > 0) {
      for (const enemy of enemies) {
        if (enemy.dead) continue;
        const distanceToEnemy = dist(this.x, this.y, enemy.x, enemy.y);
        if (distanceToEnemy <= this.splash) {
          const falloff = clamp(1 - distanceToEnemy / (this.splash * 1.35), 0.45, 1);
          this.applyHit(enemy, falloff);
        }
      }
      spawnRing(this.x, this.y, this.color, this.splash * 0.35);
    } else {
      this.applyHit(this.target, 1);
    }

    if (this.chain > 0) {
      const chained = enemies
        .filter((enemy) => !enemy.dead && enemy !== this.target)
        .sort((a, b) => dist(this.x, this.y, a.x, a.y) - dist(this.x, this.y, b.x, b.y))
        .slice(0, this.chain);

      chained.forEach((enemy, index) => {
        if (dist(this.x, this.y, enemy.x, enemy.y) <= 130) {
          enemy.takeDamage(this.damage * Math.pow(0.68, index + 1));
          spawnZap(this.x, this.y, enemy.x, enemy.y, this.color);
        }
      });
    }

    spawnBurst(this.x, this.y, this.color, 6, 1.2);
  }

  draw() {
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 10;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
  }
}

class Particle {
  constructor(x, y, options = {}) {
    this.x = x;
    this.y = y;
    this.vx = options.vx || 0;
    this.vy = options.vy || 0;
    this.life = options.life || 0.6;
    this.maxLife = this.life;
    this.size = options.size || 2;
    this.color = options.color || "#ffffff";
    this.grow = options.grow || 0;
    this.alpha = options.alpha ?? 1;
    this.dead = false;
    this.shape = options.shape || "dot";
    this.x2 = options.x2 || x;
    this.y2 = options.y2 || y;
  }

  update(dt) {
    this.life -= dt;
    if (this.life <= 0) {
      this.dead = true;
      return;
    }
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }

  draw() {
    const fade = clamp(this.life / this.maxLife, 0, 1) * this.alpha;

    ctx.save();
    ctx.globalAlpha = fade;
    ctx.strokeStyle = this.color;
    ctx.fillStyle = this.color;

    if (this.shape === "ring") {
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size + this.grow * (1 - fade), 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.shape === "zap") {
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x2, this.y2);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size + this.grow * (1 - fade), 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

function spawnBurst(x, y, color, count = 8, force = 1) {
  for (let i = 0; i < count; i += 1) {
    particles.push(
      new Particle(x, y, {
        vx: rand(-120, 120) * force,
        vy: rand(-120, 120) * force,
        life: rand(0.25, 0.7),
        size: rand(1.5, 4),
        grow: rand(2, 8),
        color,
      })
    );
  }
}

function spawnRing(x, y, color, radius) {
  particles.push(
    new Particle(x, y, {
      life: 0.45,
      size: radius,
      grow: radius * 0.75,
      color,
      shape: "ring",
      alpha: 0.7,
    })
  );
}

function spawnZap(x1, y1, x2, y2, color) {
  particles.push(
    new Particle(x1, y1, {
      life: 0.12,
      color,
      shape: "zap",
      x2,
      y2,
      alpha: 0.9,
    })
  );
}

function addMessage(text, tone = "accent") {
  messages.unshift({ text, tone });
  messages = messages.slice(0, 10);
  eventLogEl.innerHTML = messages
    .map((entry) => `<div class="log-entry ${entry.tone}">${entry.text}</div>`)
    .join("");
}

function setupInstallPrompt() {
  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("./sw.js").catch(() => {
        addMessage("Não foi possível ativar o modo offline nesta sessão.", "warn");
      });
    });
  }

  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstallPrompt = event;
    installBtn.textContent = "Instalar app";
  });

  window.addEventListener("appinstalled", () => {
    deferredInstallPrompt = null;
    installBtn.textContent = "Instalado ✓";
    installBtn.disabled = true;
    addMessage("Última Muralha foi instalada no aparelho.", "good");
  });
}

async function installGame() {
  if (deferredInstallPrompt) {
    deferredInstallPrompt.prompt();
    await deferredInstallPrompt.userChoice;
    return;
  }

  addMessage("No celular, use o menu do navegador e toque em 'Adicionar à tela inicial'.", "accent");
}

function getSelectedPhaseConfig() {
  return phaseConfigs[state.selectedPhase] || phaseConfigs.alpha;
}

function getSelectedDifficultyConfig() {
  return difficultyConfigs[state.selectedDifficulty] || difficultyConfigs.standard;
}

function applyPhaseConfig(phaseKey) {
  const phase = phaseConfigs[phaseKey] || phaseConfigs.alpha;
  path = phase.path.map((point) => ({ ...point }));
  buildSpots = phase.buildSpots.map((spot, index) => ({
    ...spot,
    id: index + 1,
    radius: 22,
    occupiedBy: null,
  }));
}

function renderMenuOptions() {
  phaseButtonsEl.innerHTML = Object.entries(phaseConfigs)
    .map(([key, phase]) => {
      const active = state.selectedPhase === key ? "active" : "";
      return `<button class="menu-chip ${active}" data-phase="${key}">${phase.label}</button>`;
    })
    .join("");

  difficultyButtonsEl.innerHTML = Object.entries(difficultyConfigs)
    .map(([key, difficulty]) => {
      const active = state.selectedDifficulty === key ? "active" : "";
      return `<button class="menu-chip ${active}" data-difficulty="${key}">${difficulty.label}</button>`;
    })
    .join("");

  phaseButtonsEl.querySelectorAll("[data-phase]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedPhase = button.dataset.phase;
      if (!state.started || state.gameOver) {
        resetGame(true);
      } else {
        renderMenuOptions();
      }
    });
  });

  difficultyButtonsEl.querySelectorAll("[data-difficulty]").forEach((button) => {
    button.addEventListener("click", () => {
      state.selectedDifficulty = button.dataset.difficulty;
      if (!state.started || state.gameOver) {
        resetGame(true);
      } else {
        renderMenuOptions();
      }
    });
  });
}

function setSelectedBuild(key) {
  state.selectedBuild = key;
  renderTowerButtons();
  updatePanels();
}

function renderTowerButtons() {
  towerButtonsEl.innerHTML = Object.entries(towerTypes)
    .map(([key, tower]) => {
      const active = state.selectedBuild === key ? "active" : "";
      return `
        <button class="tower-button ${active}" data-key="${key}">
          <div class="tower-top">
            <span class="tower-name">
              <span class="tower-dot" style="color:${tower.color}; background:${tower.color};"></span>
              ${tower.label}
            </span>
            <span class="tower-cost">${tower.cost}g</span>
          </div>
          <div class="tower-desc">${tower.description}</div>
        </button>
      `;
    })
    .join("");

  mobileTowerButtonsEl.innerHTML = Object.entries(towerTypes)
    .map(([key, tower], index) => {
      const active = state.selectedBuild === key ? "active" : "";
      return `
        <button class="mobile-tower-chip ${active}" data-key="${key}">
          ${index + 1}. ${tower.label}<br /><small>${tower.cost}g</small>
        </button>
      `;
    })
    .join("");

  document.querySelectorAll("[data-key]").forEach((button) => {
    button.addEventListener("click", () => setSelectedBuild(button.dataset.key));
  });
}

function getSelectedTower() {
  return towers.find((tower) => tower.id === state.selectedTowerId) || null;
}

function getWaveModifier(waveNumber) {
  if (waveNumber % 7 === 0) {
    return {
      key: "swarm",
      label: "Enxame crítico",
      description: "Mais alvos e intervalo reduzido.",
      extraSpawns: 4,
      delayScale: 0.82,
      rewardBonus: 1.18,
      hpScale: 1.05,
      speedScale: 1,
      shieldScale: 1,
    };
  }

  if (waveNumber % 6 === 0) {
    return {
      key: "fortified",
      label: "Blindagem pesada",
      description: "Inimigos entram com cascos reforçados.",
      extraSpawns: 0,
      delayScale: 1,
      rewardBonus: 1.15,
      hpScale: 1.28,
      speedScale: 1,
      shieldScale: 1.45,
    };
  }

  if (waveNumber % 4 === 0) {
    return {
      key: "rush",
      label: "Investida relâmpago",
      description: "Velocidade inimiga aumentada em toda a rota.",
      extraSpawns: 0,
      delayScale: 0.9,
      rewardBonus: 1.1,
      hpScale: 1,
      speedScale: 1.22,
      shieldScale: 1,
    };
  }

  return {
    key: "standard",
    label: "Patrulha padrão",
    description: "Sem bônus especiais nesta leitura.",
    extraSpawns: 0,
    delayScale: 1,
    rewardBonus: 1,
    hpScale: 1,
    speedScale: 1,
    shieldScale: 1,
  };
}

function getWavePreviewHtml(waveNumber) {
  const phase = getSelectedPhaseConfig();
  const safeWave = Math.min(waveNumber, phase.totalWaves);
  const modifier = getWaveModifier(safeWave);
  const threats = ["Sprinter"];
  if (safeWave >= 2) threats.push("Juggernaut");
  if (safeWave >= 3) threats.push("Wisp");
  if (safeWave >= 4) threats.push("Splitter");
  if (safeWave >= 5) threats.push("Phantom");

  return `
    <div class="preview-title">Rodada ${safeWave}/${phase.totalWaves}</div>
    <p>${modifier.description}</p>
    <div class="preview-tags">
      <span class="preview-tag modifier">${modifier.label}</span>
      ${safeWave % 5 === 0 ? '<span class="preview-tag boss">Chefe Titan</span>' : ""}
      <span class="preview-tag">Meta: ${phase.totalWaves} rodadas</span>
    </div>
    <p><strong>Ameaças:</strong> ${threats.join(", ")}</p>
  `;
}

function updateBossHud() {
  const boss = enemies
    .filter((enemy) => !enemy.dead && enemy.typeKey === "titan")
    .sort((a, b) => b.hp - a.hp)[0];

  if (!boss) {
    bossHud.hidden = true;
    bossBarFillEl.style.width = "0%";
    return;
  }

  bossHud.hidden = false;
  bossNameEl.textContent = `${boss.label} • ${Math.max(0, Math.ceil(boss.hp))}/${boss.maxHp}`;
  bossBarFillEl.style.width = `${clamp((boss.hp / boss.maxHp) * 100, 0, 100)}%`;
}

function toggleSpeed() {
  if (!state.started || state.gameOver) return;
  state.speedMultiplier = state.speedMultiplier === 1 ? 1.8 : 1;
  addMessage(`Velocidade da simulação: x${state.speedMultiplier === 1 ? "1.0" : "1.8"}.`, "accent");
  updatePanels();
}

function toggleAutoWave() {
  if (!state.started || state.gameOver) return;
  const phase = getSelectedPhaseConfig();
  state.autoWaveEnabled = !state.autoWaveEnabled;
  state.autoWaveTimer = state.autoWaveEnabled && !state.waveActive && state.wave < phase.totalWaves ? 1.4 : 0;
  addMessage(
    state.autoWaveEnabled ? "Auto rodada ativado. As próximas ondas iniciarão sozinhas." : "Auto rodada desativado.",
    "accent"
  );
  updatePanels();
}

function updatePanels() {
  const phase = getSelectedPhaseConfig();
  const difficulty = getSelectedDifficultyConfig();

  goldEl.textContent = state.gold;
  livesEl.textContent = state.lives;
  waveEl.textContent = `${state.wave}/${phase.totalWaves}`;
  scoreEl.textContent = state.score;
  chargeEl.textContent = `${Math.round(state.overcharge)}%`;
  nextWavePreviewEl.innerHTML = `${getWavePreviewHtml(state.wave + 1)}<p><strong>Mapa:</strong> ${phase.label}<br /><strong>Modo:</strong> ${difficulty.label}</p>`;
  speedBtn.textContent = state.speedMultiplier === 1 ? "Velocidade x1" : "Velocidade x1.8";
  speedBtn.classList.toggle("active-toggle", state.speedMultiplier > 1);
  speedBtn.disabled = !state.started || state.gameOver;
  autoWaveBtn.textContent = state.autoWaveEnabled ? "Auto rodada: on" : "Auto rodada: off";
  autoWaveBtn.classList.toggle("active-toggle", state.autoWaveEnabled);
  autoWaveBtn.disabled = !state.started || state.gameOver;
  mobileSpeedBtn.textContent = state.speedMultiplier === 1 ? "Velocidade" : "x1.8";
  mobileSpeedBtn.disabled = !state.started || state.gameOver;
  mobileAutoBtn.textContent = state.autoWaveEnabled ? "Auto on" : "Auto";
  mobileAutoBtn.disabled = !state.started || state.gameOver;
  if (!installBtn.disabled) {
    installBtn.textContent = deferredInstallPrompt ? "Instalar app" : "Baixar no celular";
  }

  if (state.pendingAbility) {
    statusHintEl.textContent = "Clique em qualquer ponto do mapa para disparar o pulso orbital.";
  } else if (state.paused) {
    statusHintEl.textContent = "Simulação pausada. Pressione P para retomar.";
  } else if (state.waveActive) {
    statusHintEl.textContent = `Condição atual: ${state.waveModifier?.label || "Patrulha padrão"}.`;
  } else {
    statusHintEl.textContent = "Escolha uma torre e clique nos círculos do mapa para construir.";
  }

  waveStatusEl.textContent = state.waveActive
    ? `Rodada ${state.wave}/${phase.totalWaves} • ${state.waveModifier?.label || "em andamento"}`
    : state.wave >= phase.totalWaves
      ? `Fase concluída: ${phase.totalWaves}/${phase.totalWaves}`
      : `Próxima rodada: ${Math.min(state.wave + 1, phase.totalWaves)}/${phase.totalWaves}`;
  startWaveBtn.disabled = !state.started || state.waveActive || state.gameOver;
  abilityBtn.disabled = !state.pendingAbility && state.overcharge < 100;
  abilityBtn.textContent = state.pendingAbility ? "Clique no mapa" : `Pulso orbital (${Math.round(state.overcharge)}%)`;
  mobileWaveBtn.disabled = startWaveBtn.disabled;
  mobileAbilityBtn.disabled = abilityBtn.disabled;
  mobileAutoBtn.classList.toggle("active-toggle", state.autoWaveEnabled);
  mobileWaveBtn.textContent = state.waveActive ? "Rolando" : "Onda";
  mobileAbilityBtn.textContent = state.pendingAbility ? "Toque mapa" : "Pulso";
  updateBossHud();

  const tower = getSelectedTower();
  if (!tower) {
    selectedTowerInfoEl.className = "selected-info empty-state";
    selectedTowerInfoEl.innerHTML = "Clique em uma torre já construída para ver os detalhes.";
    upgradeBtn.disabled = true;
    sellBtn.disabled = true;
    return;
  }

  const stats = tower.getStats();
  const nextCost = tower.level < 3 ? tower.upgradeCost() : null;
  selectedTowerInfoEl.className = "selected-info";
  selectedTowerInfoEl.innerHTML = `
    <h3>
      <span>${stats.label}</span>
      <span>Nível ${tower.level}</span>
    </h3>
    <p>${stats.description}</p>
    <ul>
      <li>Dano: ${stats.damage}</li>
      <li>Alcance: ${stats.range}</li>
      <li>Recarga: ${stats.reload.toFixed(2)}s</li>
      <li>Valor de venda: ${tower.sellValue()}g</li>
      ${stats.splash ? `<li>Explosão: ${stats.splash}px</li>` : ""}
      ${stats.slow ? `<li>Lentidão: ${Math.round((1 - stats.slow) * 100)}%</li>` : ""}
      ${stats.burn ? `<li>Queima: ${stats.burn}/s</li>` : ""}
      ${stats.chain ? `<li>Corrente: ${stats.chain} alvos</li>` : ""}
      ${stats.supportBoost ? `<li>Bônus do Nexus: +${Math.round(stats.supportBoost * 12)}% dano</li>` : ""}
      ${stats.supportBoost ? `<li>Alcance extra: +${Math.round(stats.supportBoost * 7)}%</li>` : ""}
      ${stats.support ? `<li>Aura: +${Math.round(stats.auraDamageBoost * 100)}% dano / +${Math.round(stats.auraRangeBoost * 100)}% alcance</li>` : ""}
      ${stats.support ? `<li>Carga tática: +${(0.8 * tower.level).toFixed(1)} de sobrecarga por pulso</li>` : ""}
    </ul>
  `;

  upgradeBtn.disabled = tower.level >= 3 || state.gold < tower.upgradeCost();
  upgradeBtn.textContent = tower.level >= 3 ? "Nível máximo" : `Melhorar (${nextCost}g)`;
  sellBtn.disabled = false;
  sellBtn.textContent = `Vender (+${tower.sellValue()}g)`;
}

function buildWave(waveNumber) {
  const queue = [];
  const modifier = state.waveModifier || getWaveModifier(waveNumber);
  const total = 7 + waveNumber * 2 + (modifier.extraSpawns || 0);
  const baseDelay = Math.max(0.22, (0.76 - waveNumber * 0.02) * (modifier.delayScale || 1));

  for (let i = 0; i < total; i += 1) {
    const roll = Math.random();
    let key = "scout";

    if (waveNumber === 1) {
      key = "scout";
    } else if (waveNumber === 2) {
      key = roll < 0.68 ? "scout" : "brute";
    } else if (waveNumber === 3) {
      key = roll < 0.45 ? "scout" : roll < 0.8 ? "brute" : "wisp";
    } else if (waveNumber === 4) {
      key = roll < 0.38 ? "scout" : roll < 0.66 ? "brute" : roll < 0.86 ? "wisp" : "splitter";
    } else {
      key = roll < 0.18 ? "scout" : roll < 0.42 ? "brute" : roll < 0.62 ? "wisp" : roll < 0.82 ? "splitter" : "phantom";
    }

    if (waveNumber > 5 && i % 4 === 0) key = "phantom";
    if (waveNumber > 6 && i % 5 === 0) key = "splitter";
    if (waveNumber > 8 && i % 6 === 0) key = "wisp";

    queue.push({ key, delay: baseDelay + Math.random() * 0.18 });
  }

  if (waveNumber % 3 === 0) {
    queue.unshift({ key: waveNumber > 4 ? "phantom" : "wisp", delay: 0.3 });
    queue.push({ key: "brute", delay: 0.4 });
  }

  if (waveNumber % 5 === 0) {
    queue.unshift({ key: "phantom", delay: 0.26 });
    queue.push({ key: "titan", delay: 1.2 });
  }

  return queue;
}

function spawnEnemy(typeKey, bonusScale = 1, options = {}) {
  const waveScale = 1 + Math.max(0, state.wave - 1) * 0.17;
  enemies.push(new Enemy(typeKey, waveScale * bonusScale, { ...options, modifier: state.waveModifier }));
}

function startWave() {
  const phase = getSelectedPhaseConfig();
  if (!state.started || state.gameOver) return;
  if (state.waveActive) {
    addMessage("A onda atual ainda não terminou.", "warn");
    return;
  }

  if (state.wave >= phase.totalWaves) {
    addMessage("Esta fase já foi concluída. Escolha outra missão ou reinicie.", "good");
    return;
  }

  state.autoWaveTimer = 0;
  state.wave += 1;
  state.waveModifier = getWaveModifier(state.wave);
  state.waveActive = true;
  state.spawnQueue = buildWave(state.wave);
  state.spawnTimer = 0.3;
  state.overcharge = clamp(state.overcharge + 6, 0, 100);

  const bossAlert = state.wave % 5 === 0;
  addMessage(
    bossAlert ? `ALERTA: assinatura Titan detectada na rodada ${state.wave}.` : `Rodada ${state.wave}/${phase.totalWaves} iniciada. Prepare a defesa.`,
    bossAlert ? "warn" : "accent"
  );

  if (state.waveModifier.key !== "standard") {
    addMessage(`Condição especial: ${state.waveModifier.label} — ${state.waveModifier.description}`, "accent");
  }

  updatePanels();
}

function finishWave() {
  if (!state.waveActive) return;
  const phase = getSelectedPhaseConfig();
  const difficulty = getSelectedDifficultyConfig();

  state.waveActive = false;
  const reward = Math.round((24 + state.wave * 6) * (state.waveModifier?.rewardBonus || 1) * difficulty.rewardScale);
  state.gold += reward;
  state.score += 120 + state.wave * 20;
  state.overcharge = clamp(state.overcharge + 12, 0, 100);
  addMessage(`Rodada ${state.wave}/${phase.totalWaves} concluída. Recompensa: +${reward}g.`, "good");
  state.waveModifier = null;

  if (state.wave >= phase.totalWaves) {
    triggerVictory();
    return;
  }

  if (state.autoWaveEnabled) {
    state.autoWaveTimer = 2.1;
    addMessage("Próxima rodada será iniciada automaticamente.", "accent");
  }

  updatePanels();
}

function toggleAbilityMode() {
  if (state.gameOver || !state.started) return;
  if (state.pendingAbility) {
    state.pendingAbility = false;
  } else if (state.overcharge >= 100) {
    state.pendingAbility = true;
    addMessage("Pulso orbital pronto. Escolha um ponto no mapa.", "accent");
  } else {
    addMessage("Sobrecarga insuficiente para ativar o pulso orbital.", "warn");
  }
  updatePanels();
}

function castOrbitalPulse(x, y) {
  if (state.overcharge < 100) return;
  state.pendingAbility = false;
  state.overcharge = 0;
  addMessage("Pulso orbital disparado com sucesso.", "good");
  spawnRing(x, y, "#9beeff", 40);
  spawnBurst(x, y, "#9beeff", 28, 2.2);

  for (const enemy of enemies) {
    if (enemy.dead) continue;
    const d = dist(x, y, enemy.x, enemy.y);
    if (d <= 150) {
      const multiplier = clamp(1 - d / 180, 0.4, 1);
      enemy.takeDamage(160 * multiplier);
      enemy.applySlow(0.45, 2.5);
    }
  }

  updatePanels();
}

function triggerVictory() {
  const phase = getSelectedPhaseConfig();
  const difficulty = getSelectedDifficultyConfig();

  state.gameOver = true;
  state.waveActive = false;
  state.pendingAbility = false;
  overlay.hidden = false;
  overlayTitle.textContent = `${phase.label} concluída`;
  overlayText.textContent = `Parabéns. Você venceu ${phase.totalWaves} rodadas no modo ${difficulty.label} e somou ${state.score} pontos.`;
  overlayAction.textContent = "Jogar novamente";
  renderMenuOptions();
  addMessage("Vitória total. A fase foi concluída com sucesso.", "good");
}

function triggerGameOver() {
  const phase = getSelectedPhaseConfig();
  const difficulty = getSelectedDifficultyConfig();

  state.gameOver = true;
  state.waveActive = false;
  state.pendingAbility = false;
  overlay.hidden = false;
  overlayTitle.textContent = "Núcleo destruído";
  overlayText.textContent = `Você caiu em ${phase.label} no modo ${difficulty.label}, segurou até a rodada ${state.wave}/${phase.totalWaves} e marcou ${state.score} pontos. Ajuste a estratégia e tente de novo.`;
  overlayAction.textContent = "Reiniciar missão";
  renderMenuOptions();
  addMessage("A defesa caiu. O núcleo foi perdido.", "warn");
}

function resetGame(showOverlay = true) {
  const selectedPhase = state.selectedPhase || "alpha";
  const selectedDifficulty = state.selectedDifficulty || "standard";
  const selectedBuild = state.selectedBuild || "bolt";

  Object.assign(state, createDefaultState(), {
    selectedPhase,
    selectedDifficulty,
    selectedBuild,
  });

  const phase = getSelectedPhaseConfig();
  const difficulty = getSelectedDifficultyConfig();

  applyPhaseConfig(state.selectedPhase);
  towers = [];
  enemies = [];
  projectiles = [];
  particles = [];
  messages = [];
  nextTowerId = 1;
  state.gold = Math.max(90, phase.startGold + difficulty.goldBonus);
  state.lives = Math.max(8, phase.startLives + difficulty.livesBonus);
  state.overcharge = difficulty.overcharge;

  buildSpots.forEach((spot) => {
    spot.occupiedBy = null;
  });

  overlay.hidden = !showOverlay;
  overlayTitle.textContent = phase.label;
  overlayText.textContent = `${phase.description} Modo atual: ${difficulty.label}. Objetivo: vencer ${phase.totalWaves} rodadas.`;
  overlayAction.textContent = "Iniciar defesa";
  renderMenuOptions();
  renderTowerButtons();
  addMessage(`Missão carregada: ${phase.label} (${difficulty.label}).`, "accent");
  updatePanels();
}

function getMousePosition(event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  };
}

function getTouchPosition(touch) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((touch.clientX - rect.left) / rect.width) * canvas.width,
    y: ((touch.clientY - rect.top) / rect.height) * canvas.height,
  };
}

function updateHoveredSpot(x, y) {
  const hovered = buildSpots.find((spot) => dist(x, y, spot.x, spot.y) <= spot.radius);
  state.hoveredSpotId = hovered ? hovered.id : null;
}

function handleCanvasInteraction(x, y) {
  if (!state.started || state.gameOver) return;

  state.cursor = { x, y };

  if (state.pendingAbility) {
    castOrbitalPulse(x, y);
    return;
  }

  const clickedSpot = buildSpots.find((spot) => dist(x, y, spot.x, spot.y) <= spot.radius);

  if (!clickedSpot) {
    state.selectedTowerId = null;
    updatePanels();
    return;
  }

  if (clickedSpot.occupiedBy) {
    state.selectedTowerId = clickedSpot.occupiedBy;
    updatePanels();
    return;
  }

  const buildType = state.selectedBuild;
  const towerDef = towerTypes[buildType];
  if (!towerDef) return;

  if (state.gold < towerDef.cost) {
    addMessage(`Ouro insuficiente para construir ${towerDef.label}.`, "warn");
    return;
  }

  const tower = new Tower(clickedSpot, buildType);
  towers.push(tower);
  clickedSpot.occupiedBy = tower.id;
  state.gold -= towerDef.cost;
  state.selectedTowerId = tower.id;
  state.score += 8;
  addMessage(`${towerDef.label} construída com sucesso.`, "good");
  updatePanels();
}

canvas.addEventListener("mousemove", (event) => {
  const mouse = getMousePosition(event);
  state.cursor = mouse;
  updateHoveredSpot(mouse.x, mouse.y);
});

canvas.addEventListener("touchmove", (event) => {
  if (!event.touches.length) return;
  const touch = getTouchPosition(event.touches[0]);
  state.cursor = touch;
  updateHoveredSpot(touch.x, touch.y);
}, { passive: true });

canvas.addEventListener("mouseleave", () => {
  state.hoveredSpotId = null;
});

canvas.addEventListener("click", (event) => {
  const mouse = getMousePosition(event);
  handleCanvasInteraction(mouse.x, mouse.y);
});

canvas.addEventListener("touchstart", (event) => {
  if (!event.touches.length) return;
  event.preventDefault();
  const touch = getTouchPosition(event.touches[0]);
  handleCanvasInteraction(touch.x, touch.y);
}, { passive: false });

startWaveBtn.addEventListener("click", startWave);
abilityBtn.addEventListener("click", toggleAbilityMode);
speedBtn.addEventListener("click", toggleSpeed);
autoWaveBtn.addEventListener("click", toggleAutoWave);
installBtn.addEventListener("click", installGame);
mobileWaveBtn.addEventListener("click", startWave);
mobileAbilityBtn.addEventListener("click", toggleAbilityMode);
mobileSpeedBtn.addEventListener("click", toggleSpeed);
mobileAutoBtn.addEventListener("click", toggleAutoWave);
restartBtn.addEventListener("click", () => {
  resetGame(false);
  state.started = true;
  updatePanels();
});

upgradeBtn.addEventListener("click", () => {
  const tower = getSelectedTower();
  if (!tower) return;
  if (tower.level >= 3) {
    addMessage("Esta torre já está no nível máximo.", "warn");
    return;
  }

  const cost = tower.upgradeCost();
  if (state.gold < cost) {
    addMessage("Ouro insuficiente para melhorar esta torre.", "warn");
    return;
  }

  state.gold -= cost;
  tower.level += 1;
  addMessage(`${tower.getStats().label} melhorada para nível ${tower.level}.`, "good");
  updatePanels();
});

sellBtn.addEventListener("click", () => {
  const tower = getSelectedTower();
  if (!tower) return;

  const refund = tower.sellValue();
  state.gold += refund;
  const spot = buildSpots.find((item) => item.id === tower.spotId);
  if (spot) spot.occupiedBy = null;
  towers = towers.filter((item) => item.id !== tower.id);
  state.selectedTowerId = null;
  addMessage(`Torre vendida por ${refund}g.`, "warn");
  updatePanels();
});

overlayAction.addEventListener("click", () => {
  if (state.gameOver) {
    resetGame(false);
  }
  state.started = true;
  overlay.hidden = true;
  addMessage("Defesa ativada. Aguarde sua primeira ordem.", "accent");
  updatePanels();
});

document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  if (["1", "2", "3", "4", "5", "6"].includes(event.key)) {
    const keys = ["bolt", "cannon", "frost", "ember", "rail", "beacon"];
    state.selectedBuild = keys[Number(event.key) - 1];
    renderTowerButtons();
    updatePanels();
  }

  if (key === "n") startWave();
  if (key === "f") toggleAbilityMode();
  if (key === "v") toggleSpeed();
  if (key === "a") toggleAutoWave();

  if (key === "p" && state.started && !state.gameOver) {
    state.paused = !state.paused;
    addMessage(state.paused ? "Simulação pausada." : "Simulação retomada.", "accent");
    updatePanels();
  }
});

function update(dt) {
  if (!state.started || state.paused || state.gameOver) {
    updatePanels();
    return;
  }

  const phase = getSelectedPhaseConfig();
  const simDt = dt * state.speedMultiplier;
  state.overcharge = clamp(state.overcharge + simDt * 0.9, 0, 100);

  if (!state.waveActive && state.autoWaveEnabled && state.wave < phase.totalWaves) {
    state.autoWaveTimer -= simDt;
    if (state.autoWaveTimer <= 0) {
      startWave();
    }
  }

  if (state.waveActive) {
    state.spawnTimer -= simDt;
    while (state.spawnTimer <= 0 && state.spawnQueue.length > 0) {
      const next = state.spawnQueue.shift();
      spawnEnemy(next.key);
      state.spawnTimer += next.delay;
    }
  }

  towers.forEach((tower) => tower.update(simDt));
  projectiles.forEach((projectile) => projectile.update(simDt));
  enemies.forEach((enemy) => enemy.update(simDt));
  particles.forEach((particle) => particle.update(simDt));

  projectiles = projectiles.filter((projectile) => !projectile.dead);
  enemies = enemies.filter((enemy) => !enemy.dead);
  particles = particles.filter((particle) => !particle.dead);

  if (state.waveActive && state.spawnQueue.length === 0 && enemies.length === 0) {
    finishWave();
  }

  updatePanels();
}

function drawBackground() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  gradient.addColorStop(0, "#07111b");
  gradient.addColorStop(1, "#040910");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "rgba(124, 191, 255, 0.08)";
  ctx.lineWidth = 1;
  for (let x = 0; x <= canvas.width; x += 40) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += 40) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
}

function drawPath() {
  if (!path.length) return;

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#1a2a3d";
  ctx.lineWidth = 52;
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i += 1) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.stroke();

  ctx.strokeStyle = "rgba(113, 217, 255, 0.28)";
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  for (let i = 1; i < path.length; i += 1) {
    ctx.lineTo(path[i].x, path[i].y);
  }
  ctx.stroke();

  const base = path[path.length - 1];
  const baseX = clamp(base.x - 118, canvas.width - 150, canvas.width - 98);
  const baseY = clamp(base.y - 55, 16, canvas.height - 126);
  ctx.fillStyle = "#132536";
  ctx.fillRect(baseX, baseY, 90, 110);
  ctx.strokeStyle = "rgba(105, 240, 174, 0.6)";
  ctx.lineWidth = 3;
  ctx.strokeRect(baseX, baseY, 90, 110);
  ctx.fillStyle = "#69f0ae";
  ctx.font = "bold 16px Inter, sans-serif";
  ctx.textAlign = "center";
  ctx.fillText("NÚCLEO", baseX + 45, baseY + 61);
}

function drawBuildSpots() {
  for (const spot of buildSpots) {
    const hovered = spot.id === state.hoveredSpotId;
    const occupied = Boolean(spot.occupiedBy);

    ctx.beginPath();
    ctx.arc(spot.x, spot.y, spot.radius, 0, Math.PI * 2);
    ctx.fillStyle = occupied
      ? "rgba(105, 240, 174, 0.14)"
      : hovered
        ? "rgba(112, 216, 255, 0.16)"
        : "rgba(255, 255, 255, 0.04)";
    ctx.fill();
    ctx.lineWidth = occupied ? 2.5 : 2;
    ctx.strokeStyle = occupied ? "rgba(105, 240, 174, 0.6)" : "rgba(124, 191, 255, 0.3)";
    ctx.stroke();
  }
}

function drawTopLabel() {
  const phase = getSelectedPhaseConfig();
  ctx.fillStyle = "rgba(255,255,255,0.8)";
  ctx.font = "bold 15px Inter, sans-serif";
  ctx.textAlign = "left";
  ctx.fillText(`${phase.label} • ${state.waveActive ? `Onda ${state.wave}` : `Preparação para onda ${state.wave + 1}`}`, 18, 28);

  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(155, 238, 255, 0.88)";
  ctx.fillText(`Velocidade x${state.speedMultiplier === 1 ? "1.0" : "1.8"}`, canvas.width - 18, 28);

  if (state.waveActive && state.waveModifier) {
    ctx.fillStyle = "rgba(10, 18, 28, 0.78)";
    ctx.fillRect(canvas.width - 250, 38, 228, 28);
    ctx.fillStyle = "#9beeff";
    ctx.fillText(state.waveModifier.label, canvas.width - 26, 58);
  }

  if (state.paused) {
    ctx.fillStyle = "rgba(10, 18, 28, 0.78)";
    ctx.fillRect(canvas.width / 2 - 120, 18, 240, 44);
    ctx.fillStyle = "#9beeff";
    ctx.textAlign = "center";
    ctx.fillText("PAUSADO", canvas.width / 2, 46);
  }
}

function drawScene() {
  drawBackground();
  drawPath();
  drawBuildSpots();

  towers.forEach((tower) => tower.draw());
  projectiles.forEach((projectile) => projectile.draw());
  enemies.forEach((enemy) => enemy.draw());
  particles.forEach((particle) => particle.draw());
  drawTopLabel();
}

function loop(timestamp) {
  const dt = Math.min((timestamp - lastFrame) / 1000, 0.033);
  lastFrame = timestamp;
  update(dt);
  drawScene();
  requestAnimationFrame(loop);
}

setupInstallPrompt();
resetGame();
requestAnimationFrame(loop);
