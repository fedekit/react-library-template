# Copilot Instructions for mi-lib-react

## Project Architecture

This is a **React component library** with dual ESM/CJS builds for maximum compatibility. The documentation lives in a nested `docs/` and it is an installation of Astro framework with starlight template and shares the root `node_modules`. The documentation needs to keep updated with each change.

### Key Build System: tsup (esbuild-based)

- **Main config**: `tsup.config.ts` - Outputs `.mjs` (ESM) and `.cjs` (CommonJS) to `dist/`
- **Critical**: `outExtension` function is required for proper file extensions (do NOT use object notation `{ js: ".[format]" }` - it causes `outExtension is not a function` errors)
- **Externals**: Always mark `react` and `react-dom` as external - they're peerDependencies

```typescript
// Correct pattern from tsup.config.ts
outExtension({ format }) {
  return { js: format === 'esm' ? '.mjs' : '.cjs' };
}
```

### Testing: Jest with SWC (not ts-node)

- **Config**: `jest.config.cjs` (CommonJS since package.json has `"type": "module"`)
- **Transform**: Uses `@swc/jest` with React automatic JSX runtime configuration
- **Critical SWC config** in `jest.config.cjs`:
  ```javascript
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest', {
      jsc: {
        parser: { syntax: 'typescript', tsx: true },
        transform: { react: { runtime: 'automatic' } }
      }
    }]
  }
  ```
- **No ts-node dependency** - config files use `.cjs` extension to work with `"type": "module"`
- Tests don't need `import React` due to automatic JSX runtime

### Storybook 10 with Vite 7

- **Builder**: `@storybook/react-vite` (uses esbuild like tsup for consistency)
- **Config**: `.storybook/main.ts` - NO `addon-essentials` in v10 (built-in)
- **Stories pattern**: `src/**/*.stories.@(ts|tsx)`
- **Requirements**: Node.js >=20.19.5 (enforced in package.json `engines`)

### Documentation: Astro Starlight (Nested but Shared)

- **Location**: `docs/` folder with its own `astro.config.mjs` and `tsconfig.json`
- **No separate node_modules** - uses root dependencies via `--root docs` flag
- **Commands**: `npm run docs:dev`, `npm run docs:build`, `npm run docs:preview`
- **Output**: `docs/dist/` (gitignored along with `docs/.astro`)

## Component Patterns

### Component Structure (see `src/Button/Button.tsx`)
```typescript
export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary';
};

export function Button({ variant = 'primary' }: ButtonProps) {
  // Implementation with data-attributes for styling variants
}
```

### Story Pattern (see `src/Button.stories.tsx`)
```typescript
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'Core/Button',  // Organize under "Core/" namespace
  component: Button
};

export default meta;

export const Primary: StoryObj<typeof Button> = {
  args: { children: 'Click me', variant: 'primary' }
};
```

### Test Pattern (see `src/Button/Button.test.tsx`)
- No React import needed (automatic JSX runtime)
- Use Testing Library's `render` and `screen`
- Leverage `@testing-library/jest-dom` matchers (`.toBeInTheDocument()`)

## Critical Workflows

### Adding a New Component
1. Create `src/ComponentName/ComponentName.tsx` with typed props extending HTML attributes
2. Export from `src/index.ts` and ComponentName must be the default export
3. Add `src/ComponentName/ComponentName.stories.tsx` (title pattern: `'Core/ComponentName'`)
4. Add `src/ComponentName/ComponentName.test.tsx` using RTL
5. Run `npm run build` to verify dual exports

### Build Verification
```bash
npm run build    # Check dist/ has .mjs, .cjs, .d.ts, .d.cts + sourcemaps
npm test         # Verify tests pass with SWC transform
npm run sb       # Check Storybook renders on :6006
```

### Common Issues & Solutions

**"outExtension is not a function"**
- Problem: Used object notation in tsup config
- Solution: Use function `outExtension({ format }) { return { js: ... } }`

**"ts-node is required"**
- Problem: Jest trying to parse TypeScript config
- Solution: Use `.cjs` files (jest.config.cjs, jest.setup.cjs)

**"React is not defined" in tests**
- Problem: Missing SWC automatic runtime config
- Solution: Add `react: { runtime: 'automatic' }` to `@swc/jest` transform

**Storybook won't start**
- Check Node.js version: must be >=20.19.5
- Verify Vite 7 compatibility with `npm list vite`

## Package.json Structure

- **type**: `"module"` - ESM by default
- **main**: `./dist/index.cjs` - CommonJS entry
- **module**: `./dist/index.mjs` - ESM entry
- **exports**: Conditional exports for dual-mode support
- **peerDependencies**: React >=18 (NOT in devDependencies for libraries)
- **engines**: Node >=20.19.5 (required for Storybook 10 + Vite 7)

## File Naming Conventions

- Components: `ComponentName/ComponentName.tsx`
- Stories: `ComponentName/ComponentName.stories.tsx`
- Tests: `ComponentName/ComponentName.test.tsx`
- Configs for "type: module": Use `.cjs` for CommonJS (Jest configs)
- Build output: `index.mjs` / `index.cjs` / `index.d.ts` / `index.d.cts`
