import type { PlatformIconIOS as ResolvedPlatformIconIOS } from '../../../../../fabric/gamma/stack/StackHeaderItemIOSNativeComponent';
import type { PlatformIconIOS } from '../../../../../types';
import type {
  StackHeaderMenuIOS,
  StackHeaderMenuElementIOS,
} from './StackHeaderMenu.ios.types';
import { Image } from 'react-native';

export function resolveIconAssetSources(
  icon: PlatformIconIOS | undefined,
): ResolvedPlatformIconIOS | undefined {
  if (icon == null) {
    return undefined;
  }
  if (icon.type === 'imageSource') {
    return {
      type: 'imageSource',
      imageSource: Image.resolveAssetSource(icon.imageSource),
    };
  }
  if (icon.type === 'templateSource') {
    return {
      type: 'templateSource',
      templateSource: Image.resolveAssetSource(icon.templateSource),
    };
  }
  return icon;
}

export function resolveMenuElementIcons(
  element: StackHeaderMenuElementIOS,
): StackHeaderMenuElementIOS {
  if (element.type === 'menuItem') {
    if (element.icon == null) {
      return element;
    }
    return { ...element, icon: resolveIconAssetSources(element.icon) };
  }
  return resolveMenuIcons(element);
}

export function resolveMenuIcons(menu: StackHeaderMenuIOS): StackHeaderMenuIOS {
  const resolvedIcon = resolveIconAssetSources(menu.icon);
  const resolvedChildren = menu.children.map(resolveMenuElementIcons);
  return { ...menu, icon: resolvedIcon, children: resolvedChildren };
}
