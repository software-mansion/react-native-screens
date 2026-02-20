'use client';

import React from 'react';
import {
  Image,
  ImageResolvedAssetSource,
  Platform,
  StyleSheet,
  findNodeHandle,
  processColor,
  type ImageSourcePropType,
  type NativeSyntheticEvent,
} from 'react-native';
import TabsScreenNativeComponent, {
  type IconType,
  type NativeProps,
  type Appearance,
  type ItemAppearance,
  type ItemStateAppearance,
} from '../../fabric/tabs/TabsScreenNativeComponent';
import type {
  TabsScreenAppearance,
  TabsScreenItemAppearance,
  TabsScreenItemStateAppearance,
  TabsScreenProps,
  EmptyObject,
  AndroidTabsAppearance,
  BottomNavItemColorsAndroid,
  ItemStateColorsAndroid,
  ActiveIndicatorAppearanceAndroid,
  TypographyAppearanceAndroid,
  BadgeAppearanceAndroid,
} from './TabsScreen.types';
import { bottomTabsDebugLog } from '../../private/logging';
import type {
  PlatformIcon,
  PlatformIconAndroid,
  PlatformIconIOS,
} from '../../types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function TabsScreen(props: TabsScreenProps) {
  const componentNodeRef = React.useRef<React.Component<NativeProps>>(null);
  const componentNodeHandle = React.useRef<number>(-1);

  React.useEffect(() => {
    if (componentNodeRef.current != null) {
      componentNodeHandle.current =
        findNodeHandle(componentNodeRef.current) ?? -1;
    } else {
      componentNodeHandle.current = -1;
    }
  }, []);

  const {
    onWillAppear,
    onDidAppear,
    onWillDisappear,
    onDidDisappear,
    isFocused = false,
    icon,
    selectedIcon,
    standardAppearance,
    standardAppearanceAndroid,
    scrollEdgeAppearance,
    scrollEdgeEffects,
    // eslint-disable-next-line camelcase -- we use sneak case experimental prefix
    experimental_userInterfaceStyle,
    style,
    ...rest
  } = props;

  const onWillAppearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${componentNodeHandle.current}] onWillAppear received`,
      );
      onWillAppear?.(event);
    },
    [onWillAppear],
  );

  const onDidAppearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${componentNodeHandle.current}] onDidAppear received`,
      );
      onDidAppear?.(event);
    },
    [onDidAppear],
  );

  const onWillDisappearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${componentNodeHandle.current}] onWillDisappear received`,
      );
      onWillDisappear?.(event);
    },
    [onWillDisappear],
  );

  const onDidDisappearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${componentNodeHandle.current}] onDidDisappear received`,
      );
      onDidDisappear?.(event);
    },
    [onDidDisappear],
  );

  bottomTabsDebugLog(
    `TabsScreen [${componentNodeHandle.current ?? -1}] render; tabKey: ${
      rest.tabKey
    } isFocused: ${isFocused}`,
  );

  const iconProps = parseIconsToNativeProps(icon, selectedIcon);

  return (
    <TabsScreenNativeComponent
      collapsable={false}
      style={[style, styles.fillParent]}
      onWillAppear={onWillAppearCallback}
      onDidAppear={onDidAppearCallback}
      onWillDisappear={onWillDisappearCallback}
      onDidDisappear={onDidDisappearCallback}
      isFocused={isFocused}
      {...iconProps}
      standardAppearance={mapAppearanceToNativeProp(standardAppearance)}
      standardAppearanceAndroid={mapAndroidAppearanceToNativeProp(
        standardAppearanceAndroid,
      )}
      scrollEdgeAppearance={mapAppearanceToNativeProp(scrollEdgeAppearance)}
      // @ts-ignore - This is debug only anyway
      ref={componentNodeRef}
      bottomScrollEdgeEffect={scrollEdgeEffects?.bottom}
      leftScrollEdgeEffect={scrollEdgeEffects?.left}
      rightScrollEdgeEffect={scrollEdgeEffects?.right}
      topScrollEdgeEffect={scrollEdgeEffects?.top}
      isTitleUndefined={rest.title === null || rest.title === undefined}
      // eslint-disable-next-line camelcase -- we use sneak case experimental prefix
      userInterfaceStyle={experimental_userInterfaceStyle}
      {...rest}>
      {rest.children}
    </TabsScreenNativeComponent>
  );
}

function mapAppearanceToNativeProp(
  appearance?: TabsScreenAppearance,
): Appearance | undefined {
  if (!appearance) return undefined;

  const {
    stacked,
    inline,
    compactInline,
    tabBarBackgroundColor,
    tabBarShadowColor,
  } = appearance;

  return {
    ...appearance,
    stacked: mapItemAppearanceToNativeProp(stacked),
    inline: mapItemAppearanceToNativeProp(inline),
    compactInline: mapItemAppearanceToNativeProp(compactInline),
    tabBarBackgroundColor: processColor(tabBarBackgroundColor),
    tabBarShadowColor: processColor(tabBarShadowColor),
  };
}

export function mapAndroidAppearanceToNativeProp(
  appearance?: AndroidTabsAppearance,
) {
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
    backgroundColor: processColor(backgroundColor),
    itemRippleColor: processColor(itemRippleColor),
    labelVisibilityMode,
    itemColors: mapBottomNavItemColors(itemColors),
    activeIndicator: mapActiveIndicator(activeIndicator),
    typography: mapTypography(typography),
    badge: mapBadge(badge),
  };
}

function mapBottomNavItemColors(colors?: BottomNavItemColorsAndroid) {
  if (!colors) return undefined;

  return {
    normal: mapItemStateColors(colors.normal),
    selected: mapItemStateColors(colors.selected),
    focused: mapItemStateColors(colors.focused),
    disabled: mapItemStateColors(colors.disabled),
  };
}

function mapItemStateColors(stateColors?: ItemStateColorsAndroid) {
  if (!stateColors) return undefined;

  return {
    titleColor: processColor(stateColors.titleColor),
    iconColor: processColor(stateColors.iconColor),
  };
}

function mapActiveIndicator(indicator?: ActiveIndicatorAppearanceAndroid) {
  if (!indicator) return undefined;

  return {
    ...indicator,
    color: processColor(indicator.color),
  };
}

function mapTypography(typography?: TypographyAppearanceAndroid) {
  if (!typography) return undefined;

  return {
    ...typography,
    fontWeight:
      typography.fontWeight !== undefined
        ? String(typography.fontWeight)
        : undefined,
  };
}

function mapBadge(badge?: BadgeAppearanceAndroid) {
  if (!badge) return undefined;

  return {
    ...badge,
    backgroundColor: processColor(badge.backgroundColor),
    textColor: processColor(badge.textColor),
  };
}

function mapItemAppearanceToNativeProp(
  itemAppearance?: TabsScreenItemAppearance,
): ItemAppearance | undefined {
  if (!itemAppearance) return undefined;

  const { normal, selected, focused, disabled } = itemAppearance;

  return {
    ...itemAppearance,
    normal: mapItemStateAppearanceToNativeProp(normal),
    selected: mapItemStateAppearanceToNativeProp(selected),
    focused: mapItemStateAppearanceToNativeProp(focused),
    disabled: mapItemStateAppearanceToNativeProp(disabled),
  };
}

function mapItemStateAppearanceToNativeProp(
  itemStateAppearance?: TabsScreenItemStateAppearance,
): ItemStateAppearance | undefined {
  if (!itemStateAppearance) return undefined;

  const {
    tabBarItemTitleFontColor,
    tabBarItemIconColor,
    tabBarItemBadgeBackgroundColor,
    tabBarItemTitleFontWeight,
  } = itemStateAppearance;

  return {
    ...itemStateAppearance,
    tabBarItemTitleFontColor: processColor(tabBarItemTitleFontColor),
    tabBarItemIconColor: processColor(tabBarItemIconColor),
    tabBarItemBadgeBackgroundColor: processColor(
      tabBarItemBadgeBackgroundColor,
    ),
    tabBarItemTitleFontWeight:
      tabBarItemTitleFontWeight !== undefined
        ? String(tabBarItemTitleFontWeight)
        : undefined,
  };
}

function parseAndroidIconToNativeProps(icon: PlatformIconAndroid | undefined): {
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

function parseIOSIconToNativeProps(icon: PlatformIconIOS | undefined): {
  iconType?: IconType;
  iconImageSource?: ImageSourcePropType;
  iconResourceName?: string;
} {
  if (!icon) {
    return {};
  }

  if (icon.type === 'sfSymbol') {
    return {
      iconType: 'sfSymbol',
      iconResourceName: icon.name,
    };
  } else if (icon.type === 'imageSource') {
    return {
      iconType: 'image',
      iconImageSource: icon.imageSource,
    };
  } else if (icon.type === 'templateSource') {
    return {
      iconType: 'template',
      iconImageSource: icon.templateSource,
    };
  } else if (icon.type === 'xcasset') {
    return {
      iconType: 'xcasset',
      iconResourceName: icon.name,
    };
  } else {
    throw new Error(
      '[RNScreens] Incorrect icon format for iOS. You must provide `sfSymbol`, `imageSource`, `templateSource` or `xcasset`.',
    );
  }
}

function parseIconsToNativeProps(
  icon: PlatformIcon | undefined,
  selectedIcon: PlatformIcon | undefined,
): {
  imageIconResource?: ImageResolvedAssetSource;
  drawableIconResourceName?: string;
  iconType?: IconType;
  iconImageSource?: ImageSourcePropType;
  iconResourceName?: string;
  // android
  selectedImageIconResource?: ImageSourcePropType;
  selectedDrawableIconResourceName?: string;
  // iOS
  selectedIconImageSource?: ImageSourcePropType;
  selectedIconResourceName?: string;
} {
  if (Platform.OS === 'android') {
    const { imageIconResource, drawableIconResourceName } =
      parseAndroidIconToNativeProps(icon?.android || icon?.shared);

    const androidSelectedSource =
      (selectedIcon as PlatformIcon)?.android ||
      (selectedIcon as PlatformIcon)?.shared;
    const selectedIconProps = androidSelectedSource
      ? parseAndroidIconToNativeProps(androidSelectedSource)
      : {};

    return {
      imageIconResource,
      drawableIconResourceName,
      selectedImageIconResource: selectedIconProps.imageIconResource,
      selectedDrawableIconResourceName:
        selectedIconProps.drawableIconResourceName,
    };
  }

  if (Platform.OS === 'ios') {
    const { iconImageSource, iconResourceName, iconType } =
      parseIOSIconToNativeProps(icon?.ios || icon?.shared);

    const iosSelectedSource =
      (selectedIcon as PlatformIcon)?.ios ||
      (selectedIcon as PlatformIcon)?.shared;

    const {
      iconImageSource: selectedIconImageSource,
      iconResourceName: selectedIconResourceName,
      iconType: selectedIconType,
    } = parseIOSIconToNativeProps(iosSelectedSource);

    if (
      iconType !== undefined &&
      selectedIconType !== undefined &&
      iconType !== selectedIconType
    ) {
      throw new Error('[RNScreens] icon and selectedIcon must be same type.');
    } else if (iconType === undefined && selectedIconType !== undefined) {
      // iOS-specific: UIKit requirement
      throw new Error(
        '[RNScreens] To use selectedIcon prop, the icon prop must also be provided.',
      );
    }

    return {
      iconType,
      iconImageSource,
      iconResourceName,
      selectedIconImageSource,
      selectedIconResourceName,
    };
  }

  // Fallback for other platforms
  return {};
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
