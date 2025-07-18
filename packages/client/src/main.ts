import './style.css';
import { world } from './core/ecs';
import { initPhysics } from './physics/init';
import { PhysicsSystem } from './physics/PhysicsSystem';
import { RenderSystem, initRenderSystem } from './rendering/RenderSystem';
import { Scene } from './rendering/Scene';
import { GameManager } from './game/GameManager';
import { pipe } from 'bitecs';

async function main() {
  // Initialize canvas
  const canvas = document.querySelector<HTMLCanvasElement>('#canvas')!;
  if (!canvas) {
    throw new Error('Canvas not found');
  }

  // Initialize physics
  await initPhysics();

  // Initialize rendering
  const scene = new Scene(canvas);
  initRenderSystem(scene);

  // Initialize game
  const gameManager = new GameManager();
  gameManager.reset();

  // Create systems pipeline
  const pipeline = pipe(PhysicsSystem, RenderSystem);

  // Handle click to shoot
  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    gameManager.shootBall({ x: x * 0.5, y: y * 0.5, z: -1 });
  });

  // Add reset button
  const resetButton = document.querySelector<HTMLButtonElement>('#reset')!;
  if (resetButton) {
    resetButton.addEventListener('click', () => {
      gameManager.reset();
    });
  }

  // Game loop
  let lastTime = performance.now();
  const fixedTimeStep = 1000 / 60; // 60 FPS
  let accumulator = 0;

  function gameLoop(currentTime: number) {
    const deltaTime = currentTime - lastTime;
    lastTime = currentTime;

    accumulator += deltaTime;

    while (accumulator >= fixedTimeStep) {
      pipeline(world);
      accumulator -= fixedTimeStep;
    }

    requestAnimationFrame(gameLoop);
  }

  requestAnimationFrame(gameLoop);
}

main().catch(console.error);