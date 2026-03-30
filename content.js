export const TUTORIAL_STEPS = [
  { id:'flip_intro', objective:'Pass 4 gates', prompt:'Flip to stay centered in the lane.', target:4 },
  { id:'weapon_unlock', objective:'Pick starter weapon relic', prompt:'Choose Pulse Emitter to unlock shooting.', target:1 },
  { id:'combat_intro', objective:'Defeat 3 enemies', prompt:'Shots fire on flip. Clear the room.', target:3 }
];

export const STARTER_RELIC = {
  id:'pulse_emitter',
  name:'Pulse Emitter',
  description:'Unlocks baseline shooting tied to flips.',
  tags:['starter','projectile']
};

export const ENEMIES = [
  { id:'drone', hp:2, speed:120, shape:'triangle' },
  { id:'sniper', hp:3, speed:80, shape:'diamond' },
  { id:'rammer', hp:2, speed:170, shape:'chevron' }
];
