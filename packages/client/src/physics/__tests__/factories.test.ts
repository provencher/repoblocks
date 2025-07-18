import { describe, it, expect, beforeEach, vi } from 'vitest';
import { hasComponent } from 'bitecs';
import { Transform, PhysicsBody, Velocity } from '@/core/components';
import { world } from '@/core/ecs';

// Mock Rapier3D
vi.mock('@dimforge/rapier3d');

// Mock the init module
vi.mock('@/physics/init', () => ({
  getPhysicsWorld: vi.fn().mockReturnValue({
    createRigidBody: vi.fn().mockReturnValue({
      handle: 1,
      translation: () => ({ x: 0, y: 0, z: 0 }),
      rotation: () => ({ x: 0, y: 0, z: 0, w: 1 })
    }),
    createCollider: vi.fn()
  })
}));

// Mock PhysicsSystem
vi.mock('@/physics/PhysicsSystem', () => ({
  registerPhysicsBody: vi.fn(),
  unregisterPhysicsBody: vi.fn(),
  entityToRigidBody: new Map(),
  PhysicsSystem: vi.fn()
}));

describe('Physics Factories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('createDynamicBox', () => {
    it('should create entity with required components', async () => {
      const { createDynamicBox } = await import('../factories');
      
      const entity = createDynamicBox(
        { x: 1, y: 2, z: 3 },
        { x: 2, y: 2, z: 2 },
        1.0
      );
      
      expect(hasComponent(world, Transform, entity)).toBe(true);
      expect(hasComponent(world, PhysicsBody, entity)).toBe(true);
      expect(hasComponent(world, Velocity, entity)).toBe(true);
      
      expect(Transform.x[entity]).toBe(1);
      expect(Transform.y[entity]).toBe(2);
      expect(Transform.z[entity]).toBe(3);
    });
  });

  describe('createStaticBox', () => {
    it('should create entity without velocity component', async () => {
      const { createStaticBox } = await import('../factories');
      
      const entity = createStaticBox(
        { x: 0, y: 0, z: 0 },
        { x: 10, y: 1, z: 10 }
      );
      
      expect(hasComponent(world, Transform, entity)).toBe(true);
      expect(hasComponent(world, PhysicsBody, entity)).toBe(true);
      expect(hasComponent(world, Velocity, entity)).toBe(false);
    });
  });

  describe('createSphere', () => {
    it('should create sphere entity with all components', async () => {
      const { createSphere } = await import('../factories');
      
      const entity = createSphere(
        { x: 5, y: 5, z: 5 },
        0.5,
        2.0
      );
      
      expect(hasComponent(world, Transform, entity)).toBe(true);
      expect(hasComponent(world, PhysicsBody, entity)).toBe(true);
      expect(hasComponent(world, Velocity, entity)).toBe(true);
      
      expect(Transform.x[entity]).toBe(5);
      expect(Transform.y[entity]).toBe(5);
      expect(Transform.z[entity]).toBe(5);
    });
  });
});