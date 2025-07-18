import { describe, it, expect, beforeEach } from 'vitest';
import { createWorld, addEntity, addComponent, hasComponent, removeEntity } from 'bitecs';
import { Transform, Velocity, PhysicsBody, Bomb, Block } from '../components';

describe('ECS Core', () => {
  let world: any;

  beforeEach(() => {
    world = createWorld();
  });

  describe('Components', () => {
    it('should create and add Transform component', () => {
      const entity = addEntity(world);
      addComponent(world, Transform, entity);
      
      expect(hasComponent(world, Transform, entity)).toBe(true);
      expect(Transform.x[entity]).toBeDefined();
      expect(Transform.y[entity]).toBeDefined();
      expect(Transform.z[entity]).toBeDefined();
    });

    it('should create and add Velocity component', () => {
      const entity = addEntity(world);
      addComponent(world, Velocity, entity);
      
      expect(hasComponent(world, Velocity, entity)).toBe(true);
      expect(Velocity.x[entity]).toBeDefined();
      expect(Velocity.y[entity]).toBeDefined();
      expect(Velocity.z[entity]).toBeDefined();
    });

    it('should create and add PhysicsBody component', () => {
      const entity = addEntity(world);
      addComponent(world, PhysicsBody, entity);
      
      expect(hasComponent(world, PhysicsBody, entity)).toBe(true);
      expect(PhysicsBody.handle[entity]).toBeDefined();
    });

    it('should handle tag components', () => {
      const entity = addEntity(world);
      addComponent(world, Bomb, entity);
      addComponent(world, Transform, entity);
      
      expect(hasComponent(world, Bomb, entity)).toBe(true);
      expect(hasComponent(world, Transform, entity)).toBe(true);
      expect(hasComponent(world, Block, entity)).toBe(false);
    });
  });

  describe('Entity Management', () => {
    it('should add and remove entities', () => {
      const entity = addEntity(world);
      addComponent(world, Transform, entity);
      
      expect(hasComponent(world, Transform, entity)).toBe(true);
      
      removeEntity(world, entity);
      
      expect(hasComponent(world, Transform, entity)).toBe(false);
    });

    it('should handle multiple components on same entity', () => {
      const entity = addEntity(world);
      addComponent(world, Transform, entity);
      addComponent(world, Velocity, entity);
      addComponent(world, PhysicsBody, entity);
      
      expect(hasComponent(world, Transform, entity)).toBe(true);
      expect(hasComponent(world, Velocity, entity)).toBe(true);
      expect(hasComponent(world, PhysicsBody, entity)).toBe(true);
    });
  });
});