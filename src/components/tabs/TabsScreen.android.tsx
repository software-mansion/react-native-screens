'use client';

import React from 'react';
import {
  Image,
  ImageResolvedAssetSource,
  StyleSheet,
  processColor,
} from 'react-native';
import TabsScreenNativeComponent, {
  type AppearanceAndroid,
} from '../../fabric/tabs/TabsScreenNativeComponent';
import type {
  TabsScreenProps,
  TabsAppearanceAndroid,
  BottomNavItemColorsAndroid,
  ItemStateColorsAndroid,
  ActiveIndicatorAppearanceAndroid,
  TypographyAppearanceAndroid,
  BadgeAppearanceAndroid,
} from './TabsScreen.types';
import type { PlatformIconAndroid } from '../../types';
import { useTabsScreen } from './useTabsScreen';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function TabsScreen(props: TabsScreenProps) {
  // ios props are safely dropped
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { android, ios, ...baseProps } = props;
  const { componentNodeRef, lifecycleCallbacks } = useTabsScreen(baseProps);

  const { isFocused = false, style } = baseProps;

  const iconProps = parseIconsToNativeProps(
    android?.icon,
    android?.selectedIcon,
  );

  return (
    <TabsScreenNativeComponent
      collapsable={false}
      style={[style, styles.fillParent]}
      isFocused={isFocused}
      isTitleUndefined={
        baseProps.title === null || baseProps.title === undefined
      }
      // @ts-ignore - This is debug only anyway
      ref={componentNodeRef}
      {...lifecycleCallbacks}
      {...iconProps}
      {...baseProps}
      // Android-specific
      standardAppearanceAndroid={mapAppearanceToNativeProps(
        android?.standardAppearance,
      )}>
      {baseProps.children}
    </TabsScreenNativeComponent>
  );
}

function parseIconsToNativeProps(
  icon: PlatformIconAndroid | undefined,
  selectedIcon: PlatformIconAndroid | undefined,
): {
  imageIconResource?: ImageResolvedAssetSource;
  drawableIconResourceName?: string;
  selectedImageIconResource?: ImageResolvedAssetSource;
  selectedDrawableIconResourceName?: string;
} {
  const parsedIcon = parseIconToNativeProps(icon);
  const parsedSelectedIcon = parseIconToNativeProps(selectedIcon);

  return {
    imageIconResource: parsedIcon.imageIconResource,
    drawableIconResourceName: parsedIcon.drawableIconResourceName,
    selectedImageIconResource: parsedSelectedIcon.imageIconResource,
    selectedDrawableIconResourceName:
      parsedSelectedIcon.drawableIconResourceName,
  };
}

function parseIconToNativeProps(icon: PlatformIconAndroid | undefined): {
  imageIconResource?: ImageResolvedAssetSource;
  drawableIconResourceName?: string;
} {
  if (!icon) {
    return {};
  }

  let parsedIconResource;
  if (icon.type === 'imageSource') {
    parsedIconResource = Image.resolveAssetSource(icon.imageSource);
    if (!parsedIconResource) {
      console.error(
        '[RNScreens] failed to resolve an asset for bottom tab icon',
      );
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

function mapAppearanceToNativeProps(
  appearance?: TabsAppearanceAndroid,
): AppearanceAndroid | undefined {
  if (!appearance) return undefined;

  const {
    backgroundColor,
    itemRippleColor,
    labelVisibilityMode,
    itemColors,
    activeIndicator,
    typography,
    badge,
  } = appearance;

  return {
    tabBarBackgroundColor: processColor(backgroundColor),
    tabBarItemRippleColor: processColor(itemRippleColor),
    tabBarItemLabelVisibilityMode: labelVisibilityMode,
    itemColors: mapBottomNavItemColorsToNativeProps(itemColors),
    activeIndicator: mapActiveIndicatorToNativeProps(activeIndicator),
    typography: mapTypographyToNativeProps(typography),
    badge: mapBadgeToNativeProps(badge),
  };
}

function mapBottomNavItemColorsToNativeProps(
  colors?: BottomNavItemColorsAndroid,
) {
  if (!colors) return undefined;

  return {
    normal: mapItemStateColorsToNativeProps(colors.normal),
    selected: mapItemStateColorsToNativeProps(colors.selected),
    focused: mapItemStateColorsToNativeProps(colors.focused),
    disabled: mapItemStateColorsToNativeProps(colors.disabled),
  };
}

function mapItemStateColorsToNativeProps(stateColors?: ItemStateColorsAndroid) {
  if (!stateColors) return undefined;

  return {
    titleColor: processColor(stateColors.titleColor),
    iconColor: processColor(stateColors.iconColor),
  };
}

function mapActiveIndicatorToNativeProps(
  indicator?: ActiveIndicatorAppearanceAndroid,
) {
  if (!indicator) return undefined;

  return {
    ...indicator,
    color: processColor(indicator.color),
  };
}

function mapTypographyToNativeProps(typography?: TypographyAppearanceAndroid) {
  if (!typography) return undefined;

  return {
    ...typography,
    fontWeight:
      typography.fontWeight !== undefined
        ? String(typography.fontWeight)
        : undefined,
  };
}

function mapBadgeToNativeProps(badge?: BadgeAppearanceAndroid) {
  if (!badge) return undefined;

  return {
    ...badge,
    backgroundColor: processColor(badge.backgroundColor),
    textColor: processColor(badge.textColor),
  };
}

export default TabsScreen;

const styles = StyleSheet.create({
  fillParent: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
