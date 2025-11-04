# mi-lib-react

Librería de React moderna con build dual ESM+CJS (tsup), Storybook 10, Jest+RTL y docs con Starlight.

## Scripts
- `npm run dev` — watch build con tsup
- `npm run storybook` — entorno de UI
- `npm test` — unit tests
- `npm run docs:dev` — Starlight en /docs

## Publicación
- Asegurate de tener `peerDependencies` correctas (react, react-dom)
- `npm publish --access public`