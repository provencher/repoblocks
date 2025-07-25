import { vi } from 'vitest';

// Mock WebGL context for Three.js
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  canvas: {},
  drawingBufferWidth: 800,
  drawingBufferHeight: 600,
  getExtension: vi.fn(),
  getParameter: vi.fn(),
  createBuffer: vi.fn(),
  createTexture: vi.fn(),
  createProgram: vi.fn(),
  createShader: vi.fn(),
  bindBuffer: vi.fn(),
  bindTexture: vi.fn(),
  bufferData: vi.fn(),
  enable: vi.fn(),
  disable: vi.fn(),
  clear: vi.fn(),
  clearColor: vi.fn(),
  viewport: vi.fn(),
  useProgram: vi.fn(),
  uniformMatrix4fv: vi.fn(),
  drawArrays: vi.fn(),
  drawElements: vi.fn(),
  readPixels: vi.fn(),
  texImage2D: vi.fn(),
  texParameteri: vi.fn(),
  generateMipmap: vi.fn(),
  createFramebuffer: vi.fn(),
  bindFramebuffer: vi.fn(),
  framebufferTexture2D: vi.fn(),
  deleteFramebuffer: vi.fn(),
  createRenderbuffer: vi.fn(),
  bindRenderbuffer: vi.fn(),
  renderbufferStorage: vi.fn(),
  framebufferRenderbuffer: vi.fn(),
  deleteRenderbuffer: vi.fn(),
  checkFramebufferStatus: vi.fn(() => 36053), // FRAMEBUFFER_COMPLETE
  activeTexture: vi.fn(),
  blendFunc: vi.fn(),
  blendEquation: vi.fn(),
  blendEquationSeparate: vi.fn(),
  blendFuncSeparate: vi.fn(),
  clearDepth: vi.fn(),
  clearStencil: vi.fn(),
  colorMask: vi.fn(),
  cullFace: vi.fn(),
  depthFunc: vi.fn(),
  depthMask: vi.fn(),
  depthRange: vi.fn(),
  frontFace: vi.fn(),
  lineWidth: vi.fn(),
  polygonOffset: vi.fn(),
  scissor: vi.fn(),
  stencilFunc: vi.fn(),
  stencilFuncSeparate: vi.fn(),
  stencilMask: vi.fn(),
  stencilMaskSeparate: vi.fn(),
  stencilOp: vi.fn(),
  stencilOpSeparate: vi.fn(),
  attachShader: vi.fn(),
  bindAttribLocation: vi.fn(),
  compileShader: vi.fn(),
  deleteProgram: vi.fn(),
  deleteShader: vi.fn(),
  detachShader: vi.fn(),
  getAttachedShaders: vi.fn(),
  getProgramParameter: vi.fn(() => true),
  getProgramInfoLog: vi.fn(() => ''),
  getShaderParameter: vi.fn(() => true),
  getShaderInfoLog: vi.fn(() => ''),
  getShaderSource: vi.fn(),
  isProgram: vi.fn(),
  isShader: vi.fn(),
  linkProgram: vi.fn(),
  shaderSource: vi.fn(),
  validateProgram: vi.fn(),
  getUniformLocation: vi.fn(() => ({})),
  getAttribLocation: vi.fn(() => 0),
  enableVertexAttribArray: vi.fn(),
  disableVertexAttribArray: vi.fn(),
  vertexAttribPointer: vi.fn(),
  uniform1f: vi.fn(),
  uniform1i: vi.fn(),
  uniform2f: vi.fn(),
  uniform3f: vi.fn(),
  uniform4f: vi.fn(),
  pixelStorei: vi.fn(),
})) as any;