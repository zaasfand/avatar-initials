# @avyn/initials-avatar-react

React wrapper around `@avyn/initials-avatar`. Fully typed, renders as `<img>` (data URI) or inline SVG.

## Install
```bash
npm install @avyn/initials-avatar-react
```

## Usage
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

## Props
All core avatar options plus:
- `name` (string, required)
- `as` (`'img' | 'svg'`, default `'img'`)
- `className`, `style`, `title`
- `imgProps`, `svgProps` (passed through)

## Core engine
Provided by peer dependency `@avyn/initials-avatar`.

## License
MIT
