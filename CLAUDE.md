# CLAUDE.md - AI Assistant Context

This file provides context for AI assistants (like Claude) working on the RepoBlocks project.

## Project Overview

RepoBlocks is a 3D physics-based game where players shoot balls at block towers to knock them down. It's built with modern web technologies and follows best practices for game development.

## Architecture Decisions

### Entity Component System (ECS)
- **Why bitECS**: Chosen for its performance and data-oriented design
- **Components are POD**: Components only contain data, no logic
- **Systems contain logic**: All game logic lives in systems that operate on components
- **Queries are cached**: Use the pre-defined queries in `ecs.ts` for performance

### Physics Engine
- **Rapier3D**: WebAssembly-based physics for performance
- **Fixed timestep**: Physics runs at 60 FPS regardless of render framerate
- **Async initialization**: Rapier WASM must be loaded before use

### Rendering
- **Three.js**: Industry-standard 3D library
- **Separation of concerns**: Rendering system only reads Transform components
- **Shadow mapping**: Enabled for visual quality

## Key Patterns

### Creating Entities
```typescript
// Always use factories for consistency
const box = createDynamicBox(position, size, mass);
addComponent(world, Block, box);
const mesh = createBoxMesh(size.x, size.y, size.z, color);
addMesh(box, mesh);
```

### System Updates
```typescript
// Systems are pure functions that transform the world
const pipeline = pipe(PhysicsSystem, RenderSystem);
pipeline(world);
```

### Component Access
```typescript
// Direct array access for performance
Transform.x[entity] = 10;
Transform.y[entity] = 5;
Transform.z[entity] = 0;
```

## Common Tasks

### Adding a New Component
1. Create component file in `src/core/components/`
2. Export from `components/index.ts`
3. Add query in `ecs.ts` if needed

### Adding a New System
1. Create system file following naming convention
2. Export a System function that takes and returns world
3. Add to the pipeline in `main.ts`

### Adding Game Features
1. Design components first (what data is needed?)
2. Create systems to process the components
3. Use factories to create entities with proper setup

## Testing Strategy

### Unit Tests
- Test components in isolation
- Mock physics and rendering for game logic tests
- Use simple assertions on component values

### Integration Tests
- Would test actual physics simulation
- Currently simplified due to WASM complexity
- Focus on component interactions

## Performance Considerations

- **Minimize allocations**: Reuse objects where possible
- **Batch operations**: Group similar operations together
- **Use queries**: Don't manually filter entities
- **Fixed-size components**: bitECS uses typed arrays

## Code Style

- **No comments**: Code should be self-documenting
- **Prefer composition**: Small, focused functions
- **Type everything**: Leverage TypeScript fully
- **Functional style**: Prefer immutability where performance allows

## Debugging Tips

- **Entity IDs**: Are just numbers, starting from 0
- **Component arrays**: Can be inspected directly (e.g., `Transform.x`)
- **Physics bodies**: Check `entityToRigidBody` map
- **Render meshes**: Stored in separate Map in RenderSystem

## Known Limitations

- **Browser-only**: Rapier3D requires WASM support
- **No networking**: Currently single-player only
- **Simple gameplay**: Designed as a foundation for expansion

## Future Considerations

- **Multiplayer**: Would need deterministic physics
- **More game modes**: Current architecture supports expansion
- **Level editor**: Component system makes this straightforward
- **Performance**: Current design can handle 1000s of entities

## Development Workflow

1. **Start dev server**: `pnpm dev`
2. **Run tests**: `pnpm test`
3. **Check types**: `pnpm typecheck`
4. **Format code**: `pnpm format`

## Troubleshooting

### "Cannot find module" in tests
- Vitest has issues with Rapier3D WASM
- Tests use mocked physics for now

### Physics not working
- Ensure `initPhysics()` is awaited
- Check that entities have all required components
- Verify physics body registration

### Rendering issues
- Ensure mesh is added with `addMesh()`
- Check Transform component values
- Verify camera position

## Resources

- [bitECS Documentation](https://github.com/NateTheGreatt/bitECS)
- [Rapier Documentation](https://rapier.rs/docs/)
- [Three.js Documentation](https://threejs.org/docs/)
- [ECS Design Patterns](https://github.com/SanderMertens/ecs-faq)