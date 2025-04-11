
import { GameLevel, Enemy } from "./types";
import { v4 as uuidv4 } from "uuid";

// Generate simple IDs if uuid is not available
const generateId = () => {
  return uuidv4();
};

// Demo level for the game
export const DEMO_LEVEL: GameLevel = {
  width: 2000,
  height: 600,
  platforms: [
    // Ground platforms
    { id: generateId(), x: 0, y: 400, width: 400, height: 20, type: "normal" },
    { id: generateId(), x: 450, y: 400, width: 200, height: 20, type: "normal" },
    { id: generateId(), x: 700, y: 450, width: 300, height: 20, type: "normal" },
    { id: generateId(), x: 1050, y: 400, width: 200, height: 20, type: "normal" },
    { id: generateId(), x: 1300, y: 350, width: 300, height: 20, type: "normal" },
    { id: generateId(), x: 1650, y: 400, width: 350, height: 20, type: "normal" },
    
    // Elevated platforms
    { id: generateId(), x: 100, y: 300, width: 100, height: 20, type: "normal" },
    { id: generateId(), x: 350, y: 250, width: 100, height: 20, type: "normal" },
    { id: generateId(), x: 550, y: 300, width: 100, height: 20, type: "normal" },
    { id: generateId(), x: 800, y: 350, width: 100, height: 20, type: "normal" },
    { id: generateId(), x: 1100, y: 300, width: 100, height: 20, type: "normal" },
    { id: generateId(), x: 1400, y: 250, width: 100, height: 20, type: "normal" },
    
    // Walls
    { id: generateId(), x: 250, y: 300, width: 20, height: 100, type: "normal" },
    { id: generateId(), x: 600, y: 300, width: 20, height: 100, type: "normal" },
    { id: generateId(), x: 950, y: 350, width: 20, height: 100, type: "normal" },
    { id: generateId(), x: 1250, y: 300, width: 20, height: 100, type: "normal" },
    { id: generateId(), x: 1550, y: 250, width: 20, height: 100, type: "normal" },
  ],
  enemies: [
    {
      id: generateId(),
      type: "blazer-drone",
      x: 300,
      y: 350,
      width: 32,
      height: 32,
      velocityX: 1,
      velocityY: 0,
      health: 50,
      maxHealth: 50,
      state: "idle",
      direction: "right",
      ability: "dash",
      detectionRange: 200,
      attackRange: 50
    },
    {
      id: generateId(),
      type: "blazer-drone",
      x: 700,
      y: 400,
      width: 32,
      height: 32,
      velocityX: 1,
      velocityY: 0,
      health: 50,
      maxHealth: 50,
      state: "idle",
      direction: "right",
      ability: "dash",
      detectionRange: 200,
      attackRange: 50
    },
    {
      id: generateId(),
      type: "gutter-hacker",
      x: 1200,
      y: 350,
      width: 32,
      height: 48,
      velocityX: -1,
      velocityY: 0,
      health: 75,
      maxHealth: 75,
      state: "idle",
      direction: "left",
      ability: "double-jump",
      detectionRange: 250,
      attackRange: 60
    }
  ],
  backgroundLayers: [
    "/assets/background/layer-1.png",
    "/assets/background/layer-2.png",
    "/assets/background/layer-3.png"
  ],
  startX: 50,
  startY: 350
};
