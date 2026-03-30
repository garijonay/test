# Pulse: Rogue Chaos — Paid Launch Overhaul (itch.io $3.99)

## 1) Brutal commercial assessment
- **Current value estimate:** visually marketable, but not yet defensible as a paid product.
- **Prototype tells:** inconsistent onboarding, mixed objective logic, placeholder-feeling systems, low authored encounter depth, and uneven readability under pressure.
- **Marketable strengths:** strong visual tone, one-button hook, relic/identity fantasy, fast restarts.
- **Likely negative reviews if shipped now:**
  - "Looks cool but shallow after 15 minutes."
  - "Tutorial/controls unclear, deaths feel random."
  - "Systems are hinted but not delivered with enough authored payoff."

## 2) Must-fix launch blockers

| Blocker | Why it matters | Priority | Implementation |
|---|---|---|---|
| State init drift (`time`, cooldowns, run flags) | causes inconsistent behavior/run bugs | P0 | central `createRunState()` factory with defaults + runtime assertions |
| UI mismatch (objective text vs actual win condition) | destroys trust immediately | P0 | objective source of truth in state machine; render from mode enum |
| Pause path incomplete | players need interrupt/recover flow | P0 | hard pause + options + restart + resume + return-to-title |
| Sound/mute as fake affordance | paid users expect functional audio control | P0 | implement WebAudio manager + persisted volume/mute sliders |
| Onboarding ambiguity | first 10 min determines retention | P0 | scripted 3-room tutorial flow with gated prompts |
| Telegraph/readability collisions | "unfair" feeling deaths | P0 | threat budget, clearer silhouette/FX channels, lane hazard timing telegraphs |
| Accessibility/settings missing | wider audience + fewer refunds | P1 | reduced motion, contrast mode, screen shake slider, remappable flip key |
| No robust run summary | no closure/no motivation | P1 | post-run cards: archetype path, key unlocks, mistakes, next goals |

## 3) Codebase restructuring plan

Target:
- `index.html`: shell markup and script/style includes
- `styles.css`: visual system and responsive HUD layout
- `content.js`: enemies/relics/rooms/tutorial script data
- `audio.js`: audio manager, buses, mute/volume persistence
- `ui.js`: panel and HUD rendering + settings bindings
- `game.js`: game loop, state machine, collision, progression

Architecture:
- `content.js` is pure data and content factories.
- `game.js` is pure simulation and emits events (`ROOM_CLEAR`, `PLAYER_HIT`, `ASCEND`).
- `ui.js` subscribes to state/events and updates DOM only.
- `audio.js` subscribes to events and game intensity values.

itch.io packaging:
- ZIP root contains `index.html` + static assets/files.
- No bundler required; use ES modules with relative imports.

## 4) Gameplay depth overhaul

- Relics must change behavior, not only numbers:
  - **Phase Fork**: every 4th flip creates mirrored shot fan.
  - **Debt Engine**: spend HP to overcharge shots; kill refunds partial HP.
  - **Static Mantle**: no shooting for 6s grants shield burst + orbit pulse.
- Archetypes must diverge mechanically:
  - **Cathedral** = precision/perfect windows.
  - **Orbit** = proximity blender + drone geometry.
  - **Void** = tempo manipulation and delayed detonations.
- Ascensions must be authored moments:
  - unique activation camera + temporary rule rewrite + signature end shockwave.
- Enemy set upgrades:
  - Add clear roles: zoning anchor, flank diver, charge sniper, shield relay.
- Bosses:
  - Boss A: lane sculptor (gate/laser phase puzzle).
  - Boss B: mirror overmind (inverts controls windows, rewards calm timing).

## 5) First 10 minutes redesign

1. **Room 1 (Flip only):** pass 4 gates; no enemies, no shooting.
2. **Room 2 (Weapon unlock):** forced starter relic unlocks shooting.
3. **Room 3 (Risk/reward):** introduces chaos meter + one clear hazard family.
4. **Room 4+:** identity terms introduced only after first drafted synergy.

Hide until needed:
- hide ascension panel, meta goals, advanced build hints until room 3.

Tutorial prompt language:
- "Flip to stay in lane."
- "Great. You crossed stable gates."
- "Weapon online. Shots follow flips."
- "Chaos rises faster on perfect flips."

## 6) Readability and feedback polish
- Enemy silhouette families by shape, not color only.
- Telegraph windows: pre-fire lines + pulse countdown.
- Damage channels: player hit = white flash + low thud; enemy death = color pop + high transient.
- Perfect flip: micro slow + centerline spark + strong pitch cue.
- Ascension clarity: full-screen title + temporary palette shift + timer ring near player.
- Clutter control: cap simultaneous projectile count; prioritize dangerous projectile rendering.

## 7) Paid-release threshold ($3.99)
Minimum:
- 2 bosses, 8–12 enemy behaviors, 30+ meaningful relics.
- 3–5 distinct archetypes with authored ascension behavior.
- 20–30 min replay loop with objective unlock path.
- Real SFX + 3 music states (menu/run/boss).
- Polished pause/settings/game-over pipeline.

Current biggest gaps to close first:
1) authored boss content, 2) audio completeness, 3) progression depth, 4) onboarding polish.

## 8) Immediate patch list (next pass)
- [ ] Move to module files (`game.js`, `ui.js`, `audio.js`, `content.js`)
- [ ] Centralize run state factory + assertions
- [ ] Implement full pause menu + restart/title
- [ ] Implement working mute + volume + SFX/music split
- [ ] Finalize tutorial FSM (3-step)
- [ ] Add fullscreen button + persistence
- [ ] Rework objective rendering from mode enum
- [ ] Improve hit/death telegraph timing
- [ ] Add run summary with archetype timeline
- [ ] Expand relic pool with 12 behavior-changing relics

## 9) Starter implementation map
See `index.html`, `game.js`, `ui.js`, `audio.js`, and `content.js` in this commit for a concrete modular baseline with:
- safe state initialization,
- tutorial state machine,
- pause system,
- audio manager,
- settings persistence hooks.
