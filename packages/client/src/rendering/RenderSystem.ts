import { System, addComponent } from 'bitecs';
import { Transform, Bomb, Block } from '@/core/components';
import { transformQuery, world } from '@/core/ecs';
import * as THREE from 'three';
import { Scene } from './Scene';

interface MeshComponent {
  mesh: THREE.Mesh;
}

const Mesh = new Map<number, MeshComponent>();
let sceneRef: Scene;

export function initRenderSystem(scene: Scene) {
  sceneRef = scene;
}

export function addMesh(entity: number, mesh: THREE.Mesh) {
  Mesh.set(entity, { mesh });
  sceneRef.scene.add(mesh);
}

export function removeMesh(entity: number) {
  const meshComp = Mesh.get(entity);
  if (meshComp) {
    sceneRef.scene.remove(meshComp.mesh);
    meshComp.mesh.geometry.dispose();
    if (meshComp.mesh.material instanceof THREE.Material) {
      meshComp.mesh.material.dispose();
    }
    Mesh.delete(entity);
  }
}

export function createBoxMesh(width: number, height: number, depth: number, color: number): THREE.Mesh {
  const geometry = new THREE.BoxGeometry(width, height, depth);
  const material = new THREE.MeshStandardMaterial({ 
    color,
    roughness: 0.7,
    metalness: 0.3
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export function createSphereMesh(radius: number, color: number): THREE.Mesh {
  const geometry = new THREE.SphereGeometry(radius, 32, 16);
  const material = new THREE.MeshStandardMaterial({ 
    color,
    roughness: 0.5,
    metalness: 0.5
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

export const RenderSystem: System = (world) => {
  const entities = transformQuery(world);
  
  for (let i = 0; i < entities.length; i++) {
    const entity = entities[i];
    const meshComp = Mesh.get(entity);
    
    if (meshComp) {
      meshComp.mesh.position.set(
        Transform.x[entity],
        Transform.y[entity],
        Transform.z[entity]
      );
      
      meshComp.mesh.quaternion.set(
        Transform.qx[entity],
        Transform.qy[entity],
        Transform.qz[entity],
        Transform.qw[entity]
      );
    }
  }
  
  sceneRef.render();
  
  return world;
};