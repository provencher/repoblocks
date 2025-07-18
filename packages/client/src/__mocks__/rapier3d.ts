import { vi } from 'vitest';

const bodies = new Map();
let bodyIdCounter = 0;

export class World {
  constructor() {}
  
  createRigidBody(desc: any) {
    const id = bodyIdCounter++;
    const body = {
      handle: id,
      translation: () => ({ x: 0, y: 0, z: 0 }),
      rotation: () => ({ x: 0, y: 0, z: 0, w: 1 }),
      setLinvel: vi.fn(),
      linvel: () => ({ x: 0, y: 0, z: 0 }),
      isDynamic: () => true,
      isKinematicPositionBased: () => false,
      setNextKinematicTranslation: vi.fn(),
      setNextKinematicRotation: vi.fn()
    };
    bodies.set(id, body);
    return body;
  }
  
  createCollider(desc: any, body: any) {
    return { handle: body.handle };
  }
  
  removeRigidBody(body: any) {
    bodies.delete(body.handle);
  }
  
  step(eventQueue: any) {
    if (eventQueue && eventQueue.drainCollisionEvents) {
      eventQueue.drainCollisionEvents(() => {});
    }
  }
}

export class EventQueue {
  constructor(autoDrain: boolean) {}
  
  drainCollisionEvents(callback: Function) {
    // Mock implementation
  }
}

export const RigidBodyDesc = {
  dynamic: () => ({
    setTranslation: function() { return this; }
  }),
  fixed: () => ({
    setTranslation: function() { return this; }
  })
};

export const ColliderDesc = {
  cuboid: (x: number, y: number, z: number) => ({
    setMass: function() { return this; }
  }),
  ball: (radius: number) => ({
    setMass: function() { return this; }
  })
};