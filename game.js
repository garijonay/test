import { TUTORIAL_STEPS, STARTER_RELIC } from './content.js';
import { AudioManager } from './audio.js';
import { createUI } from './ui.js';

function createRunState() {
  return {
    time: 0,
    room: 1,
    mode: 'tutorial',
    paused: false,
    canShoot: false,
    objective: TUTORIAL_STEPS[0].objective,
    prompt: TUTORIAL_STEPS[0].prompt,
    tutorialStep: 0,
    tutorialProgress: 0,
    kills: 0,
    gatesPassed: 0,
    playerY: 200,
    playerVY: 0,
    gravity: 1,
    lastFlipAt: 0,
  };
}

class Game {
  constructor() {
    this.canvas = document.getElementById('game');
    this.ctx = this.canvas.getContext('2d');
    this.audio = new AudioManager();
    this.state = createRunState();
    this.ui = createUI(this, this.audio);
    this.last = performance.now();
    this.bind();
    this.resize();
    requestAnimationFrame(this.loop.bind(this));
  }

  bind() {
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('keydown', (e) => {
      if (e.code === 'Space') { e.preventDefault(); this.flip(); }
      if (e.code === 'Escape') { e.preventDefault(); this.togglePause(); }
    });
    window.addEventListener('pointerdown', () => this.flip());
  }

  resize() {
    this.canvas.width = innerWidth;
    this.canvas.height = innerHeight;
  }

  togglePause() { this.state.paused = !this.state.paused; }
  resume() { this.state.paused = false; }
  restartRun() { this.state = createRunState(); }

  flip() {
    if (this.state.paused) return;
    this.state.gravity *= -1;
    this.state.playerVY += 80 * -this.state.gravity;
    this.state.lastFlipAt = this.state.time;
    if (this.state.canShoot) this.audio.playSfx('shoot');
  }

  updateTutorial(dt) {
    if (this.state.tutorialStep === 0) {
      this.state.gatesPassed += dt * 0.5;
      this.state.tutorialProgress = Math.floor(this.state.gatesPassed);
      if (this.state.tutorialProgress >= TUTORIAL_STEPS[0].target) {
        this.state.tutorialStep = 1;
        this.state.objective = TUTORIAL_STEPS[1].objective;
        this.state.prompt = `${TUTORIAL_STEPS[1].prompt} (${STARTER_RELIC.name})`;
      }
    } else if (this.state.tutorialStep === 1) {
      // In production this is tied to upgrade draft selection.
      this.state.canShoot = true;
      this.state.tutorialStep = 2;
      this.state.objective = TUTORIAL_STEPS[2].objective;
      this.state.prompt = TUTORIAL_STEPS[2].prompt;
    } else if (this.state.tutorialStep === 2) {
      this.state.kills += dt * 0.6;
      if (this.state.kills >= TUTORIAL_STEPS[2].target) {
        this.state.mode = 'run';
        this.state.room = 2;
        this.state.objective = 'Clear room enemies';
        this.state.prompt = 'Draft relics and build an archetype.';
      }
    }
  }

  update(dt) {
    if (this.state.paused) return;
    this.state.time += dt;
    this.state.playerVY += 1800 * this.state.gravity * dt;
    this.state.playerY += this.state.playerVY * dt;
    if (this.state.playerY < 24) { this.state.playerY = 24; this.state.playerVY = 0; }
    if (this.state.playerY > innerHeight - 24) { this.state.playerY = innerHeight - 24; this.state.playerVY = 0; }

    if (this.state.mode === 'tutorial') this.updateTutorial(dt);
  }

  draw() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = '#081127';
    ctx.fillRect(0,0,this.canvas.width,this.canvas.height);
    ctx.strokeStyle = 'rgba(138,242,255,.8)';
    ctx.beginPath();
    ctx.arc(this.canvas.width * 0.3, this.state.playerY, 12, 0, Math.PI * 2);
    ctx.stroke();
  }

  loop(now) {
    const dt = Math.min(0.033, (now - this.last) / 1000);
    this.last = now;
    this.update(dt);
    this.draw();
    this.ui.render(this.state);
    requestAnimationFrame(this.loop.bind(this));
  }
}

new Game();
