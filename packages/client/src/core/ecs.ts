import { createWorld as createBitECSWorld, defineQuery } from 'bitecs';
import { Transform, Velocity, PhysicsBody, Bomb, Block, Input } from './components';

export const world = createBitECSWorld();

export const transformQuery = defineQuery([Transform]);
export const physicsQuery = defineQuery([Transform, PhysicsBody]);
export const velocityQuery = defineQuery([Transform, Velocity]);
export const bombQuery = defineQuery([Bomb, Transform]);
export const blockQuery = defineQuery([Block, Transform]);
export const inputQuery = defineQuery([Input]);