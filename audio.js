const KEY = 'pulse_settings_v1';

export class AudioManager {
  constructor() {
    this.ctx = null;
    this.master = 0.7;
    this.sfx = 0.8;
    this.music = 0.6;
    this.muted = false;
    this.load();
  }
  load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || '{}');
      this.master = s.master ?? this.master;
      this.sfx = s.sfx ?? this.sfx;
      this.music = s.music ?? this.music;
      this.muted = !!s.muted;
    } catch {}
  }
  save() {
    localStorage.setItem(KEY, JSON.stringify({ master:this.master, sfx:this.sfx, music:this.music, muted:this.muted }));
  }
  toggleMute() { this.muted = !this.muted; this.save(); }
  setLevels({master,sfx,music}) {
    if (master != null) this.master = Number(master);
    if (sfx != null) this.sfx = Number(sfx);
    if (music != null) this.music = Number(music);
    this.save();
  }
  playSfx(_name) {
    // Starter stub: hook WebAudio one-shots here.
  }
}
