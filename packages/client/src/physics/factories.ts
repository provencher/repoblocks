import { addEntity, addComponent } from 'bitecs';
import { Transform, PhysicsBody, Velocity } from '@/core/components';
import { world } from '@/core/ecs';
import { getPhysicsWorld } from './init';
import { registerPhysicsBody } from './PhysicsSystem';
import { 
  RigidBodyDesc, 
  ColliderDesc,
  RigidBodyType,
} from '@dimforge/rapier3d';

interface Vec3 {
  x: number;
  y: number;
  z: number;
}

export function createDynamicBox(position: Vec3, size: Vec3, mass: number = 1.0): number {
  const physicsWorld = getPhysicsWorld();
  const entity = addEntity(world);
  
  addComponent(world, Transform, entity);
  addComponent(world, PhysicsBody, entity);
  addComponent(world, Velocity, entity);
  
  Transform.x[entity] = position.x;
  Transform.y[entity] = position.y;
  Transform.z[entity] = position.z;
  Transform.qx[entity] = 0;
  Transform.qy[entity] = 0;
  Transform.qz[entity] = 0;
  Transform.qw[entity] = 1;
  
  Velocity.x[entity] = 0;
  Velocity.y[entity] = 0;
  Velocity.z[entity] = 0;
  
  const bodyDesc = RigidBodyDesc.dynamic()
    .setTranslation(position.x, position.y, position.z);
  
  const body = physicsWorld.createRigidBody(bodyDesc);
  
  const colliderDesc = ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2)
    .setMass(mass);
  
  physicsWorld.createCollider(colliderDesc, body);
  
  registerPhysicsBody(entity, body);
  
  return entity;
}

export function createStaticBox(position: Vec3, size: Vec3): number {
  const physicsWorld = getPhysicsWorld();
  const entity = addEntity(world);
  
  addComponent(world, Transform, entity);
  addComponent(world, PhysicsBody, entity);
  
  Transform.x[entity] = position.x;
  Transform.y[entity] = position.y;
  Transform.z[entity] = position.z;
  Transform.qx[entity] = 0;
  Transform.qy[entity] = 0;
  Transform.qz[entity] = 0;
  Transform.qw[entity] = 1;
  
  const bodyDesc = RigidBodyDesc.fixed()
    .setTranslation(position.x, position.y, position.z);
  
  const body = physicsWorld.createRigidBody(bodyDesc);
  
  const colliderDesc = ColliderDesc.cuboid(size.x / 2, size.y / 2, size.z / 2);
  
  physicsWorld.createCollider(colliderDesc, body);
  
  registerPhysicsBody(entity, body);
  
  return entity;
}

export function createSphere(position: Vec3, radius: number, mass: number = 1.0): number {
  const physicsWorld = getPhysicsWorld();
  const entity = addEntity(world);
  
  addComponent(world, Transform, entity);
  addComponent(world, PhysicsBody, entity);
  addComponent(world, Velocity, entity);
  
  Transform.x[entity] = position.x;
  Transform.y[entity] = position.y;
  Transform.z[entity] = position.z;
  Transform.qx[entity] = 0;
  Transform.qy[entity] = 0;
  Transform.qz[entity] = 0;
  Transform.qw[entity] = 1;
  
  Velocity.x[entity] = 0;
  Velocity.y[entity] = 0;
  Velocity.z[entity] = 0;
  
  const bodyDesc = RigidBodyDesc.dynamic()
    .setTranslation(position.x, position.y, position.z);
  
  const body = physicsWorld.createRigidBody(bodyDesc);
  
  const colliderDesc = ColliderDesc.ball(radius)
    .setMass(mass);
  
  physicsWorld.createCollider(colliderDesc, body);
  
  registerPhysicsBody(entity, body);
  
  return entity;
}