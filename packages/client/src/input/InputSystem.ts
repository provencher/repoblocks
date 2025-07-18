import { System, addComponent, removeComponent } from 'bitecs';
import { Input, Bomb, Transform, Velocity } from '@/core/components';
import { bombQuery, world } from '@/core/ecs';
import * as THREE from 'three';

let canvas: HTMLCanvasElement;
let camera: THREE.Camera;
let raycaster = new THREE.Raycaster();
let mouse = new THREE.Vector2();
let activeDrags = new Map<number, number>();

export function initInputSystem(canvasElement: HTMLCanvasElement, cameraRef: THREE.Camera) {
  canvas = canvasElement;
  camera = cameraRef;
  
  canvas.addEventListener('pointerdown', handlePointerDown);
  canvas.addEventListener('pointermove', handlePointerMove);
  canvas.addEventListener('pointerup', handlePointerUp);
  canvas.addEventListener('pointercancel', handlePointerCancel);
}

function handlePointerDown(event: PointerEvent) {
  updateMousePosition(event);
  
  const bombEntity = findBombAtPosition();
  if (bombEntity !== null) {
    addComponent(world, Input, bombEntity);
    Input.dragStartX[bombEntity] = mouse.x;
    Input.dragStartY[bombEntity] = mouse.y;
    Input.dragEndX[bombEntity] = mouse.x;
    Input.dragEndY[bombEntity] = mouse.y;
    Input.pointerId[bombEntity] = event.pointerId;
    Input.isActive[bombEntity] = 1;
    
    activeDrags.set(event.pointerId, bombEntity);
    canvas.setPointerCapture(event.pointerId);
  }
}

function handlePointerMove(event: PointerEvent) {
  const bombEntity = activeDrags.get(event.pointerId);
  if (bombEntity !== undefined && Input.isActive[bombEntity]) {
    updateMousePosition(event);
    Input.dragEndX[bombEntity] = mouse.x;
    Input.dragEndY[bombEntity] = mouse.y;
  }
}

function handlePointerUp(event: PointerEvent) {
  const bombEntity = activeDrags.get(event.pointerId);
  if (bombEntity !== undefined) {
    if (Input.isActive[bombEntity]) {
      updateMousePosition(event);
      
      const deltaX = Input.dragEndX[bombEntity] - Input.dragStartX[bombEntity];
      const deltaY = Input.dragEndY[bombEntity] - Input.dragStartY[bombEntity];
      
      const throwVector = new THREE.Vector3(deltaX * 10, -deltaY * 10, -5);
      
      Velocity.x[bombEntity] = throwVector.x;
      Velocity.y[bombEntity] = throwVector.y;
      Velocity.z[bombEntity] = throwVector.z;
      
      removeComponent(world, Input, bombEntity);
    }
    
    activeDrags.delete(event.pointerId);
    canvas.releasePointerCapture(event.pointerId);
  }
}

function handlePointerCancel(event: PointerEvent) {
  handlePointerUp(event);
}

function updateMousePosition(event: PointerEvent) {
  const rect = canvas.getBoundingClientRect();
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
}

function findBombAtPosition(): number | null {
  raycaster.setFromCamera(mouse, camera);
  
  const bombs = bombQuery(world);
  let closestBomb: number | null = null;
  let closestDistance = Infinity;
  
  for (let i = 0; i < bombs.length; i++) {
    const entity = bombs[i];
    const position = new THREE.Vector3(
      Transform.x[entity],
      Transform.y[entity],
      Transform.z[entity]
    );
    
    const distance = raycaster.ray.distanceToPoint(position);
    
    if (distance < 1.0 && distance < closestDistance) {
      closestDistance = distance;
      closestBomb = entity;
    }
  }
  
  return closestBomb;
}

export const InputSystem: System = (world) => {
  return world;
};