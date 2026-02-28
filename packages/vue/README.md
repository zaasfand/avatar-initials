# @avyn/initials-avatar-vue

Vue 3 wrapper around `@avyn/initials-avatar`. Fully typed component plus plugin.

## Install
```bash
npm install @avyn/initials-avatar-vue
```

## Usage
```ts
import { createApp } from 'vue';
import { InitialsAvatarPlugin, InitialsAvatar } from '@avyn/initials-avatar-vue';

const app = createApp(App);
app.use(InitialsAvatarPlugin);
app.component('InitialsAvatar', InitialsAvatar);
```

In template:
```html
<InitialsAvatar name="Grace Hopper" :size="80" background-color="#0f172a" font-color="#e2e8f0" />
```

## Props
All core avatar options plus:
- `name` (string, required)
- `as` (`'img' | 'svg'`, default `'img'`)
- `title`

## Core engine
Provided by peer dependency `@avyn/initials-avatar`.

## License
MIT
