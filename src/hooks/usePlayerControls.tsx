
import { useState, useEffect } from "react";
import { InputState } from "@/lib/types";

export function usePlayerControls(): InputState {
  const [input, setInput] = useState<InputState>({
    left: false,
    right: false,
    up: false,
    down: false,
    jump: false,
    dash: false,
    attack: false,
    absorb: false
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      
      switch (e.key.toLowerCase()) {
        case "arrowleft":
        case "a":
          setInput(prev => ({ ...prev, left: true }));
          break;
        case "arrowright":
        case "d":
          setInput(prev => ({ ...prev, right: true }));
          break;
        case "arrowup":
        case "w":
          setInput(prev => ({ ...prev, up: true }));
          break;
        case "arrowdown":
        case "s":
          setInput(prev => ({ ...prev, down: true }));
          break;
        case " ":
          setInput(prev => ({ ...prev, jump: true }));
          e.preventDefault(); // Prevent page scroll on spacebar
          break;
        case "shift":
          setInput(prev => ({ ...prev, dash: true }));
          break;
        case "f":
          setInput(prev => ({ ...prev, attack: true }));
          break;
        case "e":
          setInput(prev => ({ ...prev, absorb: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.key.toLowerCase()) {
        case "arrowleft":
        case "a":
          setInput(prev => ({ ...prev, left: false }));
          break;
        case "arrowright":
        case "d":
          setInput(prev => ({ ...prev, right: false }));
          break;
        case "arrowup":
        case "w":
          setInput(prev => ({ ...prev, up: false }));
          break;
        case "arrowdown":
        case "s":
          setInput(prev => ({ ...prev, down: false }));
          break;
        case " ":
          setInput(prev => ({ ...prev, jump: false }));
          break;
        case "shift":
          setInput(prev => ({ ...prev, dash: false }));
          break;
        case "f":
          setInput(prev => ({ ...prev, attack: false }));
          break;
        case "e":
          setInput(prev => ({ ...prev, absorb: false }));
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  return input;
}
