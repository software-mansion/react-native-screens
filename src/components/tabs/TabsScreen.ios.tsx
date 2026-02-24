'use client';

import React from 'react';
import {
  ImageResolvedAssetSource,
  StyleSheet,
  processColor,
  type ImageSourcePropType,
} from 'react-native';
import TabsScreenNativeComponent, {
  type IconType,
  type Appearance,
  type ItemAppearance,
  type ItemStateAppearance,
} from '../../fabric/tabs/TabsScreenNativeComponent';
import type {
  TabsScreenAppearance,
  TabsScreenItemAppearance,
  TabsScreenItemStateAppearance,
  TabsScreenProps,
} from './TabsScreen.types';
import type { PlatformIconIOS } from '../../types';
import { useTabsScreen } from './useTabsScreen';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function TabsScreen(props: TabsScreenProps) {
  // android props are safely dropped
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { ios, android, ...baseProps } = props;
  const { componentNodeRef, lifecycleCallbacks } =
    useTabsScreen(baseProps);

  const { isFocused = false, style } = baseProps;

  const iconProps = parseIconsToNativeProps(ios?.icon, ios?.selectedIcon);

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
      // iOS-specific
      standardAppearance={mapAppearanceToNativeProp(ios?.standardAppearance)}
      scrollEdgeAppearance={mapAppearanceToNativeProp(
        ios?.scrollEdgeAppearance,
      )}
      bottomScrollEdgeEffect={ios?.scrollEdgeEffects?.bottom}
      leftScrollEdgeEffect={ios?.scrollEdgeEffects?.left}
      rightScrollEdgeEffect={ios?.scrollEdgeEffects?.right}
      topScrollEdgeEffect={ios?.scrollEdgeEffects?.top}
      userInterfaceStyle={ios?.experimental_userInterfaceStyle}
      specialEffects={ios?.specialEffects}
      orientation={ios?.orientation}
      systemItem={ios?.systemItem}
      overrideScrollViewContentInsetAdjustmentBehavior={
        ios?.overrideScrollViewContentInsetAdjustmentBehavior
      }>
      {baseProps.children}
    </TabsScreenNativeComponent>
  );
}

function parseIconToNativeProps(icon: PlatformIconIOS | undefined): {
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
  icon: PlatformIconIOS | undefined,
  selectedIcon: PlatformIconIOS | undefined,
): {
  imageIconResource?: ImageResolvedAssetSource;
  drawableIconResourceName?: string;
  iconType?: IconType;
  iconImageSource?: ImageSourcePropType;
  iconResourceName?: string;
  selectedIconImageSource?: ImageSourcePropType;
  selectedIconResourceName?: string;
} {
  const parsedIcon = parseIconToNativeProps(icon);
  const parsedSelectedIcon = parseIconToNativeProps(selectedIcon);

  if (
    parsedIcon.iconType !== undefined &&
    parsedSelectedIcon.iconType !== undefined &&
    parsedIcon.iconType !== parsedSelectedIcon.iconType
  ) {
    throw new Error('[RNScreens] icon and selectedIcon must be same type.');
  } else if (
    parsedIcon.iconType === undefined &&
    parsedSelectedIcon.iconType !== undefined
  ) {
    // iOS-specific: UIKit requirement
    throw new Error(
      '[RNScreens] To use selectedIcon prop, the icon prop must also be provided.',
    );
  }

  return {
    iconType: parsedIcon.iconType,
    iconImageSource: parsedIcon.iconImageSource,
    iconResourceName: parsedIcon.iconResourceName,
    selectedIconImageSource: parsedSelectedIcon.iconImageSource,
    selectedIconResourceName: parsedSelectedIcon.iconResourceName,
  };
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

export default TabsScreen;

const styles = StyleSheet.create({
  fillParent: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
