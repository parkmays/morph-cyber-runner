
import React from "react";

interface TitleScreenProps {
  onStart: () => void;
}

const TitleScreen: React.FC<TitleScreenProps> = ({ onStart }) => {
  return (
    <div className="relative w-full aspect-video bg-cyber-dark game-container flex flex-col items-center justify-center">
      <div className="absolute inset-0 overflow-hidden">
        {/* Background grid effect */}
        <div className="absolute inset-0" 
          style={{
            backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(59,244,251,0.1) 25%, rgba(59,244,251,0.1) 26%, transparent 27%, transparent 74%, rgba(59,244,251,0.1) 75%, rgba(59,244,251,0.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(59,244,251,0.1) 25%, rgba(59,244,251,0.1) 26%, transparent 27%, transparent 74%, rgba(59,244,251,0.1) 75%, rgba(59,244,251,0.1) 76%, transparent 77%, transparent)',
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Glowing particles */}
        {Array(20).fill(0).map((_, index) => (
          <div 
            key={index}
            className="absolute animate-pulse-neon"
            style={{
              width: `${Math.random() * 3 + 1}px`,
              height: `${Math.random() * 3 + 1}px`,
              backgroundColor: Math.random() > 0.5 ? '#3BF4FB' : '#FF2975',
              boxShadow: `0 0 5px ${Math.random() > 0.5 ? '#3BF4FB' : '#FF2975'}`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${Math.random() * 3 + 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col items-center justify-center">
        <h1 className="text-6xl sm:text-8xl font-bold text-cyber-pink neon-pink-text mb-6 tracking-widest">
          SKINZ
        </h1>
        
        <div className="mb-8 max-w-md text-center">
          <p className="text-cyber-neon mb-4 text-lg">
            You are a forgotten AI prototype from the cyberwar, now sentient.
          </p>
          <p className="text-cyber-neon text-lg">
            Your mission: consume enemies, absorb their powers, and evolve.
          </p>
        </div>
        
        <button
          onClick={onStart}
          className="bg-cyber-purple hover:bg-cyber-pink transition-colors duration-300 text-cyber-neon py-3 px-8 rounded-md text-lg font-bold tracking-wider neon-border"
        >
          START GAME
        </button>
        
        <div className="mt-12 text-sm text-cyber-blue">
          <p>CONTROLS: Arrow keys/WASD to move, SPACE to jump, SHIFT to dash, F to attack, E to absorb</p>
        </div>
      </div>
    </div>
  );
};

export default TitleScreen;
