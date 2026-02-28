import React, { CSSProperties, HTMLAttributes, ImgHTMLAttributes, useMemo } from 'react';
import { AvatarOptions, createAvatarDataUri, createAvatarSvg, getInitials } from './index';

export type InitialsAvatarProps = AvatarOptions & {
  name: string;
  alt?: string;
  as?: 'img' | 'svg';
  className?: string;
  style?: CSSProperties;
  title?: string;
  imgProps?: Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt' | 'title'>;
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
export type { AvatarOptions } from './index';
