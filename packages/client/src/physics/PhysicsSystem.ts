import { System } from 'bitecs';
import { Transform, PhysicsBody, Velocity } from '@/core/components';
import { physicsQuery, velocityQuery, world } from '@/core/ecs';
import { getPhysicsWorld, getEventQueue } from './init';
import { RigidBody } from '@dimforge/rapier3d';

const FIXED_DT = 1.0 / 60.0;
const bodyHandleToEntity = new Map<number, number>();
export const entityToRigidBody = new Map<number, RigidBody>();

export function registerPhysicsBody(entity: number, body: RigidBody) {
  const handle = body.handle;
  PhysicsBody.handle[entity] = handle;
  bodyHandleToEntity.set(handle, entity);
  entityToRigidBody.set(entity, body);
}

export function unregisterPhysicsBody(entity: number) {
  const handle = PhysicsBody.handle[entity];
  if (handle !== undefined) {
    bodyHandleToEntity.delete(handle);
    entityToRigidBody.delete(entity);
  }
}

export function getEntityByBodyHandle(handle: number): number | undefined {
  return bodyHandleToEntity.get(handle);
}

export const PhysicsSystem: System = (world) => {
  const physicsWorld = getPhysicsWorld();
  const eventQueue = getEventQueue();
  
  const entities = physicsQuery(world);
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const body = entityToRigidBody.get(entity);
    
    if (body && body.isKinematicPositionBased()) {
      body.setNextKinematicTranslation({
        x: Transform.x[entity],
        y: Transform.y[entity],
        z: Transform.z[entity],
      });
      body.setNextKinematicRotation({
        x: Transform.qx[entity],
        y: Transform.qy[entity],
        z: Transform.qz[entity],
        w: Transform.qw[entity],
      });
    }
  }
  
  const velocityEntities = velocityQuery(world);
  for (let i = 0; i < velocityEntities.length; i++) {
    const entity = velocityEntities[i];
    const body = entityToRigidBody.get(entity);
    
    if (body && body.isDynamic()) {
      body.setLinvel({
        x: Velocity.x[entity],
        y: Velocity.y[entity],
        z: Velocity.z[entity],
      }, true);
    }
  }
  
  physicsWorld.step(eventQueue);
  
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const body = entityToRigidBody.get(entity);
    
    if (body && !body.isKinematicPositionBased()) {
      const translation = body.translation();
      const rotation = body.rotation();
      
      Transform.x[entity] = translation.x;
      Transform.y[entity] = translation.y;
      Transform.z[entity] = translation.z;
      Transform.qx[entity] = rotation.x;
      Transform.qy[entity] = rotation.y;
      Transform.qz[entity] = rotation.z;
      Transform.qw[entity] = rotation.w;
      
      if (body.isDynamic() && Velocity.x[entity] !== undefined) {
        const vel = body.linvel();
        Velocity.x[entity] = vel.x;
        Velocity.y[entity] = vel.y;
        Velocity.z[entity] = vel.z;
      }
    }
  }
  
  return world;
};