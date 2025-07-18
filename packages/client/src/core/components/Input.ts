import { defineComponent, Types } from 'bitecs';

export const Input = defineComponent({
  dragStartX: Types.f32,
  dragStartY: Types.f32,
  dragEndX: Types.f32,
  dragEndY: Types.f32,
  pointerId: Types.i32,
  isActive: Types.ui8,
});