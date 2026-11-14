import { Image, PixelRatio, processColor } from 'react-native';
import type {
  ImageResolvedAssetSource,
  ImageSourcePropType,
  ImageURISource,
} from 'react-native';
import type {
  HeaderBarButtonItem,
  HeaderBarButtonItemWithMenu,
} from '../../types';
import type { PlatformIconIOS } from '../../../components/shared/types';

// Local nominal type so declaration emit doesn't resolve the RN alias down to
// the non-public `types_generated/.../AssetSourceResolver#ResolvedAssetSource`.
export interface ResolvedImageAsset extends ImageResolvedAssetSource {}

/**
 * Resolves an image source to the single-object shape expected by the native
 * `RCTImageSource` converter. `ImageSourcePropType` also allows an array of
 * URI sources (e.g. one per scale), which the native converter cannot handle,
 * so we pick the entry whose scale best matches the device's pixel ratio.
 */
export const resolveIconImageSource = (
  source: ImageSourcePropType,
): ResolvedImageAsset | undefined => {
  if (Array.isArray(source)) {
    const sources = source as ImageURISource[];
    if (sources.length === 0) {
      return undefined;
    }

    const pixelRatio = PixelRatio.get();
    const best = sources.reduce((prev, curr) =>
      Math.abs((curr.scale ?? 1) - pixelRatio) <
      Math.abs((prev.scale ?? 1) - pixelRatio)
        ? curr
        : prev,
    );

    return Image.resolveAssetSource(best) as ResolvedImageAsset;
  }

  return Image.resolveAssetSource(source) as ResolvedImageAsset;
};

/**
 * Converts a `PlatformIconIOS` into the flat dictionary shape understood by
 * the native icon resolver (`sfSymbolName` / `xcassetName` / `imageSource` /
 * `templateSource`).
 */
export const prepareIOSIcon = (icon: PlatformIconIOS | undefined) => {
  if (icon == null) {
    return undefined;
  }

  switch (icon.type) {
    case 'sfSymbol':
      return { sfSymbolName: icon.name };
    case 'xcasset':
      return { xcassetName: icon.name };
    case 'imageSource': {
      // An unresolvable source (e.g. an empty array) must clear the icon
      // entirely, otherwise native receives an empty config and keeps the
      // previously displayed image.
      const imageSource = resolveIconImageSource(icon.imageSource);
      return imageSource ? { imageSource } : undefined;
    }
    case 'templateSource': {
      const templateSource = resolveIconImageSource(icon.templateSource);
      return templateSource ? { templateSource } : undefined;
    }
    default:
      return undefined;
  }
};

const prepareMenu = (
  menu: HeaderBarButtonItemWithMenu['menu'],
  index: number,
  side: 'left' | 'right',
  path: string = '',
): HeaderBarButtonItemWithMenu['menu'] => {
  return {
    ...menu,
    items: menu.items.map((menuItem, menuIndex) => {
      const currentPath = path ? `${path}.${menuIndex}` : `${menuIndex}`;
      const iconType = menuItem.icon?.type;
      const sfSymbolName =
        iconType === 'sfSymbol' ? menuItem.icon?.name : undefined;
      const xcassetName =
        iconType === 'xcasset' ? menuItem.icon?.name : undefined;

      let imageSource, templateSource;
      if (menuItem.icon?.type === 'imageSource') {
        imageSource = resolveIconImageSource(menuItem.icon.imageSource);
      } else if (menuItem.icon?.type === 'templateSource') {
        templateSource = resolveIconImageSource(menuItem.icon.templateSource);
      }

      if (menuItem.type === 'submenu') {
        return {
          ...menuItem,
          sfSymbolName,
          xcassetName,
          imageSource,
          templateSource,
          ...prepareMenu(menuItem, index, side, currentPath),
        };
      }
      return {
        ...menuItem,
        sfSymbolName,
        xcassetName,
        imageSource,
        templateSource,
        menuId: `${currentPath}-${index}-${side}`,
      };
    }),
  };
};

export const prepareHeaderBarButtonItems = (
  barButtonItems: HeaderBarButtonItem[],
  side: 'left' | 'right',
) => {
  return barButtonItems?.map((item, index) => {
    if (item.type === 'spacing') {
      return item;
    }
    let imageSource: ResolvedImageAsset | undefined,
      templateSource: ResolvedImageAsset | undefined;
    if (item.icon?.type === 'imageSource') {
      imageSource = resolveIconImageSource(item.icon.imageSource);
    } else if (item.icon?.type === 'templateSource') {
      templateSource = resolveIconImageSource(item.icon.templateSource);
    }

    const titleStyle = item.titleStyle
      ? { ...item.titleStyle, color: processColor(item.titleStyle.color) }
      : undefined;
    const tintColor = item.tintColor ? processColor(item.tintColor) : undefined;
    const badge = item.badge
      ? {
          ...item.badge,
          style: {
            ...item.badge.style,
            color: processColor(item.badge.style?.color),
            backgroundColor: processColor(item.badge.style?.backgroundColor),
          },
        }
      : undefined;
    const processedItem = {
      ...item,
      imageSource,
      templateSource,
      sfSymbolName: item.icon?.type === 'sfSymbol' ? item.icon.name : undefined,
      xcassetName: item.icon?.type === 'xcasset' ? item.icon.name : undefined,
      titleStyle,
      tintColor,
      badge,
    };
    if (item.type === 'button') {
      return {
        ...processedItem,
        buttonId: `${index}-${side}`,
      };
    }
    if (item.type === 'menu') {
      return {
        ...processedItem,
        menu: prepareMenu(item.menu, index, side),
      };
    }
    return null;
  });
};
