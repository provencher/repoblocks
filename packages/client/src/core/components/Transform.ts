import { defineComponent, Types } from 'bitecs';

export const Transform = defineComponent({
  x: Types.f32,
  y: Types.f32,
  z: Types.f32,
  qx: Types.f32,
  qy: Types.f32,
  qz: Types.f32,
  qw: Types.f32,
});