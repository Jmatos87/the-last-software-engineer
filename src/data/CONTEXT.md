# data/ Context

## cards/ (directory)
`cards: Record<string, CardDef>` — all card definitions keyed by ID, split by class.
- `frontendCards.ts` — Frontend Dev cards (starters, commons, uncommons, rares)
- `backendCards.ts` — Backend Dev cards
- `architectCards.ts` — Architect cards
- `aiEngineerCards.ts` — AI Engineer cards
- `neutralCards.ts` — Neutral cards + curse (available to all classes)
- `helpers.ts` — `getCardDef(id)`, `getRewardCards(count, rarity?, playerClass?, act?, encounterType?)`
- `index.ts` — Barrel: merges all class records into `cards`, re-exports helpers

## characters.ts
`characters: CharacterDef[]` — 3 characters, only Frontend Dev available.
Frontend Dev: 75 HP, 3 energy, 10-card starter deck.

## enemies/ (directory)
`enemies: Record<string, EnemyDef>` — 60 enemies across 3 acts keyed by ID, split by act.
- `act1Enemies.ts` — Act 1 Application Abyss (12 commons, 5 elites, 3 bosses) + encounter tables
- `act2Enemies.ts` — Act 2 Interview Gauntlet (12 commons, 5 elites, 3 bosses) + encounter tables
- `act3Enemies.ts` — Act 3 Corporate Final Round (12 commons, 5 elites, 3 bosses) + encounter tables
- `encounters.ts` — Selection helpers: `getNormalEncounter(act, row, totalRows)`, `getEliteEncounter(act)`, `getBossEncounter(act)` + legacy exports
- `index.ts` — Barrel: merges all act records into `enemies`, re-exports helpers

New move types used: `exhaust`, `buff_allies`, `gold_steal`, `heal_allies`.

## events/ (directory)
`events: EventDef[]` — random events with choices and outcomes, split by category.
- `neutralEvents.ts` — General + risk/reward events (no class restriction)
- `frontendEvents.ts` — Frontend Dev themed events
- `backendEvents.ts` — Backend Dev themed events
- `architectEvents.ts` — Architect themed events
- `aiEngineerEvents.ts` — AI Engineer themed events
- `consumableEvents.ts` — Consumable events (neutral + class-specific)
- `index.ts` — Barrel: concatenates all event arrays into `events`

## items.ts
`items: ItemDef[]` — relics with passive effects (extraEnergy, extraDraw, extraHp, healOnKill, extraGold, bonusDamage, bonusBlock).
`getShopItems()` and `getRewardArtifact(ownedIds, count)` helpers.

## consumables.ts
15 single-use battle items (6 common, 6 uncommon, 3 rare), 3 slots max.
