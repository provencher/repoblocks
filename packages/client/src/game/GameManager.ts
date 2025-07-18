import { addComponent, removeEntity } from 'bitecs';
import { world, transformQuery } from '@/core/ecs';
import { Block, Bomb } from '@/core/components';
import { createDynamicBox, createStaticBox, createSphere } from '@/physics/factories';
import { addMesh, removeMesh, createBoxMesh, createSphereMesh } from '@/rendering/RenderSystem';
import { getPhysicsWorld } from '@/physics/init';
import { unregisterPhysicsBody, entityToRigidBody } from '@/physics/PhysicsSystem';

export class GameManager {
  private entities: number[] = [];

  reset() {
    // Clear all entities
    const allEntities = transformQuery(world);
    for (let i = 0; i < allEntities.length; i++) {
      const entity = allEntities[i];
      this.removeEntity(entity);
    }
    this.entities = [];

    // Create ground
    const ground = createStaticBox(
      { x: 0, y: -0.5, z: 0 },
      { x: 50, y: 1, z: 50 }
    );
    this.entities.push(ground);

    // Create pyramid of blocks
    this.createPyramid();
  }

  private createPyramid() {
    const blockSize = 1;
    const spacing = 0.1;
    const levels = 5;
    const baseY = 0.5;

    for (let level = 0; level < levels; level++) {
      const blocksInLevel = levels - level;
      const levelY = baseY + level * (blockSize + spacing);
      
      for (let i = 0; i < blocksInLevel; i++) {
        const x = (i - (blocksInLevel - 1) / 2) * (blockSize + spacing);
        const z = 0;
        
        const entity = createDynamicBox(
          { x, y: levelY, z },
          { x: blockSize, y: blockSize, z: blockSize },
          0.5
        );
        
        addComponent(world, Block, entity);
        
        const color = 0x8B4513 + Math.random() * 0x444444;
        const mesh = createBoxMesh(blockSize, blockSize, blockSize, color);
        addMesh(entity, mesh);
        
        this.entities.push(entity);
      }
    }
  }

  shootBall(direction: { x: number; y: number; z: number }) {
    const ballRadius = 0.4;
    const shootForce = 20;
    
    // Create ball at camera position
    const entity = createSphere(
      { x: direction.x * 5, y: 10, z: 15 },
      ballRadius,
      2.0
    );
    
    addComponent(world, Bomb, entity);
    
    const mesh = createSphereMesh(ballRadius, 0xFF0000);
    addMesh(entity, mesh);
    
    // Apply velocity
    const body = entityToRigidBody.get(entity);
    if (body) {
      body.setLinvel({
        x: direction.x * shootForce,
        y: direction.y * shootForce,
        z: -shootForce
      }, true);
    }
    
    this.entities.push(entity);
    
    // Remove ball after 10 seconds
    setTimeout(() => {
      this.removeEntity(entity);
    }, 10000);
  }

  private removeEntity(entity: number) {
    removeMesh(entity);
    
    const body = entityToRigidBody.get(entity);
    if (body) {
      const physicsWorld = getPhysicsWorld();
      physicsWorld.removeRigidBody(body);
      unregisterPhysicsBody(entity);
    }
    
    removeEntity(world, entity);
  }
}