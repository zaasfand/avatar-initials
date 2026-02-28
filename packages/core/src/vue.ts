import { App, PropType, computed, defineComponent, h } from 'vue';
import { AvatarOptions, createAvatarDataUri, createAvatarSvg, getInitials } from './index';

export type InitialsAvatarProps = AvatarOptions & {
  name: string;
  alt?: string;
  as?: 'img' | 'svg';
  title?: string;
};

const DEFAULT_SIZE = 96;

export const InitialsAvatar = defineComponent({
  name: 'InitialsAvatar',
  props: {
    name: { type: String, required: true },
    alt: { type: String, default: undefined },
    as: { type: String as PropType<'img' | 'svg'>, default: 'img' },
    title: { type: String, default: undefined },
    size: { type: Number, default: undefined },
    backgroundColor: { type: String, default: undefined },
    fontColor: { type: String, default: undefined },
    fontSize: { type: Number, default: undefined },
    fontFamily: { type: String, default: undefined },
    borderWidth: { type: Number, default: undefined },
    borderColor: { type: String, default: undefined },
    borderRadius: { type: Number, default: undefined },
    bold: { type: Boolean, default: undefined },
    initialsOverride: { type: String, default: undefined }
  },
  setup(props, { attrs }) {
    const avatarOptions = computed<AvatarOptions>(() => ({
      size: props.size,
      backgroundColor: props.backgroundColor,
      fontColor: props.fontColor,
      fontSize: props.fontSize,
      fontFamily: props.fontFamily,
      borderWidth: props.borderWidth,
      borderColor: props.borderColor,
      borderRadius: props.borderRadius,
      bold: props.bold,
      initialsOverride: props.initialsOverride
    }));

    const dataUri = computed(() => createAvatarDataUri(props.name, avatarOptions.value));
    const svgMarkup = computed(() => createAvatarSvg(props.name, avatarOptions.value));
    const sizeValue = computed(() => props.size ?? DEFAULT_SIZE);
    const altText = computed(() => props.alt ?? `Avatar for ${props.name || getInitials(props.name)}`);

    return () => {
      if (props.as === 'svg') {
        return h('span', {
          ...attrs,
          innerHTML: svgMarkup.value,
          role: 'img',
          'aria-label': altText.value,
          title: props.title
        });
      }

      return h('img', {
        ...attrs,
        src: dataUri.value,
        width: sizeValue.value,
        height: sizeValue.value,
        alt: altText.value,
        title: props.title
      });
    };
  }
});

export const InitialsAvatarPlugin = {
  install(app: App) {
    app.component('InitialsAvatar', InitialsAvatar);
  }
};

export default InitialsAvatar;
export type { AvatarOptions } from './index';
