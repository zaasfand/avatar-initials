export type AvatarOptions = {
  /** Overall square size in pixels */
  size?: number;
  /** Background color (hex, rgb, hsl). Falls back to deterministic color from the name */
  backgroundColor?: string;
  /** Text color */
  fontColor?: string;
  /** Font size in pixels */
  fontSize?: number;
  /** Font family string */
  fontFamily?: string;
  /** Border width in pixels */
  borderWidth?: number;
  /** Border color */
  borderColor?: string;
  /** Corner radius in pixels */
  borderRadius?: number;
  /** Render bold text */
  bold?: boolean;
  /** Explicit initials override */
  initialsOverride?: string;
};

export type AvatarPayload = {
  svg: string;
  dataUri: string;
};

export type ExpressResponseLike = {
  setHeader?: (name: string, value: string) => unknown;
  send: (body: unknown) => unknown;
};

export type FastifyReplyLike = {
  header?: (name: string, value: string) => unknown;
  send: (body: unknown) => unknown;
};

export type NestResponseLike = {
  setHeader?: (name: string, value: string) => unknown;
  header?: (name: string, value: string) => unknown;
  send: (body: unknown) => unknown;
};

export type HandlerOptions = {
  /** Query/body key to read the name from when no resolver is provided */
  nameKey?: string;
  /** Custom resolver to derive the display name */
  resolveName?: (req: unknown) => string | undefined;
  /** Avatar rendering options */
  avatarOptions?: AvatarOptions;
  /** Optional cache control header value */
  cacheControl?: string;
};

const DEFAULT_SIZE = 96;
const DEFAULT_FONT_FAMILY = '"Segoe UI", Arial, sans-serif';

export function getInitials(name: string): string {
  const cleaned = (name ?? '').trim();
  if (!cleaned) return '?';
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    const [firstChar, secondChar] = [...parts[0]].filter(Boolean);
    return (firstChar ?? '').toUpperCase() + (secondChar ?? '').toUpperCase();
  }
  const first = parts[0]?.[0] ?? '';
  const last = parts[parts.length - 1]?.[0] ?? '';
  return `${first}${last}`.toUpperCase();
}

export function createAvatarSvg(name: string, options: AvatarOptions = {}): string {
  const size = options.size ?? DEFAULT_SIZE;
  const backgroundColor = options.backgroundColor ?? stringToColor(name);
  const fontColor = options.fontColor ?? '#ffffff';
  const fontSize = options.fontSize ?? Math.round(size * 0.42);
  const fontFamily = options.fontFamily ?? DEFAULT_FONT_FAMILY;
  const borderWidth = options.borderWidth ?? 0;
  const borderColor = options.borderColor ?? 'transparent';
  const borderRadius = clamp(options.borderRadius ?? size * 0.2, 0, size / 2);
  const fontWeight = options.bold ? 700 : 600;
  const initials = (options.initialsOverride ?? getInitials(name)).slice(0, 3);
  const ariaLabel = name && name.trim().length > 0 ? name.trim() : 'Avatar';

  return [
    '<svg xmlns="http://www.w3.org/2000/svg" role="img"',
    ` width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"`,
    ` aria-label="${escapeXml(ariaLabel)}">`,
    `<rect width="${size}" height="${size}" fill="${escapeXml(backgroundColor)}"`,
    ` stroke="${escapeXml(borderColor)}" stroke-width="${borderWidth}"`,
    ` rx="${borderRadius}" ry="${borderRadius}"/>`,
    `<text x="50%" y="50%" fill="${escapeXml(fontColor)}"`,
    ` font-family="${escapeXml(fontFamily)}" font-size="${fontSize}"`,
    ` font-weight="${fontWeight}" text-anchor="middle"`,
    ' dominant-baseline="central">',
    `${escapeXml(initials)}`,
    '</text>',
    '</svg>'
  ].join('');
}

export function createAvatarDataUri(name: string, options: AvatarOptions = {}): string {
  const svg = createAvatarSvg(name, options);
  const encoded = toBase64(svg);
  return `data:image/svg+xml;base64,${encoded}`;
}

export function createAvatar(name: string, options: AvatarOptions = {}): AvatarPayload {
  const svg = createAvatarSvg(name, options);
  const dataUri = createAvatarDataUri(name, options);
  return { svg, dataUri };
}

export function createHttpResponse(name: string, options: AvatarOptions = {}): { contentType: string; body: string } {
  return {
    contentType: 'image/svg+xml',
    body: createAvatarSvg(name, options)
  };
}

export function sendExpressAvatar(res: ExpressResponseLike, name: string, options: AvatarOptions = {}, handlerOptions: Omit<HandlerOptions, 'avatarOptions'> = {}): void {
  const payload = createHttpResponse(name, options);
  res.setHeader?.('Content-Type', payload.contentType);
  if (handlerOptions.cacheControl) res.setHeader?.('Cache-Control', handlerOptions.cacheControl);
  res.send(payload.body);
}

export function sendFastifyAvatar(reply: FastifyReplyLike, name: string, options: AvatarOptions = {}, handlerOptions: Omit<HandlerOptions, 'avatarOptions'> = {}): void {
  const payload = createHttpResponse(name, options);
  reply.header?.('Content-Type', payload.contentType);
  if (handlerOptions.cacheControl) reply.header?.('Cache-Control', handlerOptions.cacheControl);
  reply.send(payload.body);
}

export function sendNestAvatar(res: NestResponseLike, name: string, options: AvatarOptions = {}, handlerOptions: Omit<HandlerOptions, 'avatarOptions'> = {}): void {
  const payload = createHttpResponse(name, options);
  const set = res.header ?? res.setHeader;
  set?.call(res, 'Content-Type', payload.contentType);
  if (handlerOptions.cacheControl) set?.call(res, 'Cache-Control', handlerOptions.cacheControl);
  res.send(payload.body);
}

export function createExpressHandler(handlerOptions: HandlerOptions = {}) {
  return (req: unknown, res: ExpressResponseLike) => {
    const name = resolveNameFromRequest(req, handlerOptions) ?? 'User';
    sendExpressAvatar(res, name, handlerOptions.avatarOptions, handlerOptions);
  };
}

export function createFastifyHandler(handlerOptions: HandlerOptions = {}) {
  return (req: unknown, reply: FastifyReplyLike) => {
    const name = resolveNameFromRequest(req, handlerOptions) ?? 'User';
    sendFastifyAvatar(reply, name, handlerOptions.avatarOptions, handlerOptions);
  };
}

export function createNestHandler(handlerOptions: HandlerOptions = {}) {
  return (req: unknown, res: NestResponseLike) => {
    const name = resolveNameFromRequest(req, handlerOptions) ?? 'User';
    sendNestAvatar(res, name, handlerOptions.avatarOptions, handlerOptions);
  };
}

function resolveNameFromRequest(req: unknown, handlerOptions: HandlerOptions): string | undefined {
  if (handlerOptions.resolveName) return handlerOptions.resolveName(req);
  const key = handlerOptions.nameKey ?? 'name';
  const record = req as Record<string, unknown> | undefined;
  const maybeQuery = (record?.query as Record<string, unknown> | undefined)?.[key];
  const maybeBody = (record?.body as Record<string, unknown> | undefined)?.[key];
  const maybeParams = (record?.params as Record<string, unknown> | undefined)?.[key];
  const candidate = [maybeQuery, maybeBody, maybeParams].find((value) => typeof value === 'string' && value.trim().length > 0);
  if (typeof candidate === 'string') return candidate;
  return undefined;
}

function clamp(value: number, min: number, max: number): number {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function stringToColor(input: string): string {
  const value = (input ?? '').trim();
  if (!value) return '#444444';
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
    hash &= hash; // force 32-bit
  }
  const hue = Math.abs(hash) % 360;
  const saturation = 65;
  const lightness = 55;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

function toBase64(svg: string): string {
  const globalRef: typeof globalThis | undefined = typeof globalThis !== 'undefined' ? globalThis : undefined;
  const bufferCtor = globalRef && (globalRef as { Buffer?: { from: (input: string, encoding: string) => { toString: (enc: string) => string } } }).Buffer;
  if (bufferCtor) {
    return bufferCtor.from(svg, 'utf8').toString('base64');
  }
  const btoaFn = globalRef && (globalRef as { btoa?: (data: string) => string }).btoa;
  if (btoaFn) {
    return btoaFn(unescape(encodeURIComponent(svg)));
  }
  throw new Error('No base64 encoder available in this environment.');
}
