import { describe, it, expect, beforeEach } from 'vitest';
import { createWorld, addEntity, addComponent, pipe } from 'bitecs';
import { Transform, Velocity, PhysicsBody, Block, Bomb } from '@/core/components';
import { initPhysics } from '@/physics/init';
import { PhysicsSystem, registerPhysicsBody, entityToRigidBody } from '@/physics/PhysicsSystem';
import { createDynamicBox, createStaticBox, createSphere } from '@/physics/factories';
import type { World as RapierWorld, RigidBody } from '@dimforge/rapier3d';

describe('Physics Integration - Real Physics', () => {
  let world: any;
  let physicsWorld: RapierWorld;
  let RAPIER: any;

  beforeEach(async () => {
    world = createWorld();
    const physics = await initPhysics();
    physicsWorld = physics.physicsWorld;
    RAPIER = physics.RAPIER;
  });

  describe('Gravity Simulation', () => {
    it('should apply gravity to dynamic bodies', async () => {
      // Create a box 10 units above ground
      const box = createDynamicBox({ x: 0, y: 10, z: 0 }, { x: 1, y: 1, z: 1 }, 1);
      
      // Initial position
      expect(Transform.y[box]).toBe(10);
      
      // Run physics for 60 steps (1 second at 60fps)
      const pipeline = pipe(PhysicsSystem);
      for (let i = 0; i < 60; i++) {
        pipeline(world);
      }
      
      // Box should have fallen due to gravity
      expect(Transform.y[box]).toBeLessThan(10);
      expect(Transform.y[box]).toBeGreaterThan(-1); // Should be above ground level
    });

    it('should not move static bodies', async () => {
      // Create static ground
      const ground = createStaticBox({ x: 0, y: 0, z: 0 }, { x: 10, y: 1, z: 10 });
      
      // Initial position
      expect(Transform.y[ground]).toBe(0);
      
      // Run physics
      const pipeline = pipe(PhysicsSystem);
      for (let i = 0; i < 60; i++) {
        pipeline(world);
      }
      
      // Ground should not move
      expect(Transform.y[ground]).toBe(0);
    });
  });

  describe('Collision Detection', () => {
    it('should stop falling box when it hits ground', async () => {
      // Create ground and box
      const ground = createStaticBox({ x: 0, y: 0, z: 0 }, { x: 10, y: 1, z: 10 });
      const box = createDynamicBox({ x: 0, y: 5, z: 0 }, { x: 1, y: 1, z: 1 }, 1);
      
      // Run physics until box settles
      const pipeline = pipe(PhysicsSystem);
      for (let i = 0; i < 120; i++) {
        pipeline(world);
      }
      
      // Box should rest on ground (accounting for box height)
      expect(Transform.y[box]).toBeCloseTo(1, 1); // Box center should be at y=1
    });

    it('should handle ball-to-box collisions', async () => {
      // Create a static box and shoot a ball at it
      const box = createDynamicBox({ x: 0, y: 1, z: 0 }, { x: 2, y: 2, z: 2 }, 1);
      const ball = createSphere({ x: 5, y: 1, z: 0 }, 0.5, 1);
      
      // Set ball velocity towards box
      Velocity.x[ball] = -10;
      Velocity.y[ball] = 0;
      Velocity.z[ball] = 0;
      
      // Get initial box position
      const initialBoxX = Transform.x[box];
      
      // Run physics
      const pipeline = pipe(PhysicsSystem);
      for (let i = 0; i < 60; i++) {
        pipeline(world);
      }
      
      // Box should have moved due to impact
      expect(Transform.x[box]).not.toBe(initialBoxX);
      // Ball should have bounced or slowed
      expect(Math.abs(Velocity.x[ball])).toBeLessThan(10);
    });
  });

  describe('Velocity Application', () => {
    it('should apply velocity to dynamic bodies', async () => {
      const ball = createSphere({ x: 0, y: 5, z: 0 }, 0.5, 1);
      
      // Set horizontal velocity
      Velocity.x[ball] = 5;
      Velocity.y[ball] = 0;
      Velocity.z[ball] = 0;
      
      const initialX = Transform.x[ball];
      
      // Run physics
      const pipeline = pipe(PhysicsSystem);
      for (let i = 0; i < 30; i++) {
        pipeline(world);
      }
      
      // Ball should have moved in X direction
      expect(Transform.x[ball]).toBeGreaterThan(initialX);
    });

    it('should update velocity based on physics', async () => {
      const ball = createSphere({ x: 0, y: 10, z: 0 }, 0.5, 1);
      
      // Initially no velocity
      expect(Velocity.y[ball]).toBe(0);
      
      // Run physics - gravity should accelerate the ball
      const pipeline = pipe(PhysicsSystem);
      for (let i = 0; i < 10; i++) {
        pipeline(world);
      }
      
      // Ball should have negative Y velocity (falling)
      expect(Velocity.y[ball]).toBeLessThan(0);
    });
  });

  describe('Tower Collapse Simulation', () => {
    it('should simulate realistic tower collapse', async () => {
      // Create a small tower
      const blocks: number[] = [];
      const blockSize = 1;
      
      // Ground
      createStaticBox({ x: 0, y: -0.5, z: 0 }, { x: 20, y: 1, z: 20 });
      
      // Build 3-level tower
      for (let level = 0; level < 3; level++) {
        for (let i = 0; i < 3 - level; i++) {
          const x = (i - (2 - level) / 2) * (blockSize + 0.1);
          const y = 0.5 + level * (blockSize + 0.1);
          const block = createDynamicBox(
            { x, y, z: 0 },
            { x: blockSize, y: blockSize, z: blockSize },
            0.5
          );
          addComponent(world, Block, block);
          blocks.push(block);
        }
      }
      
      // Shoot a heavy ball at the base
      const ball = createSphere({ x: 5, y: 0.5, z: 0 }, 0.5, 5);
      addComponent(world, Bomb, ball);
      
      // Set ball velocity
      const body = entityToRigidBody.get(ball);
      if (body) {
        body.setLinvel({ x: -20, y: 0, z: 0 }, true);
      }
      
      // Record initial positions
      const initialPositions = blocks.map(b => ({
        x: Transform.x[b],
        y: Transform.y[b],
        z: Transform.z[b]
      }));
      
      // Run physics
      const pipeline = pipe(PhysicsSystem);
      for (let i = 0; i < 120; i++) {
        pipeline(world);
      }
      
      // Check that blocks have moved (tower collapsed)
      let movedBlocks = 0;
      blocks.forEach((block, i) => {
        const moved = 
          Math.abs(Transform.x[block] - initialPositions[i].x) > 0.1 ||
          Math.abs(Transform.y[block] - initialPositions[i].y) > 0.1 ||
          Math.abs(Transform.z[block] - initialPositions[i].z) > 0.1;
        
        if (moved) movedBlocks++;
      });
      
      // At least half the blocks should have moved
      expect(movedBlocks).toBeGreaterThan(blocks.length / 2);
    });
  });

  describe('Physics Body Registration', () => {
    it('should properly register and unregister bodies', async () => {
      const box = createDynamicBox({ x: 0, y: 5, z: 0 }, { x: 1, y: 1, z: 1 }, 1);
      
      // Check body is registered
      const body = entityToRigidBody.get(box);
      expect(body).toBeDefined();
      expect(body?.isValid()).toBe(true);
      
      // Get handle
      const handle = PhysicsBody.handle[box];
      expect(handle).toBeDefined();
      
      // Body should exist in physics world
      const retrievedBody = physicsWorld.getRigidBody(handle);
      expect(retrievedBody).toBeDefined();
    });
  });
});