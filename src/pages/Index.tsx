
import React, { useState, useEffect } from "react";
import GameContainer from "@/components/game/GameContainer";
import TitleScreen from "@/components/ui/TitleScreen";
import PauseMenu from "@/components/ui/PauseMenu";
import { GameState } from "@/lib/types";

const Index = () => {
  const [gameState, setGameState] = useState<GameState>("title");

  const startGame = () => {
    setGameState("playing");
  };

  const pauseGame = () => {
    setGameState("paused");
  };

  const resumeGame = () => {
    setGameState("playing");
  };

  const restartGame = () => {
    setGameState("title");
  };

  const quitGame = () => {
    setGameState("title");
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && gameState === "playing") {
        pauseGame();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [gameState]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-cyber-black p-4">
      <div className="w-full max-w-5xl">
        {gameState === "title" ? (
          <TitleScreen onStart={startGame} />
        ) : (
          <div className="relative">
            <GameContainer gameState={gameState} />
            
            {gameState === "paused" && (
              <PauseMenu 
                onResume={resumeGame} 
                onRestart={restartGame} 
                onQuit={quitGame} 
              />
            )}
            
            {/* Game UI overlay */}
            {gameState === "playing" && (
              <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                <div className="bg-cyber-dark bg-opacity-70 p-2 rounded-lg neon-border flex items-center space-x-2">
                  <div className="text-cyber-neon text-sm font-bold">HEALTH</div>
                  <div className="h-2 w-32 bg-cyber-dark rounded">
                    <div className="h-full w-3/4 bg-cyber-pink rounded" />
                  </div>
                </div>
                
                <button 
                  onClick={pauseGame} 
                  className="bg-cyber-dark bg-opacity-70 p-2 rounded-lg hover:bg-cyber-purple transition-colors neon-border"
                >
                  <span className="text-cyber-neon text-sm">PAUSE</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
