
import { useEffect, useRef } from "react";
import { GameState, Player, Enemy, Platform, InputState } from "@/lib/types";
import { checkCollision, applyPhysics, updatePlayer, updateEnemies, updateCamera } from "@/lib/gamePhysics";
import { renderGame } from "@/lib/gameRenderer";

export function useGameLoop(
  gameState: GameState,
  ctx: CanvasRenderingContext2D | null,
  player: Player,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  enemies: Enemy[],
  setEnemies: React.Dispatch<React.SetStateAction<Enemy[]>>,
  platforms: Platform[],
  inputState: InputState,
  cameraOffset: { x: number, y: number },
  setCameraOffset: React.Dispatch<React.SetStateAction<{ x: number, y: number }>>
) {
  const animationFrameId = useRef<number>(0);
  const lastTime = useRef<number>(0);

  useEffect(() => {
    if (!ctx || gameState !== "playing") {
      return;
    }

    const gameLoop = (timestamp: number) => {
      // Calculate delta time
      const deltaTime = lastTime.current ? (timestamp - lastTime.current) / 1000 : 0.016;
      lastTime.current = timestamp;

      // Clear canvas
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

      // Update game logic
      const updatedPlayer = applyPhysics(player, platforms, deltaTime);
      const newPlayer = updatePlayer(updatedPlayer, inputState, platforms, enemies);
      
      // Update enemies
      const newEnemies = updateEnemies(enemies, newPlayer, platforms, deltaTime);
      
      // Update camera
      const newCameraOffset = updateCamera(newPlayer, ctx.canvas.width, ctx.canvas.height);

      // Render game
      renderGame(ctx, newPlayer, newEnemies, platforms, newCameraOffset);
      
      // Update state
      setPlayer(newPlayer);
      setEnemies(newEnemies);
      setCameraOffset(newCameraOffset);
      
      // Continue game loop
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    // Start game loop
    animationFrameId.current = requestAnimationFrame(gameLoop);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [gameState, ctx, player, enemies, platforms, inputState]);
}
