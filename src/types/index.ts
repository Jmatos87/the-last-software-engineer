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
export type CardRarity = 'starter' | 'common' | 'uncommon' | 'rare' | 'curse';
export type CardClass = 'frontend' | 'backend' | 'architect' | 'ai_engineer';

export interface StatusEffect {
  vulnerable?: number;
  weak?: number;
  strength?: number;       // "Rage Apply" — +dmg per attack
  dexterity?: number;      // "Emotional Intelligence" — +block & +stress reduction
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

export interface EnemyDef {
  id: string;
  name: string;
  hp: number;
  moves: EnemyMove[];
  icon: string;
  isElite?: boolean;
  isBoss?: boolean;
  hideIntent?: boolean;
}

export interface EnemyInstance extends EnemyDef {
  instanceId: string;
  currentHp: number;
  maxHp: number;
  block: number;
  statusEffects: StatusEffect;
  moveIndex: number;
  currentMove: EnemyMove;
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
    startBattleStrength?: number;
    startBattleDexterity?: number;
    startBattleVulnerable?: number;
    startBattleWeak?: number;
    startBattleDamage?: number;
    stressPerCombat?: number;
    healPerCombat?: number;
    // New trigger-based effects
    onPlayAttack?: { strength?: number; block?: number; draw?: number };
    onPlaySkill?: { block?: number; draw?: number; energy?: number };
    onPlayPower?: { draw?: number; block?: number };
    onExhaust?: { damage?: number; block?: number; draw?: number; heal?: number };
    perPowerPlayed?: { strength?: number; dexterity?: number };
    strengthPerTurn?: number;
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
    startCombatStrengthPerPower?: boolean;  // gain strength = powers in deck
    selfDamageReflect?: boolean;      // reflect self-damage to random enemy
    selfDamageHalved?: boolean;       // halve self-damage from cards
    stressGainHalved?: boolean;       // halve stress gain from cards
    strengthIfHasStrength?: boolean;  // +1 strength at turn start if you have strength
    startCombatActStrength?: boolean; // gain str+dex = act number
    addRandomCardStart?: boolean;     // add random 0-cost class card at combat start
    firstPowerFree?: boolean;         // first power each combat costs 0
    exhaustGainEnergy?: boolean;      // gain 1 energy when exhaust
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
    upgradeRandomCard?: boolean;
    addItem?: string;
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
  // New tracking
  powersPlayedThisCombat: number;
  cardsPlayedThisTurn: number;
  firstAttackPlayedThisTurn: boolean;
  firstSkillPlayedThisTurn: boolean;
  firstPowerPlayedThisCombat: boolean;
}

// ── Run ──
export interface RunState {
  character: CharacterDef;
  hp: number;
  maxHp: number;
  gold: number;
  deck: CardInstance[];
  items: ItemDef[];
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
    isBossReward?: boolean;
  } | null;
  pendingEvent: EventDef | null;
  eventOutcome: {
    message: string;
    cardAdded?: CardInstance;
    cardRemoved?: CardInstance;
    cardUpgraded?: CardInstance;
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
  returnToMap: () => void;
  gameOver: () => void;
  victory: () => void;
  restart: () => void;
}
