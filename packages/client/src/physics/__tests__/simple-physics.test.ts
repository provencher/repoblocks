import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createWorld, addEntity, addComponent, hasComponent } from 'bitecs';
import { Transform, PhysicsBody, Velocity } from '@/core/components';

describe('Physics Components', () => {
  let world: any;

  beforeEach(() => {
    world = createWorld();
  });

  it('should create entities with physics components', () => {
    const entity = addEntity(world);
    
    addComponent(world, Transform, entity);
    addComponent(world, PhysicsBody, entity);
    addComponent(world, Velocity, entity);
    
    // Set initial values
    Transform.x[entity] = 5;
    Transform.y[entity] = 10;
    Transform.z[entity] = 0;
    
    Velocity.x[entity] = 1;
    Velocity.y[entity] = -2;
    Velocity.z[entity] = 0;
    
    PhysicsBody.handle[entity] = 42;
    
    // Verify values
    expect(Transform.x[entity]).toBe(5);
    expect(Transform.y[entity]).toBe(10);
    expect(Transform.z[entity]).toBe(0);
    
    expect(Velocity.x[entity]).toBe(1);
    expect(Velocity.y[entity]).toBe(-2);
    expect(Velocity.z[entity]).toBe(0);
    
    expect(PhysicsBody.handle[entity]).toBe(42);
  });

  it('should handle multiple entities', () => {
    const entities = [];
    
    // Create 10 entities
    for (let i = 0; i < 10; i++) {
      const entity = addEntity(world);
      addComponent(world, Transform, entity);
      addComponent(world, PhysicsBody, entity);
      
      Transform.x[entity] = i;
      Transform.y[entity] = i * 2;
      Transform.z[entity] = i * 3;
      
      entities.push(entity);
    }
    
    // Verify all entities
    entities.forEach((entity, i) => {
      expect(Transform.x[entity]).toBe(i);
      expect(Transform.y[entity]).toBe(i * 2);
      expect(Transform.z[entity]).toBe(i * 3);
    });
  });
});