export function createUI(game, audio) {
  const objective = document.getElementById('objective');
  const status = document.getElementById('status');
  const prompt = document.getElementById('prompt');
  const pausePanel = document.getElementById('pausePanel');

  const pauseBtn = document.getElementById('pauseBtn');
  const muteBtn = document.getElementById('muteBtn');
  const fullscreenBtn = document.getElementById('fullscreenBtn');
  const resumeBtn = document.getElementById('resumeBtn');
  const restartBtn = document.getElementById('restartBtn');

  const masterVol = document.getElementById('masterVol');
  const sfxVol = document.getElementById('sfxVol');
  const musicVol = document.getElementById('musicVol');

  masterVol.value = audio.master;
  sfxVol.value = audio.sfx;
  musicVol.value = audio.music;

  pauseBtn.onclick = () => game.togglePause();
  resumeBtn.onclick = () => game.resume();
  restartBtn.onclick = () => game.restartRun();
  muteBtn.onclick = () => { audio.toggleMute(); muteBtn.textContent = audio.muted ? 'Unmute' : 'Mute'; };
  fullscreenBtn.onclick = async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  };

  for (const [el,key] of [[masterVol,'master'],[sfxVol,'sfx'],[musicVol,'music']]) {
    el.oninput = () => audio.setLevels({ [key]: el.value });
  }

  return {
    render(state) {
      objective.textContent = `Objective: ${state.objective}`;
      status.textContent = `Room ${state.room} · ${state.mode}`;
      prompt.textContent = state.prompt;
      pausePanel.classList.toggle('hidden', !state.paused);
    }
  };
}
