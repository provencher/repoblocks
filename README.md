# RepoBlocks

A 3D physics-based block destruction game built with TypeScript, Three.js, Rapier3D physics engine, and bitECS.

## 🎮 Demo

Click anywhere on the screen to shoot balls at the block tower. Try to knock down as many blocks as possible!

## 🚀 Features

- **3D Graphics**: Powered by Three.js with realistic lighting and shadows
- **Physics Simulation**: Real-time physics using Rapier3D
- **Entity Component System**: Efficient game architecture with bitECS
- **Interactive Gameplay**: Click to shoot projectiles at block towers
- **Monorepo Structure**: Clean organization with pnpm workspaces

## 🛠️ Tech Stack

- **TypeScript**: Type-safe development
- **Three.js**: 3D graphics rendering
- **Rapier3D**: High-performance physics engine
- **bitECS**: Entity Component System for game logic
- **Vite**: Fast build tooling
- **Vitest**: Unit and integration testing
- **pnpm**: Efficient package management

## 📦 Installation

### Prerequisites

- Node.js >= 18
- pnpm (install with `npm install -g pnpm`)

### Setup

```bash
# Clone the repository
git clone https://github.com/provencher/repoblocks.git
cd repoblocks

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The game will be available at `http://localhost:5173`

## 🎯 How to Play

1. **Shoot**: Click anywhere on the screen to shoot a ball
2. **Aim**: The ball will be shot from your click position toward the tower
3. **Reset**: Click the "Reset Level" button to rebuild the tower

## 🏗️ Architecture

### Entity Component System (ECS)

The game uses bitECS for high-performance entity management:

- **Entities**: Game objects (blocks, balls, ground)
- **Components**: Data containers (Transform, Velocity, PhysicsBody)
- **Systems**: Logic processors (PhysicsSystem, RenderSystem, InputSystem)

### Project Structure

```
repoblocks/
├── packages/
│   └── client/              # Frontend game client
│       ├── src/
│       │   ├── core/        # ECS setup and components
│       │   ├── physics/     # Rapier3D integration
│       │   ├── rendering/   # Three.js rendering
│       │   ├── input/       # User input handling
│       │   ├── game/        # Game logic
│       │   └── main.ts      # Entry point
│       └── ...
├── pnpm-workspace.yaml      # Monorepo configuration
└── package.json
```

### Key Components

- **Transform**: Position and rotation data
- **Velocity**: Linear velocity for physics bodies
- **PhysicsBody**: Reference to Rapier rigid body
- **Bomb/Block**: Tag components for game entities

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests with UI
pnpm test:ui

# Run tests in watch mode
pnpm test -- --watch
```

## 📝 Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm test` - Run test suite
- `pnpm lint` - Lint code
- `pnpm format` - Format code with Prettier
- `pnpm typecheck` - Run TypeScript type checking

## 🔧 Development

### Adding New Features

1. **Components**: Define new components in `src/core/components/`
2. **Systems**: Add systems in their respective directories
3. **Entities**: Use factories in `src/physics/factories.ts`

### Physics Configuration

The physics world is configured with:
- Gravity: -9.81 m/s² (Earth-like)
- Fixed timestep: 60 FPS
- Continuous collision detection

### Rendering

Three.js scene includes:
- Perspective camera with orbit controls potential
- Directional + ambient lighting
- Shadow mapping for realistic shadows
- WebGL renderer with antialiasing

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [GNU General Public License v3.0](LICENSE).

## 🙏 Acknowledgments

- [Three.js](https://threejs.org/) for 3D graphics
- [Rapier](https://rapier.rs/) for physics simulation
- [bitECS](https://github.com/NateTheGreatt/bitECS) for the ECS architecture
- [Vite](https://vitejs.dev/) for build tooling