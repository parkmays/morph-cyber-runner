
import React from "react";

interface PauseMenuProps {
  onResume: () => void;
  onRestart: () => void;
  onQuit: () => void;
}

const PauseMenu: React.FC<PauseMenuProps> = ({ onResume, onRestart, onQuit }) => {
  return (
    <div className="absolute inset-0 bg-cyber-dark bg-opacity-80 flex items-center justify-center z-20">
      <div className="bg-cyber-purple bg-opacity-70 p-8 rounded-lg border-2 border-cyber-blue neon-border flex flex-col items-center">
        <h2 className="text-4xl font-bold text-cyber-neon neon-text mb-8">PAUSED</h2>
        
        <div className="flex flex-col space-y-4 w-full">
          <button
            onClick={onResume}
            className="bg-cyber-dark hover:bg-cyber-blue hover:text-cyber-dark transition-colors duration-300 text-cyber-neon py-2 px-6 rounded-md text-lg font-bold tracking-wider neon-border w-full"
          >
            RESUME
          </button>
          
          <button
            onClick={onRestart}
            className="bg-cyber-dark hover:bg-cyber-blue hover:text-cyber-dark transition-colors duration-300 text-cyber-neon py-2 px-6 rounded-md text-lg font-bold tracking-wider neon-border w-full"
          >
            RESTART
          </button>
          
          <button
            onClick={onQuit}
            className="bg-cyber-dark hover:bg-cyber-pink hover:text-cyber-dark transition-colors duration-300 text-cyber-neon py-2 px-6 rounded-md text-lg font-bold tracking-wider neon-border w-full"
          >
            QUIT
          </button>
        </div>
      </div>
    </div>
  );
};

export default PauseMenu;
