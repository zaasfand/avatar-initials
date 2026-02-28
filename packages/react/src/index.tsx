import React, { CSSProperties, HTMLAttributes, ImgHTMLAttributes, useMemo } from 'react';
import { AvatarOptions, createAvatarDataUri, createAvatarSvg, getInitials } from '@avyn/initials-avatar';

export type InitialsAvatarProps = AvatarOptions & {
  /** Name used to derive initials */
  name: string;
  /** Accessible alternative text; falls back to the provided name */
  alt?: string;
  /** Render as <img> (default) or inline <svg> */
  as?: 'img' | 'svg';
  /** Optional CSS class */
  className?: string;
  /** Optional style object */
  style?: CSSProperties;
  /** Optional title attribute */
  title?: string;
  /** Extra props passed to the underlying <img> element */
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'title'>;
  /** Extra props passed to the inline <span> wrapper */
  svgProps?: Omit<HTMLAttributes<HTMLSpanElement>, 'dangerouslySetInnerHTML'>;
};

const DEFAULT_SIZE = 96;

export const InitialsAvatar: React.FC<InitialsAvatarProps> = ({
  name,
  alt,
  as = 'img',
  className,
  style,
  title,
  imgProps,
  svgProps,
  ...avatarOptions
}) => {
  const size = avatarOptions.size ?? DEFAULT_SIZE;
  const memoKey = useMemo(() => JSON.stringify(avatarOptions), [avatarOptions]);

  const dataUri = useMemo(() => createAvatarDataUri(name, avatarOptions), [name, memoKey]);
  const svgMarkup = useMemo(() => createAvatarSvg(name, avatarOptions), [name, memoKey]);
  const fallbackAlt = alt ?? `Avatar for ${name || getInitials(name)}`;

  if (as === 'svg') {
    return (
      <span
        className={className}
        style={style}
        dangerouslySetInnerHTML={{ __html: svgMarkup }}
        aria-label={fallbackAlt}
        role="img"
        {...svgProps}
      />
    );
  }

  return (
    <img
      src={dataUri}
      width={size}
      height={size}
      alt={fallbackAlt}
      className={className}
      style={style}
      title={title}
      {...imgProps}
    />
  );
};

export default InitialsAvatar;
export type { AvatarOptions } from '@avyn/initials-avatar';
