
// Game state types
export type GameState = "title" | "playing" | "paused" | "game-over";

// Character ability types
export type AbilityType = "none" | "dash" | "double-jump" | "explosive-attack";

// Enemy types
export type EnemyType = "blazer-drone" | "gutter-hacker" | "plasma-juggernaut";

// Player interface
export interface Player {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  width: number;
  height: number;
  speed: number;
  jumpForce: number;
  isJumping: boolean;
  canDoubleJump: boolean;
  hasJumped: boolean;
  abilities: AbilityType[];
  health: number;
  maxHealth: number;
  currentAbility: AbilityType;
  direction: "left" | "right";
  state: "idle" | "walking" | "jumping" | "falling" | "dashing" | "attacking";
  skinType: "default" | "blazer" | "hacker" | "juggernaut";
}

// Enemy interface
export interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  width: number;
  height: number;
  velocityX: number;
  velocityY: number;
  health: number;
  maxHealth: number;
  state: "idle" | "walking" | "attacking" | "damaged" | "dying";
  direction: "left" | "right";
  ability: AbilityType;
  detectionRange: number;
  attackRange: number;
}

// Platform interface
export interface Platform {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: "normal" | "moving" | "falling" | "harmful";
}

// Game level interface
export interface GameLevel {
  width: number;
  height: number;
  platforms: Platform[];
  enemies: Enemy[];
  backgroundLayers: string[];
  startX: number;
  startY: number;
}

// Input state interface
export interface InputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
  dash: boolean;
  attack: boolean;
  absorb: boolean;
}
