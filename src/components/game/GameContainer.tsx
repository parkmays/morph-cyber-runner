
import React, { useRef, useEffect, useState } from "react";
import { GameState, Player, Enemy, Platform, InputState } from "@/lib/types";
import { usePlayerControls } from "@/hooks/usePlayerControls";
import { useGameLoop } from "@/hooks/useGameLoop";
import { renderGame } from "@/lib/gameRenderer";
import { DEMO_LEVEL } from "@/lib/levels";

interface GameContainerProps {
  gameState: GameState;
}

const GameContainer: React.FC<GameContainerProps> = ({ gameState }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  
  const [player, setPlayer] = useState<Player>({
    x: DEMO_LEVEL.startX,
    y: DEMO_LEVEL.startY,
    velocityX: 0,
    velocityY: 0,
    width: 32,
    height: 48,
    speed: 3,
    jumpForce: 10,
    isJumping: false,
    canDoubleJump: false,
    hasJumped: false,
    abilities: ["none"],
    health: 100,
    maxHealth: 100,
    currentAbility: "none",
    direction: "right",
    state: "idle",
    skinType: "default"
  });

  const [enemies, setEnemies] = useState<Enemy[]>(DEMO_LEVEL.enemies);
  const [platforms, setPlatforms] = useState<Platform[]>(DEMO_LEVEL.platforms);
  const [cameraOffset, setCameraOffset] = useState({ x: 0, y: 0 });

  // Setup canvas and context
  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = 800;
      canvas.height = 450;
      
      const context = canvas.getContext("2d");
      if (context) {
        setCtx(context);
      }
    }
  }, [canvasRef]);

  // Get player controls
  const inputState = usePlayerControls();

  // Set up game loop
  useGameLoop(
    gameState,
    ctx,
    player,
    setPlayer,
    enemies,
    setEnemies,
    platforms,
    inputState,
    cameraOffset,
    setCameraOffset
  );

  return (
    <div className="game-container w-full aspect-video">
      <canvas 
        ref={canvasRef} 
        width={800} 
        height={450} 
        className="w-full h-full"
      />
    </div>
  );
};

export default GameContainer;
