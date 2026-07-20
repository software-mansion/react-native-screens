import type { PlatformIconIOS as ResolvedPlatformIconIOS } from '../../../../../fabric/gamma/stack/StackHeaderItemIOSNativeComponent';
import type { PlatformIconIOS } from '../../../../../types';
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
