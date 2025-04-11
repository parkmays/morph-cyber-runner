
import { Player, Enemy, Platform } from "./types";

// Load and cache images
const imageCache: Record<string, HTMLImageElement> = {};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    if (imageCache[src]) {
      resolve(imageCache[src]);
      return;
    }
    
    const img = new Image();
    img.onload = () => {
      imageCache[src] = img;
      resolve(img);
    };
    img.onerror = reject;
    img.src = src;
  });
}

// Placeholder colors for entities (will be replaced with sprites)
const colors = {
  player: "#3BF4FB", // Cyan
  platform: "#341948", // Dark purple
  enemy: "#FF2975", // Hot pink
  background: "#1A1A2E" // Dark blue
};

// Render the game
export function renderGame(
  ctx: CanvasRenderingContext2D,
  player: Player,
  enemies: Enemy[],
  platforms: Platform[],
  cameraOffset: { x: number; y: number }
): void {
  if (!ctx) return;

  const { width, height } = ctx.canvas;
  
  // Clear canvas
  ctx.fillStyle = colors.background;
  ctx.fillRect(0, 0, width, height);
  
  // Save current transformation
  ctx.save();
  
  // Apply camera transformation
  ctx.translate(-cameraOffset.x, -cameraOffset.y);
  
  // Draw background layers (will be replaced with actual layers)
  drawBackground(ctx, cameraOffset);
  
  // Draw platforms
  platforms.forEach(platform => {
    ctx.fillStyle = colors.platform;
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    
    // Add a neon border effect
    ctx.strokeStyle = "#6930c3";
    ctx.lineWidth = 2;
    ctx.strokeRect(platform.x, platform.y, platform.width, platform.height);
  });
  
  // Draw enemies
  enemies.forEach(enemy => {
    ctx.fillStyle = colors.enemy;
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    
    // Draw enemy direction indicator (temporary)
    ctx.fillStyle = "#ffffff";
    const eyeX = enemy.direction === "right" ? enemy.x + enemy.width - 10 : enemy.x + 5;
    ctx.fillRect(eyeX, enemy.y + 10, 5, 5);
    
    // Draw health bar
    const healthPercentage = enemy.health / enemy.maxHealth;
    ctx.fillStyle = "#333333";
    ctx.fillRect(enemy.x, enemy.y - 10, enemy.width, 5);
    ctx.fillStyle = "#FF2975";
    ctx.fillRect(enemy.x, enemy.y - 10, enemy.width * healthPercentage, 5);
  });
  
  // Draw player
  drawPlayer(ctx, player);
  
  // Restore transformation
  ctx.restore();
  
  // Draw UI elements (not affected by camera)
  drawUI(ctx, player);
}

// Draw player character
function drawPlayer(ctx: CanvasRenderingContext2D, player: Player): void {
  ctx.fillStyle = colors.player;
  ctx.fillRect(player.x, player.y, player.width, player.height);
  
  // Draw direction indicator (temporary, will be replaced with sprites)
  ctx.fillStyle = "#ffffff";
  const eyeX = player.direction === "right" ? player.x + player.width - 10 : player.x + 5;
  ctx.fillRect(eyeX, player.y + 10, 5, 5);
  
  // Draw special effects based on player state
  switch (player.state) {
    case "dashing":
      // Draw dash trail
      ctx.globalAlpha = 0.5;
      ctx.fillStyle = "#3BF4FB";
      const trailX = player.direction === "right" ? player.x - 20 : player.x + player.width;
      ctx.fillRect(trailX, player.y, 20, player.height);
      ctx.globalAlpha = 1;
      break;
    
    case "attacking":
      // Draw attack effect
      ctx.fillStyle = "#ffffff";
      const attackX = player.direction === "right" ? player.x + player.width : player.x - player.width/2;
      ctx.fillRect(attackX, player.y, player.width/2, player.height);
      break;
      
    default:
      break;
  }
  
  // Draw glow effect based on player's skin type
  ctx.shadowBlur = 10;
  switch (player.skinType) {
    case "blazer":
      ctx.shadowColor = "#FF2975";
      break;
    case "hacker":
      ctx.shadowColor = "#3BF4FB";
      break;
    case "juggernaut":
      ctx.shadowColor = "#6930c3";
      break;
    default:
      ctx.shadowColor = "#3BF4FB";
      break;
  }
  
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.shadowBlur = 0;
}

// Draw background with parallax effect
function drawBackground(ctx: CanvasRenderingContext2D, cameraOffset: { x: number; y: number }): void {
  const { width, height } = ctx.canvas;
  
  // Background layers with parallax effect
  // Layer 1 (farthest) - Stars
  for (let i = 0; i < 100; i++) {
    const x = (i * 30 + Math.sin(i) * 50) - (cameraOffset.x * 0.1) % width;
    const y = (i * 20 + Math.cos(i) * 40) - (cameraOffset.y * 0.05) % height;
    
    ctx.fillStyle = "#ffffff";
    ctx.globalAlpha = 0.5 + Math.sin(Date.now() * 0.001 + i) * 0.5;
    ctx.fillRect(
      x + cameraOffset.x * 0.1, 
      y + cameraOffset.y * 0.05, 
      2, 
      2
    );
  }
  ctx.globalAlpha = 1;
  
  // Layer 2 - Distant buildings
  for (let i = 0; i < 5; i++) {
    const buildingWidth = 100 + Math.sin(i) * 50;
    const buildingHeight = 200 + Math.cos(i) * 100;
    const x = (i * 150 - cameraOffset.x * 0.3) % (width + buildingWidth) - buildingWidth;
    
    ctx.fillStyle = "#341948";
    ctx.fillRect(
      x + cameraOffset.x * 0.3, 
      height - buildingHeight + cameraOffset.y * 0.2, 
      buildingWidth, 
      buildingHeight
    );
    
    // Windows
    ctx.fillStyle = "#3BF4FB";
    for (let j = 0; j < 10; j++) {
      for (let k = 0; k < 3; k++) {
        if (Math.random() > 0.3) {
          ctx.fillRect(
            x + 20 + k * 30 + cameraOffset.x * 0.3, 
            height - buildingHeight + 30 + j * 20 + cameraOffset.y * 0.2, 
            10, 
            10
          );
        }
      }
    }
  }
  
  // Layer 3 - Foreground buildings
  for (let i = 0; i < 3; i++) {
    const buildingWidth = 200 + Math.sin(i) * 100;
    const buildingHeight = 300 + Math.cos(i) * 150;
    const x = (i * 300 - cameraOffset.x * 0.6) % (width + buildingWidth) - buildingWidth;
    
    ctx.fillStyle = "#1A1A2E";
    ctx.fillRect(
      x + cameraOffset.x * 0.6, 
      height - buildingHeight + cameraOffset.y * 0.4, 
      buildingWidth, 
      buildingHeight
    );
    
    // Windows
    ctx.fillStyle = "#FF2975";
    for (let j = 0; j < 15; j++) {
      for (let k = 0; k < 5; k++) {
        if (Math.random() > 0.5) {
          ctx.fillRect(
            x + 30 + k * 40 + cameraOffset.x * 0.6, 
            height - buildingHeight + 40 + j * 25 + cameraOffset.y * 0.4, 
            15, 
            15
          );
        }
      }
    }
  }
}

// Draw UI elements
function drawUI(ctx: CanvasRenderingContext2D, player: Player): void {
  // Power indicator
  if (player.currentAbility !== "none") {
    ctx.fillStyle = "#1A1A2E";
    ctx.globalAlpha = 0.7;
    ctx.fillRect(ctx.canvas.width - 110, 10, 100, 40);
    ctx.globalAlpha = 1;
    
    ctx.fillStyle = "#3BF4FB";
    ctx.font = "14px 'Rajdhani', sans-serif";
    ctx.textAlign = "center";
    
    let powerName = "";
    switch (player.currentAbility) {
      case "dash":
        powerName = "DASH";
        break;
      case "double-jump":
        powerName = "DOUBLE JUMP";
        break;
      case "explosive-attack":
        powerName = "PLASMA BLAST";
        break;
    }
    
    ctx.fillText(powerName, ctx.canvas.width - 60, 35);
  }
}
