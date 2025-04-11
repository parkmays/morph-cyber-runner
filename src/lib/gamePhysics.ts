
import { Player, Enemy, Platform, InputState } from "./types";

const GRAVITY = 0.5;
const TERMINAL_VELOCITY = 12;

// Check collision between two objects
export function checkCollision(
  obj1: { x: number; y: number; width: number; height: number },
  obj2: { x: number; y: number; width: number; height: number }
): boolean {
  return (
    obj1.x < obj2.x + obj2.width &&
    obj1.x + obj1.width > obj2.x &&
    obj1.y < obj2.y + obj2.height &&
    obj1.y + obj1.height > obj2.y
  );
}

// Apply physics (gravity, collisions) to player
export function applyPhysics(
  player: Player,
  platforms: Platform[],
  deltaTime: number
): Player {
  // Create a new player object to avoid direct state mutation
  const newPlayer = { ...player };
  
  // Apply gravity
  newPlayer.velocityY += GRAVITY;
  
  // Apply terminal velocity
  if (newPlayer.velocityY > TERMINAL_VELOCITY) {
    newPlayer.velocityY = TERMINAL_VELOCITY;
  }
  
  // Move player based on velocity
  newPlayer.x += newPlayer.velocityX * deltaTime * 60;
  newPlayer.y += newPlayer.velocityY * deltaTime * 60;
  
  // Check for platform collisions
  let isOnGround = false;
  
  platforms.forEach(platform => {
    // Check if player would collide with this platform in the next frame
    if (checkCollision(
      { 
        x: newPlayer.x, 
        y: newPlayer.y, 
        width: newPlayer.width, 
        height: newPlayer.height 
      },
      platform
    )) {
      // Check from which direction the collision happened
      
      // Coming from above (landing on platform)
      const previousBottom = player.y + player.height;
      const currentBottom = newPlayer.y + newPlayer.height;
      
      if (previousBottom <= platform.y && currentBottom >= platform.y) {
        newPlayer.y = platform.y - newPlayer.height;
        newPlayer.velocityY = 0;
        isOnGround = true;
      }
      
      // Coming from below (hitting head on platform)
      const previousTop = player.y;
      const currentTop = newPlayer.y;
      
      if (previousTop >= platform.y + platform.height && currentTop <= platform.y + platform.height) {
        newPlayer.y = platform.y + platform.height;
        newPlayer.velocityY = 0;
      }
      
      // Coming from left or right (side collision)
      const previousRight = player.x + player.width;
      const currentRight = newPlayer.x + newPlayer.width;
      const previousLeft = player.x;
      const currentLeft = newPlayer.x;
      
      if (previousRight <= platform.x && currentRight >= platform.x) {
        newPlayer.x = platform.x - newPlayer.width;
        newPlayer.velocityX = 0;
      } else if (previousLeft >= platform.x + platform.width && currentLeft <= platform.x + platform.width) {
        newPlayer.x = platform.x + platform.width;
        newPlayer.velocityX = 0;
      }
    }
  });
  
  // Update jumping state
  if (isOnGround) {
    newPlayer.isJumping = false;
    newPlayer.hasJumped = false;
    
    // Only enable double jump when player has the ability
    if (newPlayer.abilities.includes('double-jump')) {
      newPlayer.canDoubleJump = true;
    }
  } else {
    newPlayer.isJumping = true;
  }
  
  // Update player state based on motion
  if (Math.abs(newPlayer.velocityX) > 0.1) {
    if (newPlayer.state !== 'dashing' && newPlayer.state !== 'attacking') {
      newPlayer.state = 'walking';
    }
  } else if (newPlayer.velocityY < 0) {
    if (newPlayer.state !== 'dashing' && newPlayer.state !== 'attacking') {
      newPlayer.state = 'jumping';
    }
  } else if (newPlayer.velocityY > 0.5) {
    if (newPlayer.state !== 'dashing' && newPlayer.state !== 'attacking') {
      newPlayer.state = 'falling';
    }
  } else if (!isOnGround) {
    if (newPlayer.state !== 'dashing' && newPlayer.state !== 'attacking') {
      newPlayer.state = 'falling';
    }
  } else if (newPlayer.state !== 'dashing' && newPlayer.state !== 'attacking') {
    newPlayer.state = 'idle';
  }
  
  return newPlayer;
}

// Update player based on input
export function updatePlayer(
  player: Player,
  input: InputState,
  platforms: Platform[],
  enemies: Enemy[]
): Player {
  const newPlayer = { ...player };
  
  // Horizontal movement
  if (input.left) {
    newPlayer.velocityX = -player.speed;
    newPlayer.direction = 'left';
  } else if (input.right) {
    newPlayer.velocityX = player.speed;
    newPlayer.direction = 'right';
  } else {
    newPlayer.velocityX *= 0.8; // Apply friction
    if (Math.abs(newPlayer.velocityX) < 0.1) newPlayer.velocityX = 0;
  }
  
  // Jumping
  if (input.jump) {
    // First jump
    if (!player.isJumping && !player.hasJumped) {
      newPlayer.velocityY = -player.jumpForce;
      newPlayer.isJumping = true;
      newPlayer.hasJumped = true;
    } 
    // Double jump if player has the ability
    else if (player.canDoubleJump && player.hasJumped && player.abilities.includes('double-jump')) {
      newPlayer.velocityY = -player.jumpForce * 0.8; // Slightly weaker double jump
      newPlayer.canDoubleJump = false;
    }
  }
  
  // Dashing (only if player has the ability)
  if (input.dash && player.abilities.includes('dash')) {
    if (player.state !== 'dashing') {
      newPlayer.state = 'dashing';
      const dashDirection = player.direction === 'right' ? 1 : -1;
      newPlayer.velocityX = player.speed * 2.5 * dashDirection;
      
      // Dash lasts for a short time (will be cleared in the game loop)
      setTimeout(() => {
        if (newPlayer.state === 'dashing') {
          newPlayer.state = 'idle';
        }
      }, 200);
    }
  }
  
  // Attacking
  if (input.attack) {
    if (player.state !== 'attacking') {
      newPlayer.state = 'attacking';
      
      // Handle different attack types based on current ability
      switch (player.currentAbility) {
        case 'explosive-attack':
          // Will be implemented later
          break;
        default:
          // Basic attack
          break;
      }
      
      // Attack animation lasts for a short time
      setTimeout(() => {
        if (newPlayer.state === 'attacking') {
          newPlayer.state = 'idle';
        }
      }, 300);
      
      // Check for enemy hits
      enemies.forEach(enemy => {
        // Basic attack range
        const attackRange = {
          x: player.direction === 'right' ? player.x + player.width : player.x - player.width/2,
          y: player.y,
          width: player.width/2,
          height: player.height
        };
        
        if (checkCollision(attackRange, enemy)) {
          // Handle enemy damage in the game loop
        }
      });
    }
  }
  
  // Absorb enemy ability (will be implemented later)
  if (input.absorb) {
    // Check for nearby defeated enemies
  }
  
  return newPlayer;
}

// Update enemies
export function updateEnemies(
  enemies: Enemy[],
  player: Player,
  platforms: Platform[],
  deltaTime: number
): Enemy[] {
  return enemies.map(enemy => {
    // Copy enemy to avoid direct state mutation
    const newEnemy = { ...enemy };
    
    // Apply gravity
    newEnemy.velocityY += GRAVITY;
    
    // Apply terminal velocity
    if (newEnemy.velocityY > TERMINAL_VELOCITY) {
      newEnemy.velocityY = TERMINAL_VELOCITY;
    }
    
    // Move enemy based on velocity
    newEnemy.x += newEnemy.velocityX * deltaTime * 60;
    newEnemy.y += newEnemy.velocityY * deltaTime * 60;
    
    // Check platform collisions
    platforms.forEach(platform => {
      if (checkCollision(newEnemy, platform)) {
        // Coming from above (landing on platform)
        const previousBottom = enemy.y + enemy.height;
        const currentBottom = newEnemy.y + newEnemy.height;
        
        if (previousBottom <= platform.y && currentBottom >= platform.y) {
          newEnemy.y = platform.y - newEnemy.height;
          newEnemy.velocityY = 0;
        }
        
        // Coming from below (hitting head on platform)
        const previousTop = enemy.y;
        const currentTop = newEnemy.y;
        
        if (previousTop >= platform.y + platform.height && currentTop <= platform.y + platform.height) {
          newEnemy.y = platform.y + platform.height;
          newEnemy.velocityY = 0;
        }
        
        // Coming from left or right (side collision)
        const previousRight = enemy.x + enemy.width;
        const currentRight = newEnemy.x + newEnemy.width;
        const previousLeft = enemy.x;
        const currentLeft = newEnemy.x;
        
        if (previousRight <= platform.x && currentRight >= platform.x) {
          newEnemy.x = platform.x - newEnemy.width;
          newEnemy.velocityX = -newEnemy.velocityX; // Reverse direction
          newEnemy.direction = newEnemy.direction === 'left' ? 'right' : 'left';
        } else if (previousLeft >= platform.x + platform.width && currentLeft <= platform.x + platform.width) {
          newEnemy.x = platform.x + platform.width;
          newEnemy.velocityX = -newEnemy.velocityX; // Reverse direction
          newEnemy.direction = newEnemy.direction === 'left' ? 'right' : 'left';
        }
      }
    });
    
    // Basic AI - detect player and move towards them
    const distanceToPlayer = Math.abs(player.x - enemy.x);
    
    if (distanceToPlayer < enemy.detectionRange) {
      if (player.x < enemy.x) {
        newEnemy.velocityX = -1;
        newEnemy.direction = 'left';
      } else {
        newEnemy.velocityX = 1;
        newEnemy.direction = 'right';
      }
      
      // Attack if player is in range
      if (distanceToPlayer < enemy.attackRange) {
        newEnemy.state = 'attacking';
      } else {
        newEnemy.state = 'walking';
      }
    } else {
      // Patrol behavior - move back and forth
      if (Math.random() < 0.01) { // Occasionally change direction
        newEnemy.velocityX = -newEnemy.velocityX;
        newEnemy.direction = newEnemy.direction === 'left' ? 'right' : 'left';
      }
      
      // Make sure enemy is always moving
      if (Math.abs(newEnemy.velocityX) < 0.5) {
        newEnemy.velocityX = newEnemy.direction === 'left' ? -1 : 1;
      }
      
      newEnemy.state = 'walking';
    }
    
    return newEnemy;
  });
}

// Update camera position to follow player
export function updateCamera(
  player: Player,
  canvasWidth: number,
  canvasHeight: number
): { x: number; y: number } {
  const cameraX = player.x - canvasWidth / 2 + player.width / 2;
  const cameraY = player.y - canvasHeight / 2 + player.height / 2;
  
  return {
    x: cameraX,
    y: cameraY
  };
}
