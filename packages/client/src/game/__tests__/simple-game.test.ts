import { describe, it, expect, beforeEach } from 'vitest';
import { createWorld, addEntity, addComponent, hasComponent } from 'bitecs';
import { Transform, Block, Bomb, PhysicsBody, Velocity } from '@/core/components';

describe('Game Components', () => {
  let world: any;

  beforeEach(() => {
    world = createWorld();
  });

  it('should create block entities with correct components', () => {
    const block = addEntity(world);
    
    addComponent(world, Transform, block);
    addComponent(world, PhysicsBody, block);
    addComponent(world, Block, block);
    
    // Set position
    Transform.x[block] = 0;
    Transform.y[block] = 1;
    Transform.z[block] = 0;
    
    // Verify components
    expect(hasComponent(world, Transform, block)).toBe(true);
    expect(hasComponent(world, PhysicsBody, block)).toBe(true);
    expect(hasComponent(world, Block, block)).toBe(true);
    
    expect(Transform.x[block]).toBe(0);
    expect(Transform.y[block]).toBe(1);
    expect(Transform.z[block]).toBe(0);
  });

  it('should create bomb entities with velocity', () => {
    const bomb = addEntity(world);
    
    addComponent(world, Transform, bomb);
    addComponent(world, PhysicsBody, bomb);
    addComponent(world, Velocity, bomb);
    addComponent(world, Bomb, bomb);
    
    // Set position and velocity
    Transform.x[bomb] = 5;
    Transform.y[bomb] = 10;
    Transform.z[bomb] = 0;
    
    Velocity.x[bomb] = -10;
    Velocity.y[bomb] = 0;
    Velocity.z[bomb] = -5;
    
    // Verify
    expect(hasComponent(world, Bomb, bomb)).toBe(true);
    expect(hasComponent(world, Velocity, bomb)).toBe(true);
    
    expect(Velocity.x[bomb]).toBe(-10);
    expect(Velocity.z[bomb]).toBe(-5);
  });

  it('should simulate pyramid structure', () => {
    const blocks = [];
    const levels = 3;
    
    // Create pyramid
    for (let level = 0; level < levels; level++) {
      for (let i = 0; i < levels - level; i++) {
        const block = addEntity(world);
        addComponent(world, Transform, block);
        addComponent(world, Block, block);
        
        Transform.x[block] = (i - (levels - level - 1) / 2);
        Transform.y[block] = level + 0.5;
        Transform.z[block] = 0;
        
        blocks.push(block);
      }
    }
    
    // Verify we have the right number of blocks
    expect(blocks.length).toBe(6); // 3 + 2 + 1
    
    // Verify pyramid structure
    const level0Blocks = blocks.filter(b => Math.abs(Transform.y[b] - 0.5) < 0.1);
    const level1Blocks = blocks.filter(b => Math.abs(Transform.y[b] - 1.5) < 0.1);
    const level2Blocks = blocks.filter(b => Math.abs(Transform.y[b] - 2.5) < 0.1);
    
    expect(level0Blocks.length).toBe(3);
    expect(level1Blocks.length).toBe(2);
    expect(level2Blocks.length).toBe(1);
  });
});