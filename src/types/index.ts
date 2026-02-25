// ── Consumables ──
export type ConsumableRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type ConsumableTarget = 'self' | 'enemy' | 'all_enemies';

export interface ConsumableEffect {
  damage?: number;
  damageAll?: number;
  heal?: number;
  healFull?: boolean;
  block?: number;
  energy?: number;
  draw?: number;
  stressRelief?: number;
  stressToZero?: boolean;
  addStress?: number;
  applyToSelf?: StatusEffect;
  applyToTarget?: StatusEffect;
  applyToAll?: StatusEffect;
  goldGain?: number;
  addEpicCardsToHand?: number;
  // Class-specific consumable effects
  gainFlow?: number;                   // gain N flow (frontend)
  triggerDetonation?: boolean;         // fire detonation queue immediately (backend)
  advanceBlueprintConsumable?: number; // advance blueprint by N (architect)
  setTemperature?: number;             // set temperature to N (ai_engineer)
}

export interface ConsumableDef {
  id: string;
  name: string;
  description: string;
  rarity: ConsumableRarity;
  icon: string;
  target: ConsumableTarget;
  effect: ConsumableEffect;
  class?: CardClass;  // if set, only drop for matching player class
}

export interface ConsumableInstance extends ConsumableDef {
  instanceId: string;
}

// ── Screen ──
export type Screen =
  | 'CHARACTER_SELECT'
  | 'MAP'
  | 'BATTLE'
  | 'BATTLE_REWARD'
  | 'REST'
  | 'EVENT'
  | 'SHOP'
  | 'GAME_OVER'
  | 'VICTORY';

// ── Cards ──
export type CardType = 'attack' | 'skill' | 'power' | 'curse';
export type CardTarget = 'enemy' | 'self' | 'all_enemies';
export type CardRarity = 'starter' | 'common' | 'rare' | 'epic' | 'legendary' | 'curse';
export type CardClass = 'frontend' | 'backend' | 'architect' | 'ai_engineer';

export interface StatusEffect {
  vulnerable?: number;
  weak?: number;
  confidence?: number;       // "Confidence" — +1 dmg per attack per stack
  resilience?: number;      // "Resilience" — +1 block & stress reduction per stack
  regen?: number;          // "Touch Grass" — heal HP per turn
  poison?: number;
  hope?: number;
  cringe?: number;
  ghosted?: number;
  selfCare?: number;       // reduce stress per turn
  networking?: number;     // draw +1 card per turn per stack
  savingsAccount?: number; // retain up to X block between turns
  counterOffer?: number;   // deal X damage back when hit
  hustleCulture?: number;  // +1 energy per turn, +3 stress per turn per stack
  // Frontend Engineer mechanics
  dodge?: number;           // 10% chance per stack to avoid an incoming hit; consumed on dodge; decrements per turn
  bleed?: number;           // enemy DoT: deal bleed stacks damage at start of player turn, then decrement
  // Backend Engineer mechanics
  burn?: number;            // enemy fire DoT: deal burn stacks damage at start of player turn, then decrement
  primed?: number;          // each stack applied instantly reduces all detonation timers by 1 (min 1); decrements per turn
}

export interface CardEffect {
  damage?: number;
  block?: number;
  draw?: number;
  energy?: number;
  applyToSelf?: StatusEffect;
  applyToTarget?: StatusEffect;
  damageAll?: number;
  applyToAll?: StatusEffect;
  heal?: number;
  copium?: number;
  stress?: number;
  // New effect fields
  times?: number;            // multi-hit: repeat damage X times
  selfDamage?: number;       // deal damage to self
  addStress?: number;        // add stress to self
  gainGold?: number;         // gain gold in combat
  exhaustRandom?: number;    // exhaust random cards from hand
  exhaustFromDraw?: number;  // exhaust cards from draw pile
  healFull?: boolean;        // heal HP to max
  shuffleDiscardToDraw?: boolean;  // shuffle discard pile into draw pile
  exhaustAllHand?: boolean;  // exhaust all cards in hand
  damagePerCardExhausted?: number;  // deal N × (cards exhausted this play) damage to target
  bonusBlockIfHasBlock?: number;    // gain extra block if player already has block
  vulnerableDoubleHit?: boolean;    // deal damage again if target is vulnerable
  discardAfterDraw?: number;        // discard N cards from hand after drawing
  bonusBlockIfCounterOffer?: number; // gain extra block if player has Counter-Offer
  damageEqualToBlock?: boolean;     // deal damage equal to current block to target
  damageAllEqualToBlock?: boolean;  // deal damage equal to current block to ALL enemies
  clearBlock?: boolean;             // set player block to 0 after all effects resolve
  damagePerCardPlayed?: number;     // deal N × cardsPlayedThisTurn to target (combo path)
  damageAllPerCardPlayed?: number;  // deal N × cardsPlayedThisTurn to ALL enemies (combo path)
  nextCardCostZero?: boolean;       // next card played this turn costs 0 (Fast Refresh)
  deploy?: {                        // summon a deployment that acts every turn
    name: string;
    icon: string;
    turns: number;
    attackPerTurn?: number;
    blockPerTurn?: number;
    poisonPerTurn?: number;
  };
  deployMultiple?: Array<{          // summon multiple deployments at once (legendary)
    name: string;
    icon: string;
    turns: number;
    attackPerTurn?: number;
    blockPerTurn?: number;
    poisonPerTurn?: number;
  }>;
  // Temperature mechanic (AI Engineer)
  heatUp?: number;                  // increase temperature by N (overflow at 10: AoE + reset to 5)
  coolDown?: number;                // decrease temperature by N (freeze at 0: big block + reset to 5)
  damageIfHot?: number;             // bonus damage to target if temp ≥ 7
  blockIfCold?: number;             // bonus block if temp ≤ 3
  damageAllIfHot?: number;          // bonus damage to ALL enemies if temp ≥ 7
  // Token Economy mechanic (AI Engineer)
  generateTokens?: number;          // add N tokens (persist across turns)
  doubleTokens?: boolean;           // tokens × 2
  damagePerToken?: boolean;         // deal damage = tokens to target, tokens → 0
  blockPerToken?: boolean;          // gain block = tokens, tokens → 0
  damageAllPerToken?: boolean;      // deal floor(tokens × 0.5) to ALL enemies, tokens → 0
  // Training Loop mechanic (AI Engineer)
  damagePerTimesPlayed?: number;    // deal N × playCount bonus damage to target
  damageAllPerTimesPlayed?: number; // deal N × playCount bonus damage to ALL enemies
  blockPerTimesPlayed?: number;     // gain N × playCount bonus block
  bonusAtSecondPlay?: { damage?: number; block?: number; draw?: number; copium?: number; energy?: number };
  // Flow State mechanic (Frontend Engineer)
  gainExtraFlow?: number;           // gain N extra flow on play (beyond the automatic +1 per card)
  damageIfFlowHigh?: number;        // bonus damage to target if flow >= 5
  damageAllIfFlowHigh?: number;     // bonus damage to ALL enemies if flow >= 5
  damagePerBleed?: number;          // deal N × target's current bleed stacks as bonus damage
  reduceNextCardCost?: number;      // reduce the next card played this turn by N energy (min 0)
  doubleTargetBleed?: boolean;      // double all bleed stacks on target
  // Backend Engineer — Detonation Queue mechanics
  queueBlock?: number;              // queue N block for next turn (ice detonation, fast/1-turn)
  queueDamageAll?: number;          // queue N AoE damage to all enemies for next turn (fire detonation, fast/1-turn)
  queueChain?: number;              // queue N damage to each enemy for next turn (lightning detonation, fast/1-turn)
  queueBurn?: number;               // queue burn application to all enemies for next turn (fire advanced, fast/1-turn)
  // Tiered queue variants (existing queueX = fast/1-turn)
  queueBlockQuick?: number;        // ice block, fires in 2 turns
  queueBlockDelayed?: number;      // ice block, fires in 3 turns
  queueBlockCharged?: number;      // ice block, fires in 4 turns
  queueDamageAllQuick?: number;    // fire AoE, fires in 2 turns
  queueDamageAllDelayed?: number;  // fire AoE, fires in 3 turns
  queueDamageAllCharged?: number;  // fire AoE, fires in 4 turns
  queueDamage?: number;            // fire single-target, fires in 1 turn
  queueDamageQuick?: number;       // fire single-target, fires in 2 turns
  queueDamageDelayed?: number;     // fire single-target, fires in 3 turns
  queueDamageCharged?: number;     // fire single-target, fires in 4 turns
  queueChainQuick?: number;        // lightning chain, fires in 2 turns
  queueChainDelayed?: number;      // lightning chain, fires in 3 turns
  queueChainCharged?: number;      // lightning chain, fires in 4 turns
  queueBurnDelayed?: number;       // fire burn AoE, fires in 3 turns
  queueBurnCharged?: number;       // fire burn AoE, fires in 4 turns
  // Interaction effects
  accelerateQueue?: number;        // subtract N from ALL turnsUntilFire (min 1)
  amplifyQueue?: number;           // multiply all pending amounts by (1 + N/100)
  stackMatchingQueue?: { element: 'ice' | 'fire' | 'lightning'; amount: number }; // add N to largest pending of same element
  detonateNow?: boolean;           // fire ALL queued effects immediately this turn
  // Architect Engineer Slot mechanics
  slotEngineer?: string;           // engineer ID to slot (key into engineerRoster)
  addEngineerSlot?: number;        // increase maxEngineerSlots by N (max 5)
  removeEngineerSlot?: number;     // decrease maxEngineerSlots by N (evokes oldest if at max, min 1)
  evokeOldest?: boolean;           // fire oldest slot's evoke + remove from slots
  evokeAll?: boolean;              // fire ALL slots' evokes + clear slots
  damagePerSlot?: number;          // deal N × engineerSlots.length damage to target
  blockPerSlot?: number;           // gain N × engineerSlots.length block
  damageAllPerSlot?: number;       // deal N × engineerSlots.length damage to ALL enemies
  advanceBlueprint?: number;       // advance blueprint progress by N (triggers complete if ≥ length)
  regenerateBlueprint?: boolean;   // generate new random blueprint, reset progress to 0
  shuffleEngineerSlots?: boolean;  // shuffle order of engineer slots
  addScopeCreepToDiscard?: number; // add N scope_creep curse cards to discard pile
  // === v1.15 additions ===
  // Dodge-scaling (Frontend)
  damagePerDodge?: number;
  bonusDamageIfDodgedThisTurn?: boolean;
  bonusDamageIfDodgedThisTurnAmount?: number;
  dodgeScalesDamage?: number;
  // Burn amplifiers (Backend)
  doubleBurnOnTarget?: boolean;
  tripleBurnOnTarget?: boolean;
  damagePerBurn?: number;
  consumeBurnOnHit?: boolean;
  burnDoTMultiplier?: number;
  applyBurnAll?: number;
}

// ── Detonation Queue (Backend Engineer) ──
export interface QueuedEffect {
  element: 'ice' | 'fire' | 'lightning';
  blockAmount?: number;       // ice: gain this block when fired
  damageAllAmount?: number;   // fire: deal this to all enemies when fired
  damageAmount?: number;      // fire: deal this to one specific enemy when fired (single-target)
  targetInstanceId?: string;  // if set, only this enemy is hit (single-target fire)
  chainAmount?: number;       // lightning: deal this to each enemy when fired (scales with enemy count)
  burnApply?: number;         // fire: also apply this burn to all enemies when fired
  turnsUntilFire: number;     // countdown: 1=fast, 2=quick, 3=delayed, 4=charged
}

// ── Engineer Slots (Architect mechanic) ──
export interface EngineerPassive {
  block?: number;
  draw?: number;
  energy?: number;
  dodge?: number;
  resilience?: number;
  counterOffer?: number;
  generateTokens?: number;
  queueBlock?: number;
  queueDamageAll?: number;
  vulnerableRandom?: number;   // apply N vulnerable to random enemy each turn
  bleedRandom?: number;        // apply N bleed to random enemy each turn
}

export interface EngineerEvoke {
  block?: number;
  draw?: number;
  energy?: number;
  damage?: number;                      // deal to random enemy
  damageScalesWithTokens?: number;      // deal (damage) + tokens × N to random enemy
  damageAll?: number;                   // deal to all enemies
  applyToAll?: StatusEffect;
  shuffleDiscardToDraw?: boolean;
  queueBlock?: number;                  // queue ice block for next detonation turn
  queueDamageAll?: number;              // queue fire AoE for next detonation turn
  queueChain?: number;                  // queue lightning chain for next detonation turn
  damageAllScalesWithTokens?: number;   // deal tokens × N to all enemies, tokens → 0
  damageAllEqualsCounterOffer?: boolean; // deal counterOffer stacks as damage to all
  gainCounterOfferDouble?: boolean;     // gain counterOffer = current counterOffer stacks
  doubleResilience?: boolean;           // gain resilience = current resilience stacks
  applyToSelf?: StatusEffect;
  doublePlayerStatus?: boolean;
  damageAllScalesWithCounterOffer?: number;
}

export interface EngineerSlot {
  id: string;
  name: string;
  icon: string;
  passiveEffect: EngineerPassive;
  evokeEffect: EngineerEvoke;
  harmonicEffect?: EngineerEvoke;
}

// ── Deployments ──
export interface Deployment {
  name: string;
  icon: string;
  turnsLeft: number;
  attackPerTurn?: number;
  blockPerTurn?: number;
  poisonPerTurn?: number;
}

export interface CardDef {
  id: string;
  name: string;
  type: CardType;
  target: CardTarget;
  cost: number;
  rarity: CardRarity;
  description: string;
  effects: CardEffect;
  upgraded?: boolean;
  upgradedEffects?: CardEffect;
  upgradedDescription?: string;
  upgradedCost?: number;
  icon: string;
  // New fields
  class?: CardClass;       // undefined = neutral
  archetype?: string;      // hint for smart reward weighting
  exhaust?: boolean;       // non-power cards that exhaust when played
  upgradedExhaust?: boolean;
  ethereal?: boolean;      // exhaust at end of turn if not played
}

export interface CardInstance extends CardDef {
  instanceId: string;
  upgraded: boolean;
}

// ── Enemies ──
export type EnemyMoveType = 'attack' | 'defend' | 'buff' | 'debuff' | 'attack_defend' | 'stress_attack' | 'dual_attack' | 'discard' | 'exhaust' | 'buff_allies' | 'gold_steal' | 'heal_allies' | 'summon' | 'energy_drain' | 'corrupt';

export interface EnemyMove {
  name: string;
  type: EnemyMoveType;
  damage?: number;
  block?: number;
  times?: number;
  applyToSelf?: StatusEffect;
  applyToTarget?: StatusEffect;
  stressDamage?: number;
  discardCount?: number;
  exhaustCount?: number;
  goldSteal?: number;
  healAmount?: number;
  summonId?: string;        // enemy ID to spawn (for summon type)
  summonCount?: number;     // how many to spawn, default 1 (for summon type)
  energyDrain?: number;     // reduce player energy next turn by N (for energy_drain type)
  corruptCardId?: string;   // curse card ID to add to discard (for corrupt type)

  icon: string;
  quip?: string;
}

export interface EnemyPhase {
  hpPercent: number;
  moveStartIndex: number;
  onEnter?: StatusEffect;
  quip?: string;
}

export interface EnemyDef {
  id: string;
  name: string;
  hp: number;
  gold: number;
  moves: EnemyMove[];
  icon: string;
  portrait?: string;
  isElite?: boolean;
  isBoss?: boolean;
  hideIntent?: boolean;
  phases?: EnemyPhase[];
  startStatusEffects?: StatusEffect;  // status effects applied to this enemy at battle start (berserker archetype)
}

export interface EnemyInstance extends EnemyDef {
  instanceId: string;
  currentHp: number;
  maxHp: number;
  block: number;
  statusEffects: StatusEffect;
  moveIndex: number;
  currentMove: EnemyMove;
  currentPhaseIndex?: number;
}

// ── Character ──
export interface CharacterDef {
  id: string;
  name: string;
  title: string;
  hp: number;
  energy: number;
  description: string;
  maxStress: number;
  starterDeckIds: string[];
  starterRelicId?: string;
  icon: string;
  portrait?: string;
  available: boolean;
}

// ── Items (Relics) ──
export interface ItemDef {
  id: string;
  name: string;
  description: string;
  rarity: CardRarity;
  icon: string;
  class?: CardClass;      // class-gated relic (undefined = neutral)
  isStarter?: boolean;     // given at run start
  effect: {
    extraEnergy?: number;
    extraDraw?: number;
    extraHp?: number;
    healOnKill?: number;
    extraGold?: number;
    bonusDamage?: number;
    bonusBlock?: number;
    startBattleConfidence?: number;
    startBattleResilience?: number;
    startBattleVulnerable?: number;
    startBattleWeak?: number;
    startBattleDamage?: number;
    stressPerCombat?: number;
    healPerCombat?: number;
    // New trigger-based effects
    onPlayAttack?: { confidence?: number; block?: number; draw?: number };
    onPlaySkill?: { block?: number; draw?: number; energy?: number };
    onPlayPower?: { draw?: number; block?: number };
    onExhaust?: { damage?: number; block?: number; draw?: number; heal?: number };
    perPowerPlayed?: { confidence?: number; resilience?: number };
    confidencePerTurn?: number;
    blockPerTurn?: number;
    copiumPerTurn?: number;
    bonusCopium?: number;
    counterOfferStart?: number;
    savingsAccountStart?: number;
    energyOnFirstAttack?: number;
    drawOnFirstSkill?: number;
    multiHitBonus?: number;
    exhaustSynergyDamage?: number;
    exhaustSynergyBlock?: number;
    exhaustDoubleTrigger?: boolean;
    firstPowerDraw?: number;
    extraGoldPercent?: number;
    cardRemovalDiscount?: number;
    startBattleBlock?: number;
    drawOnCardDraw?: number;
    firstSkillBlock?: number;
    vulnerableAlsoWeak?: boolean;
    cardsPlayedEnergy?: number;       // gain energy when N+ cards played in a turn
    cardsPlayedThreshold?: number;    // the N threshold
    startCombatConfidencePerPower?: boolean;  // gain confidence = powers in deck
    selfDamageReflect?: boolean;      // reflect self-damage to random enemy
    selfDamageHalved?: boolean;       // halve self-damage from cards
    stressGainHalved?: boolean;       // halve stress gain from cards
    confidenceIfHasConfidence?: boolean;  // +1 confidence at turn start if you have confidence
    startCombatActConfidence?: boolean; // gain confidence+resilience = act number
    addRandomCardStart?: boolean;     // add random 0-cost class card at combat start
    firstPowerFree?: boolean;         // first power each combat costs 0
    firstEngineerCardFree?: boolean;
    exhaustGainEnergy?: boolean;      // gain 1 energy when exhaust
    // New epic relic effects
    skillBlockMultiplier?: number;    // multiply block from skills by N% (e.g. 150 = +50%)
    surviveKillingBlow?: boolean;     // once per combat, survive killing blow with 1 HP
    exhaustDrawCard?: boolean;        // draw 1 card whenever any card exhausted
    firstNCardsFree?: number;         // first N cards in hand at combat start cost 0
    confidenceThresholdDamage?: { threshold: number; damage: number }; // deal damage per N confidence stacks
    confidenceAlsoReduceStress?: number;  // cards that grant confidence also reduce stress by N
    startBattleBlockFromLastCombat?: boolean;  // start combat with block = cards played last combat
    extraEnergyFirstTurn?: number;    // gain N extra energy on first turn only
    // ── Frontend relic fields ──
    drawOnOverflow?: number;           // after overflow: draw N cards
    dodgeOnOverflow?: number;          // after overflow: gain N dodge
    retainFlow?: number;               // retain N flow between turns (don't reset to 0)
    blockPerDodgeStack?: number;       // at turn start: gain N block per dodge stack
    startFlowBonus?: number;           // start combat with N flow
    overflowBonusDamage?: number;      // overflow deals N extra AoE damage (frontend + ai_engineer)
    // ── Backend relic fields ──
    firstIceDoubleQueue?: boolean;     // first ice card each combat queues double block
    healOnDetonate?: number;           // heal N HP after detonation fires
    startSelfBurn?: number;            // start combat with N burn on player
    tripleElementEnergy?: number;      // queue all 3 elements in one turn: gain N energy next turn
    burnPropagation?: boolean;         // applying burn to one enemy also applies 1 burn to others
    vulnerableOnDetonate?: boolean;    // after detonation fires: apply 1 vulnerable to all enemies
    // ── Architect relic fields ──
    drawOnBlueprintAdvance?: number;   // after advancing blueprint: draw N cards
    blueprintCompleteVulnerable?: number; // blueprint completion: apply N vulnerable to all enemies
    startBlockPerEngineer?: number;    // start combat with N block per slotted engineer
    doubleEngineerPassive?: boolean;   // engineer passives trigger twice each turn
    // maxEngineerSlots is also an ItemDef effect field (cap at N, replaces default 3)
    confidencePerSlottedEngineer?: boolean; // gain 1 confidence/turn per slotted engineer
    // ── AI Engineer relic fields ──
    trainingLoopBonus?: number;        // training_loop cards gain +N extra bonus per play count
    startTokens?: number;              // start combat with N tokens
    tokenLossPerTurn?: number;         // lose N tokens at end of each turn
    overflowEnergyGain?: number;       // on temperature overflow: gain N energy
    overflowResetToZero?: boolean;     // overflow resets temperature to 0 instead of 5
    hotThreshold?: number;             // override hot bonus activation threshold (default 7)
    temperatureFloor?: number;         // temperature cannot go below N
    // ── Neutral relic fields ──
    damageReductionPercent?: number;   // take N% less incoming damage
    startBattleStress?: number;        // start each combat with N stress added
    confidenceOnKill?: number;         // on enemy kill: gain N confidence this combat
  };
}

// ── Events ──
export interface EventChoice {
  text: string;
  outcome: {
    hp?: number;
    maxHp?: number;
    gold?: number;
    stress?: number;
    addCard?: string;
    removeRandomCard?: boolean;
    removeChosenCard?: number;
    upgradeRandomCard?: boolean;
    addItem?: string;
    addConsumable?: string;
    setFlag?: string;
    message: string;
  };
}

export interface EventDef {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
  icon: string;
  class?: CardClass;  // class-specific events
  act?: number;       // 1, 2, or 3 — which act this event appears in (undefined = any act)
  condition?: {
    requireFlag?: string;    // only show if this flag is set in run.eventFlags
    requireNoFlag?: string;  // only show if this flag is NOT set
  };
}

// ── Map ──
export type NodeType = 'battle' | 'elite' | 'rest' | 'event' | 'shop' | 'boss';

export interface MapNode {
  id: string;
  row: number;
  col: number;
  type: NodeType;
  connections: string[];
  visited: boolean;
}

export interface GameMap {
  nodes: MapNode[];
  currentNodeId: string | null;
  currentRow: number;
}

// ── Battle ──
export interface BattleState {
  enemies: EnemyInstance[];
  hand: CardInstance[];
  drawPile: CardInstance[];
  discardPile: CardInstance[];
  exhaustPile: CardInstance[];
  energy: number;
  maxEnergy: number;
  turn: number;
  playerBlock: number;
  playerStatusEffects: StatusEffect;
  killCount: number;
  totalEnemies: number;
  goldEarned: number;
  deployments: Deployment[];
  // New tracking
  powersPlayedThisCombat: number;
  cardsPlayedThisTurn: number;
  firstAttackPlayedThisTurn: boolean;
  firstSkillPlayedThisTurn: boolean;
  firstPowerPlayedThisCombat: boolean;
  nextCardCostZero: boolean;
  // AI Engineer mechanics
  temperature: number;              // 0–10, starts at 5; overflow ≥10 → AoE; freeze ≤0 → block
  tokens: number;                   // token economy accumulator, persists across turns
  cardPlayCounts: Record<string, number>; // times each card.id played this combat
  nextTurnDrawPenalty: number;      // enemy debuff: reduce cards drawn next turn by this amount
  nextTurnEnergyPenalty: number;    // energy_drain accumulates here; applied and reset at startNewTurn
  // Frontend Engineer mechanics
  flow: number;                     // 0–8, increments per card played, resets each turn; overflow ≥8 → AoE + dodge + reset
  nextCardCostReduction: number;    // reduces next card played this turn by N energy (min 0), then resets
  // Backend Engineer mechanics
  detonationQueue: QueuedEffect[];  // effects that fire at the start of next player turn; batch bonus at 2+ elements
  // Architect Engineer Slot mechanics
  engineerSlots: EngineerSlot[];     // currently slotted engineers
  maxEngineerSlots: number;          // starts at 3; cards can change 1–5
  // v1.15 new mechanic fields
  dodgedThisTurn: boolean;
  dodgeScalesDamage: number;
  burnDoTMultiplier: number;
  circuitBreakerUsed: boolean;
  firstNCardsFreeRemaining: number;
  firstEngineerCardFreeUsed: boolean;
  blueprint: string[];               // ordered 3-engineer-ID sequence for blueprint completion
  blueprintProgress: number;         // sequential matches achieved (0–3)
  // v1.16 new mechanic fields
  firstIceUsed: boolean;             // tracks whether firstIceDoubleQueue relic has fired this combat
}

// ── Run ──
export interface RunState {
  character: CharacterDef;
  hp: number;
  maxHp: number;
  gold: number;
  deck: CardInstance[];
  items: ItemDef[];
  consumables: ConsumableInstance[];
  maxConsumables: number;
  map: GameMap;
  stress: number;
  maxStress: number;
  floor: number;
  act: number;
  seenEventIds: string[];
  eventFlags: Record<string, boolean>;
}

// ── Game Store ──
export interface GameState {
  screen: Screen;
  run: RunState | null;
  battle: BattleState | null;
  pendingRewards: {
    gold: number;
    cardChoices: CardDef[];
    artifactChoices?: ItemDef[];
    consumableChoices?: ConsumableDef[];
    isBossReward?: boolean;
  } | null;
  pendingEvent: EventDef | null;
  eventOutcome: {
    message: string;
    goldChange?: number;
    cardAdded?: CardInstance;
    cardRemoved?: CardInstance;
    cardsRemoved?: CardInstance[];
    cardUpgraded?: CardInstance;
    consumableAdded?: ConsumableInstance;
    consumableFull?: ConsumableInstance;
    itemAdded?: ItemDef;
  } | null;
  pendingRemoveCount: number | null;
  pendingRemoveMessage: string | null;
  pendingRemoveCardsRemoved: CardInstance[];
  pendingRemoveRewards: {
    goldChange?: number;
    cardAdded?: CardInstance;
    cardUpgraded?: CardInstance;
    consumableAdded?: ConsumableInstance;
    consumableFull?: ConsumableInstance;
    itemAdded?: ItemDef;
  } | null;

  // Actions
  selectCharacter: (characterId: string) => void;
  startRun: () => void;
  navigateToNode: (nodeId: string) => void;
  startBattle: (enemies: EnemyDef[]) => void;
  playCard: (cardInstanceId: string, targetInstanceId?: string) => void;
  endTurn: () => void;
  collectRewardGold: () => void;
  pickRewardCard: (cardId: string) => void;
  claimArtifact: (itemId: string) => void;
  skipRewardCards: () => void;
  rest: () => void;
  upgradeCard: (cardInstanceId: string) => void;
  makeEventChoice: (choiceIndex: number) => void;
  dismissEventOutcome: () => void;
  buyCard: (cardId: string) => void;
  buyItem: (itemId: string) => void;
  removeCard: (cardInstanceId: string) => void;
  train: () => void;
  reflectRemoveCard: (cardInstanceId: string) => void;
  returnToMap: () => void;
  gameOver: () => void;
  victory: () => void;
  restart: () => void;
  useConsumable: (instanceId: string, targetInstanceId?: string) => void;
  pickRewardConsumable: (consumableId: string) => void;
  skipRewardConsumable: () => void;
  buyConsumable: (consumableId: string) => void;
  confirmRemoveEventCard: (cardInstanceId: string) => void;
  discardConsumable: (instanceId: string) => void;
}
