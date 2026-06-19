import { Image, type ImageResolvedAssetSource } from 'react-native';
import type { PlatformIconAndroid } from '../../types';

export function parseAndroidIconToNativeProps(
  icon: PlatformIconAndroid | undefined,
): {
  imageIconResource?: ImageResolvedAssetSource | undefined;
  drawableIconResourceName?: string | undefined;
} {
  if (!icon) {
    return {};
  }

  let parsedIconResource;
  if (icon.type === 'imageSource') {
    parsedIconResource = Image.resolveAssetSource(icon.imageSource);
    if (!parsedIconResource) {
      console.error('[RNScreens] Failed to resolve an asset.');
    }

    return {
      // I'm keeping undefined as a fallback if `Image.resolveAssetSource` has failed for some reason.
      // It won't render any icon, but it will prevent from crashing on the native side which is expecting
      // ReadableMap. Passing `iconResource` directly will result in crash, because `require` API is returning
      // double as a value.
      imageIconResource: parsedIconResource || undefined,
    };
  } else if (icon.type === 'drawableResource') {
    return {
      drawableIconResourceName: icon.name,
    };
  } else {
    throw new Error(
      '[RNScreens] Incorrect icon format for Android. You must provide `imageSource` or `drawableResource`.',
    );
  }
}
