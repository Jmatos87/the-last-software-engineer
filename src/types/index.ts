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
}

export interface ConsumableDef {
  id: string;
  name: string;
  description: string;
  rarity: ConsumableRarity;
  icon: string;
  target: ConsumableTarget;
  effect: ConsumableEffect;
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
  blockPerTimesPlayed?: number;     // gain N × playCount bonus block
  bonusAtSecondPlay?: { damage?: number; block?: number; draw?: number; copium?: number; energy?: number };
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
  ethereal?: boolean;      // exhaust at end of turn if not played
}

export interface CardInstance extends CardDef {
  instanceId: string;
  upgraded: boolean;
}

// ── Enemies ──
export type EnemyMoveType = 'attack' | 'defend' | 'buff' | 'debuff' | 'attack_defend' | 'stress_attack' | 'dual_attack' | 'discard' | 'exhaust' | 'buff_allies' | 'gold_steal' | 'heal_allies';

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
  isElite?: boolean;
  isBoss?: boolean;
  hideIntent?: boolean;
  phases?: EnemyPhase[];
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
  };
}

// ── Events ──
export interface EventChoice {
  text: string;
  outcome: {
    hp?: number;
    gold?: number;
    stress?: number;
    addCard?: string;
    removeRandomCard?: boolean;
    removeChosenCard?: number;
    upgradeRandomCard?: boolean;
    addItem?: string;
    addConsumable?: string;
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
    cardAdded?: CardInstance;
    cardRemoved?: CardInstance;
    cardsRemoved?: CardInstance[];
    cardUpgraded?: CardInstance;
    consumableAdded?: ConsumableInstance;
  } | null;
  pendingRemoveCount: number | null;
  pendingRemoveMessage: string | null;
  pendingRemoveCardsRemoved: CardInstance[];

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
