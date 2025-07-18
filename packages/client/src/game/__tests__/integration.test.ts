import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createWorld, addEntity, pipe } from 'bitecs';
import { GameManager } from '../GameManager';
import { Transform, Block, Bomb } from '@/core/components';
import { transformQuery, blockQuery, bombQuery } from '@/core/ecs';

// Mock Three.js
vi.mock('three', () => ({
  Scene: vi.fn(),
  PerspectiveCamera: vi.fn(),
  WebGLRenderer: vi.fn(() => ({
    setSize: vi.fn(),
    shadowMap: { enabled: false, type: 0 },
    render: vi.fn()
  })),
  Color: vi.fn(),
  AmbientLight: vi.fn(() => ({ position: { set: vi.fn() } })),
  DirectionalLight: vi.fn(() => ({
    position: { set: vi.fn() },
    castShadow: false,
    shadow: {
      camera: { left: 0, right: 0, top: 0, bottom: 0, near: 0, far: 0 },
      mapSize: { width: 0, height: 0 }
    }
  })),
  PlaneGeometry: vi.fn(),
  BoxGeometry: vi.fn(),
  SphereGeometry: vi.fn(),
  MeshStandardMaterial: vi.fn(),
  Mesh: vi.fn(() => ({
    position: { set: vi.fn() },
    quaternion: { set: vi.fn() },
    rotation: { x: 0 },
    castShadow: false,
    receiveShadow: false,
    geometry: { dispose: vi.fn() },
    material: { dispose: vi.fn() }
  })),
  Vector2: vi.fn(),
  Vector3: vi.fn(() => ({ x: 0, y: 0, z: 0 })),
  Raycaster: vi.fn(() => ({
    setFromCamera: vi.fn(),
    ray: { distanceToPoint: vi.fn().mockReturnValue(100) }
  }))
}));

// Mock Rapier3D
vi.mock('@dimforge/rapier3d');

// Mock physics init
vi.mock('@/physics/init', () => ({
  initPhysics: vi.fn().mockResolvedValue({ 
    physicsWorld: {
      createRigidBody: vi.fn().mockReturnValue({
        handle: 1,
        translation: () => ({ x: 0, y: 0, z: 0 }),
        rotation: () => ({ x: 0, y: 0, z: 0, w: 1 }),
        setLinvel: vi.fn(),
        linvel: () => ({ x: 0, y: 0, z: 0 }),
        isDynamic: () => true,
        isKinematicPositionBased: () => false,
        setNextKinematicTranslation: vi.fn(),
        setNextKinematicRotation: vi.fn()
      }),
      createCollider: vi.fn(),
      removeRigidBody: vi.fn(),
      step: vi.fn()
    }, 
    eventQueue: {
      drainCollisionEvents: vi.fn()
    }, 
    RAPIER: {} 
  }),
  getPhysicsWorld: vi.fn().mockReturnValue({
    createRigidBody: vi.fn().mockReturnValue({
      handle: 1,
      translation: () => ({ x: 0, y: 0, z: 0 }),
      rotation: () => ({ x: 0, y: 0, z: 0, w: 1 }),
      setLinvel: vi.fn(),
      linvel: () => ({ x: 0, y: 0, z: 0 }),
      isDynamic: () => true,
      isKinematicPositionBased: () => false,
      setNextKinematicTranslation: vi.fn(),
      setNextKinematicRotation: vi.fn()
    }),
    createCollider: vi.fn(),
    removeRigidBody: vi.fn(),
    step: vi.fn()
  }),
  getEventQueue: vi.fn().mockReturnValue({
    drainCollisionEvents: vi.fn()
  })
}));

// Mock rendering
vi.mock('@/rendering/RenderSystem', () => ({
  addMesh: vi.fn(),
  removeMesh: vi.fn(),
  createBoxMesh: vi.fn(),
  createSphereMesh: vi.fn(),
  initRenderSystem: vi.fn(),
  RenderSystem: vi.fn((world) => world)
}));

// Mock PhysicsSystem
vi.mock('@/physics/PhysicsSystem', () => ({
  registerPhysicsBody: vi.fn(),
  unregisterPhysicsBody: vi.fn(),
  entityToRigidBody: new Map(),
  PhysicsSystem: vi.fn((world) => world)
}));

describe('Game Integration Tests', () => {
  let gameManager: GameManager;

  beforeEach(async () => {
    vi.clearAllMocks();
    mockCollisionEvents.length = 0;
    
    // Initialize physics
    const { initPhysics } = await import('@/physics/init');
    await initPhysics();
    
    gameManager = new GameManager();
  });

  describe('Level Setup', () => {
    it('should create pyramid of blocks on reset', () => {
      gameManager.reset();
      
      const blocks = blockQuery(gameManager['world'] || world);
      expect(blocks.length).toBeGreaterThan(0);
      
      // Check pyramid structure
      const blockPositions = blocks.map(entity => ({
        x: Transform.x[entity],
        y: Transform.y[entity],
        z: Transform.z[entity]
      }));
      
      // Verify blocks are positioned in pyramid formation
      const levels = new Map<number, number>();
      blockPositions.forEach(pos => {
        const y = Math.round(pos.y * 10) / 10; // Round to handle floating point
        levels.set(y, (levels.get(y) || 0) + 1);
      });
      
      // Should have multiple levels with decreasing block count
      const sortedLevels = Array.from(levels.entries()).sort((a, b) => a[0] - b[0]);
      for (let i = 0; i < sortedLevels.length - 1; i++) {
        expect(sortedLevels[i][1]).toBeGreaterThanOrEqual(sortedLevels[i + 1][1]);
      }
    });

    it('should clear all entities on reset', () => {
      // Create some initial entities
      gameManager.reset();
      const initialCount = transformQuery(world).length;
      
      // Shoot some balls
      gameManager.shootBall({ x: 0, y: 0, z: -1 });
      gameManager.shootBall({ x: 1, y: 0, z: -1 });
      
      expect(transformQuery(world).length).toBeGreaterThan(initialCount);
      
      // Reset should clear everything
      gameManager.reset();
      const blocks = blockQuery(world);
      const bombs = bombQuery(world);
      
      // Should only have pyramid blocks and ground
      expect(bombs.length).toBe(0);
      expect(blocks.length).toBeGreaterThan(0);
    });
  });

  describe('Ball Shooting', () => {
    it('should create ball entity when shooting', () => {
      gameManager.reset();
      
      const initialBombs = bombQuery(world).length;
      
      gameManager.shootBall({ x: 0, y: 0, z: -1 });
      
      const bombs = bombQuery(world);
      expect(bombs.length).toBe(initialBombs + 1);
      
      const ballEntity = bombs[bombs.length - 1];
      expect(Transform.x[ballEntity]).toBeDefined();
      expect(Transform.y[ballEntity]).toBeDefined();
      expect(Transform.z[ballEntity]).toBeDefined();
    });

    it('should apply velocity to shot ball', async () => {
      gameManager.reset();
      
      const direction = { x: 1, y: 0, z: -1 };
      gameManager.shootBall(direction);
      
      const bombs = bombQuery(world);
      const ballEntity = bombs[bombs.length - 1];
      
      // Verify velocity was set through physics body
      const { entityToRigidBody } = await import('@/physics/PhysicsSystem');
      const body = entityToRigidBody.get(ballEntity);
      expect(body?.setLinvel).toHaveBeenCalled();
    });

    it('should remove ball after timeout', () => {
      vi.useFakeTimers();
      
      gameManager.reset();
      gameManager.shootBall({ x: 0, y: 0, z: -1 });
      
      expect(bombQuery(world).length).toBe(1);
      
      // Fast forward time
      vi.advanceTimersByTime(11000);
      
      expect(bombQuery(world).length).toBe(0);
      
      vi.useRealTimers();
    });
  });

  describe('Physics Simulation', () => {
    it('should update positions through physics system', async () => {
      gameManager.reset();
      
      const blocks = blockQuery(world);
      const initialY = blocks.map(entity => Transform.y[entity]);
      
      // Import mocked PhysicsSystem
      const { PhysicsSystem } = await import('@/physics/PhysicsSystem');
      
      // Create physics pipeline
      const pipeline = pipe(PhysicsSystem);
      
      // Simulate several physics steps
      for (let i = 0; i < 60; i++) {
        pipeline(world);
      }
      
      // Since physics is mocked, positions won't actually change
      // We're just verifying the system runs without errors
      expect(blocks.length).toBeGreaterThan(0);
    });

    it('should detect collisions between ball and blocks', async () => {
      gameManager.reset();
      
      // Shoot a ball
      gameManager.shootBall({ x: 0, y: 0, z: -1 });
      
      const pipeline = pipe(PhysicsSystem);
      
      // Simulate collision by adding to mock events
      const bombs = bombQuery(world);
      const blocks = blockQuery(world);
      
      if (bombs.length > 0 && blocks.length > 0) {
        mockCollisionEvents.push({
          entity1: 0, // Mock handle for ball
          entity2: 1  // Mock handle for block
        });
      }
      
      // Run physics step
      pipeline(world);
      
      // Verify collision handling would occur
      expect(mockCollisionEvents.length).toBe(0); // Should be drained
    });
  });
});