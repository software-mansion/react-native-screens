'use client';

import React from 'react';
import {
  Image,
  ImageResolvedAssetSource,
  StyleSheet,
  processColor,
} from 'react-native';
import TabsScreenAndroidNativeComponent, {
  type Appearance,
  NativeProps as TabsScreenAndroidNativeComponentProps,
} from '../../fabric/tabs/TabsScreenAndroidNativeComponent';
import type {
  TabsScreenProps,
  TabsAppearanceAndroid,
  ItemAppearanceAndroid,
  ItemStateAppearanceAndroid,
  TabBarActiveIndicatorAppearanceAndroid,
  TabBarItemTitleTypographyAppearanceAndroid,
  TabBarItemBadgeAppearanceAndroid,
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

  const componentNodeRef =
    React.useRef<React.Component<TabsScreenAndroidNativeComponentProps>>(null);

  const {
    onDidAppear,
    onDidDisappear,
    onWillAppear,
    onWillDisappear,
    isFocused = false,
    style,
    ...filteredBaseProps
  } = baseProps;

  const { lifecycleCallbacks } =
    useTabsScreen<TabsScreenAndroidNativeComponentProps>({
      componentNodeRef,
      onDidAppear,
      onDidDisappear,
      onWillAppear,
      onWillDisappear,
      isFocused,
      tabKey: filteredBaseProps.tabKey,
    });

  const iconProps = parseIconsToNativeProps(
    android?.icon,
    android?.selectedIcon,
  );

  return (
    <TabsScreenAndroidNativeComponent
      collapsable={false}
      style={[style, styles.fillParent]}
      isFocused={isFocused}
      // @ts-ignore - This is debug only anyway
      ref={componentNodeRef}
      {...lifecycleCallbacks}
      {...iconProps}
      {...filteredBaseProps}
      // Android-specific
      standardAppearance={mapAppearanceToNativeProps(
        android?.standardAppearance,
      )}>
      {baseProps.children}
    </TabsScreenAndroidNativeComponent>
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
): Appearance | undefined {
  if (!appearance) return undefined;

  const {
    backgroundColor,
    itemRippleColor,
    labelVisibilityMode,
    tabBarItemStatesColors,
    tabBarActiveIndicatorAppearance,
    tabBarItemTitleTypography,
    tabBarItemBadgeAppearance,
  } = appearance;

  return {
    tabBarBackgroundColor: processColor(backgroundColor),
    tabBarItemRippleColor: processColor(itemRippleColor),
    tabBarItemLabelVisibilityMode: labelVisibilityMode,
    tabBarItemStatesColors: mapTabBarItemAppearanceToNativeProps(
      tabBarItemStatesColors,
    ),
    tabBarActiveIndicatorAppearance:
      mapTabBarActiveIndicatorAppearanceToNativeProps(
        tabBarActiveIndicatorAppearance,
      ),
    tabBarItemTitleTypography: mapTabBarItemTitleTypographyToNativeProps(
      tabBarItemTitleTypography,
    ),
    tabBarItemBadgeAppearance: mapTabBarItemBadgeAppearanceToNativeProps(
      tabBarItemBadgeAppearance,
    ),
  };
}

function mapTabBarItemAppearanceToNativeProps(colors?: ItemAppearanceAndroid) {
  if (!colors) return undefined;

  return {
    normal: mapItemStateAppearanceToNativeProps(colors.normal),
    selected: mapItemStateAppearanceToNativeProps(colors.selected),
    focused: mapItemStateAppearanceToNativeProps(colors.focused),
    disabled: mapItemStateAppearanceToNativeProps(colors.disabled),
  };
}

function mapItemStateAppearanceToNativeProps(
  stateColors?: ItemStateAppearanceAndroid,
) {
  if (!stateColors) return undefined;

  return {
    tabBarItemTitleColor: processColor(stateColors.tabBarItemTitleColor),
    tabBarItemIconColor: processColor(stateColors.tabBarItemIconColor),
  };
}

function mapTabBarActiveIndicatorAppearanceToNativeProps(
  indicator?: TabBarActiveIndicatorAppearanceAndroid,
) {
  if (!indicator) return undefined;

  return {
    ...indicator,
    tabBarActiveIndicatorColor: processColor(
      indicator.tabBarActiveIndicatorColor,
    ),
  };
}

function mapTabBarItemTitleTypographyToNativeProps(
  tabBarItemTitleTypography?: TabBarItemTitleTypographyAppearanceAndroid,
) {
  if (!tabBarItemTitleTypography) return undefined;

  return {
    ...tabBarItemTitleTypography,
    tabBarItemTitleFontWeight:
      tabBarItemTitleTypography.tabBarItemTitleFontWeight !== undefined
        ? String(tabBarItemTitleTypography.tabBarItemTitleFontWeight)
        : undefined,
  };
}

function mapTabBarItemBadgeAppearanceToNativeProps(
  tabBarItemBadgeAppearance?: TabBarItemBadgeAppearanceAndroid,
) {
  if (!tabBarItemBadgeAppearance) return undefined;

  return {
    ...tabBarItemBadgeAppearance,
    tabBarItemBadgeBackgroundColor: processColor(
      tabBarItemBadgeAppearance.tabBarItemBadgeBackgroundColor,
    ),
    tabBarItemBadgeTextColor: processColor(
      tabBarItemBadgeAppearance.tabBarItemBadgeTextColor,
    ),
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
