# @avyn/initials-avatar

Framework-agnostic SVG initials avatar generator. No dependencies, ships ESM + CJS + types, works in Node, browsers, and SSR.

## Install
```bash
npm install @avyn/initials-avatar
```

## Quick start
```ts
import { createAvatarSvg, createAvatarDataUri, createAvatar } from '@avyn/initials-avatar';

const svg = createAvatarSvg('Ada Lovelace', { backgroundColor: '#111827', fontColor: '#f8fafc' });
const dataUri = createAvatarDataUri('Grace Hopper', { bold: true });
const { svg: svgString, dataUri } = createAvatar('Alan Turing');
```

## Options
- size (px, default 96)
- backgroundColor (default deterministic from name)
- fontColor (default white)
- fontSize (default 42% of size)
- fontFamily (default Segoe UI/Arial)
- borderWidth, borderColor, borderRadius
- bold (font weight)
- initialsOverride

## HTTP helpers
```ts
import { createExpressHandler, createFastifyHandler, createNestHandler } from '@avyn/initials-avatar';

app.get('/avatar', createExpressHandler({ nameKey: 'name', cacheControl: 'public, max-age=86400' }));
```

## React/Vue wrappers
- React: `@avyn/initials-avatar-react`
- Vue 3: `@avyn/initials-avatar-vue`

## License
MIT
