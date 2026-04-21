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
  type ItemStateAppearance,
  type NativeProps as TabsScreenAndroidNativeComponentProps,
} from '../../../fabric/tabs/TabsScreenAndroidNativeComponent';
import type {
  TabsScreenAppearanceAndroid,
  TabsScreenItemStateAppearanceAndroid,
} from './TabsScreen.android.types';
import type { TabsScreenProps } from '../screen/TabsScreen.types';
import type { PlatformIconAndroid } from '../../../types';
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
    children,
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
      screenKey: filteredBaseProps.screenKey,
    });

  const iconProps = parseIconsToNativeProps(
    android?.icon,
    android?.selectedIcon,
  );

  return (
    <TabsScreenAndroidNativeComponent
      collapsable={false}
      style={[style, styles.fillParent]}
      // @ts-ignore - This is debug only anyway
      ref={componentNodeRef}
      {...lifecycleCallbacks}
      {...iconProps}
      {...filteredBaseProps}
      // Android-specific
      standardAppearance={mapAppearanceToNativeProps(
        android?.standardAppearance,
      )}>
      {children}
    </TabsScreenAndroidNativeComponent>
  );
}

function mapAppearanceToNativeProps(
  appearance?: TabsScreenAppearanceAndroid,
): Appearance | undefined {
  if (!appearance) return undefined;

  const {
    tabBarBackgroundColor,
    tabBarItemRippleColor,
    normal,
    selected,
    focused,
    disabled,
    tabBarItemActiveIndicatorColor,
    tabBarItemTitleFontWeight,
    tabBarItemBadgeBackgroundColor,
    tabBarItemBadgeTextColor,
    ...rest
  } = appearance;

  return {
    ...rest,
    tabBarBackgroundColor: processColor(tabBarBackgroundColor),
    tabBarItemRippleColor: processColor(tabBarItemRippleColor),
    normal: mapItemStateAppearanceToNativeProp(normal),
    selected: mapItemStateAppearanceToNativeProp(selected),
    focused: mapItemStateAppearanceToNativeProp(focused),
    disabled: mapItemStateAppearanceToNativeProp(disabled),
    tabBarItemActiveIndicatorColor: processColor(
      tabBarItemActiveIndicatorColor,
    ),
    tabBarItemTitleFontWeight:
      tabBarItemTitleFontWeight !== undefined
        ? String(tabBarItemTitleFontWeight)
        : undefined,
    tabBarItemBadgeBackgroundColor: processColor(
      tabBarItemBadgeBackgroundColor,
    ),
    tabBarItemBadgeTextColor: processColor(tabBarItemBadgeTextColor),
  };
}

function mapItemStateAppearanceToNativeProp(
  itemStateAppearance?: TabsScreenItemStateAppearanceAndroid,
): ItemStateAppearance | undefined {
  if (!itemStateAppearance) return undefined;

  const { tabBarItemTitleFontColor, tabBarItemIconColor, ...rest } =
    itemStateAppearance;

  return {
    ...rest,
    tabBarItemTitleFontColor: processColor(tabBarItemTitleFontColor),
    tabBarItemIconColor: processColor(tabBarItemIconColor),
  };
}

function parseIconsToNativeProps(
  icon: PlatformIconAndroid | undefined,
  selectedIcon: PlatformIconAndroid | undefined,
): {
  imageIconResource?: ImageResolvedAssetSource | undefined;
  drawableIconResourceName?: string | undefined;
  selectedImageIconResource?: ImageResolvedAssetSource | undefined;
  selectedDrawableIconResourceName?: string | undefined;
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

export default TabsScreen;

const styles = StyleSheet.create({
  fillParent: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
