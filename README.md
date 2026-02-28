# @avyn/initials-avatar

Lightweight, dependency-free SVG initials avatar generator with React and Vue 3 wrappers. Outputs raw SVG strings or data URIs and is safe for Node, browsers, and SSR.

## Packages
- Core: `@avyn/initials-avatar`
- React wrapper: `@avyn/initials-avatar-react` (subpath export `/react` is also available when bundling from a single package source)
- Vue 3 wrapper: `@avyn/initials-avatar-vue` (subpath export `/vue` is also available when bundling from a single package source)

## Install
```bash
npm install @avyn/initials-avatar
npm install @avyn/initials-avatar-react  # React
npm install @avyn/initials-avatar-vue    # Vue 3
```

## Core usage (Node, browser, SSR)
```ts
import { createAvatarSvg, createAvatarDataUri, createAvatar } from '@avyn/initials-avatar';

const svg = createAvatarSvg('Ada Lovelace', { backgroundColor: '#111827', fontColor: '#f8fafc' });
const dataUri = createAvatarDataUri('Grace Hopper', { bold: true });
const { svg: svgString, dataUri: uri } = createAvatar('Alan Turing');
```

### HTTP helpers
```ts
// Express
import express from 'express';
import { createExpressHandler } from '@avyn/initials-avatar';

const app = express();
app.get('/avatar', createExpressHandler({ nameKey: 'name', cacheControl: 'public, max-age=86400' }));

// Nest (inside controller)
import { sendNestAvatar } from '@avyn/initials-avatar';
@Get('avatar')
getAvatar(@Req() req: any, @Res() res: any) {
	sendNestAvatar(res, req.query.name ?? 'Nest User');
}

// Fastify
import { createFastifyHandler } from '@avyn/initials-avatar';
fastify.get('/avatar', createFastifyHandler({ nameKey: 'name' }));
```

## React
```tsx
import { InitialsAvatar } from '@avyn/initials-avatar-react';

export function ProfileAvatar() {
	return (
		<InitialsAvatar
			name="Ada Lovelace"
			size={96}
			backgroundColor="#111827"
			fontColor="#f8fafc"
			borderRadius={16}
			bold
		/>
	);
}
```

## Vue 3
```ts
import { createApp } from 'vue';
import { InitialsAvatarPlugin, InitialsAvatar } from '@avyn/initials-avatar-vue';

const app = createApp(App);
app.use(InitialsAvatarPlugin);
app.component('InitialsAvatar', InitialsAvatar);

// In template
// <InitialsAvatar name="Grace Hopper" :size="80" background-color="#0f172a" font-color="#e2e8f0" />
```

## Options (shared)
- `size`: square size in px (default 96)
- `backgroundColor`: fill color (auto-generated from name if omitted)
- `fontColor`: text color (default white)
- `fontSize`: text size in px (defaults to 42% of size)
- `fontFamily`: font stack string (default Segoe UI/Arial)
- `borderWidth`: stroke width in px (default 0)
- `borderColor`: stroke color
- `borderRadius`: corner radius in px (default 20% of size)
- `bold`: toggle heavier font weight
- `initialsOverride`: manually set the displayed initials

## Scripts
- `npm run build` (from repo root): builds all packages to ESM + CJS with bundled type declarations.
- Each package also exposes its own `npm run build` inside `packages/<name>`.

## Publishing
1. Bump versions in each package under `packages/`.
2. From each package directory, run `npm publish --access public` (core first, then React/Vue wrappers).

## License
MIT