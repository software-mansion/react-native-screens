'use client';

import React from 'react';
import { Freeze } from 'react-freeze';
import {
  Image,
  StyleSheet,
  findNodeHandle,
  processColor,
  type ImageSourcePropType,
  type NativeSyntheticEvent,
} from 'react-native';
import { freezeEnabled } from '../../core';
import BottomTabsScreenNativeComponent, {
  type IconType,
  type NativeProps,
  type Appearance,
  type ItemAppearance,
  type ItemStateAppearance,
} from '../../fabric/bottom-tabs/BottomTabsScreenNativeComponent';
import { featureFlags } from '../../flags';
import type {
  BottomTabsScreenAppearance,
  BottomTabsScreenItemAppearance,
  BottomTabsScreenItemStateAppearance,
  BottomTabsScreenProps,
  EmptyObject,
  Icon,
} from './BottomTabsScreen.types';
import { bottomTabsDebugLog } from '../../private/logging';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function BottomTabsScreen(props: BottomTabsScreenProps) {
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

  const [nativeViewIsVisible, setNativeViewIsVisible] = React.useState(false);

  const {
    onWillAppear,
    onDidAppear,
    onWillDisappear,
    onDidDisappear,
    isFocused = false,
    freezeContents,
    icon,
    iconResource,
    selectedIcon,
    standardAppearance,
    scrollEdgeAppearance,
    ...rest
  } = props;

  const shouldFreeze = shouldFreezeScreen(
    nativeViewIsVisible,
    isFocused,
    freezeContents,
  );

  const onWillAppearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      bottomTabsDebugLog(
        `TabsScreen [${componentNodeHandle.current}] onWillAppear received`,
      );
      setNativeViewIsVisible(true);
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
      setNativeViewIsVisible(false);
      onDidDisappear?.(event);
    },
    [onDidDisappear],
  );

  bottomTabsDebugLog(
    `TabsScreen [${componentNodeHandle.current ?? -1}] render; tabKey: ${
      rest.tabKey
    } shouldFreeze: ${shouldFreeze}, isFocused: ${isFocused} nativeViewIsVisible: ${nativeViewIsVisible}`,
  );

  const iconProps = parseIconsToNativeProps(icon, selectedIcon);

  let parsedIconResource;
  if (iconResource) {
    parsedIconResource = Image.resolveAssetSource(iconResource);
    if (!parsedIconResource) {
      console.error(
        '[RNScreens] failed to resolve an asset for bottom tab icon',
      );
    }
  }

  return (
    <BottomTabsScreenNativeComponent
      collapsable={false}
      style={styles.fillParent}
      onWillAppear={onWillAppearCallback}
      onDidAppear={onDidAppearCallback}
      onWillDisappear={onWillDisappearCallback}
      onDidDisappear={onDidDisappearCallback}
      isFocused={isFocused}
      // I'm keeping undefined as a fallback if `Image.resolveAssetSource` has failed for some reason.
      // It won't render any icon, but it will prevent from crashing on the native side which is expecting
      // ReadableMap. Passing `iconResource` directly will result in crash, because `require` API is returning
      // double as a value.
      iconResource={parsedIconResource || undefined}
      {...iconProps}
      standardAppearance={mapAppearanceToNativeProp(standardAppearance)}
      scrollEdgeAppearance={mapAppearanceToNativeProp(scrollEdgeAppearance)}
      // @ts-ignore - This is debug only anyway
      ref={componentNodeRef}
      {...rest}>
      <Freeze freeze={shouldFreeze} placeholder={rest.placeholder}>
        {rest.children}
      </Freeze>
    </BottomTabsScreenNativeComponent>
  );
}

function mapAppearanceToNativeProp(
  appearance?: BottomTabsScreenAppearance,
): Appearance | undefined {
  if (!appearance) return undefined;

  const { stacked, inline, compactInline, tabBarBackgroundColor } = appearance;

  return {
    ...appearance,
    stacked: mapItemAppearanceToNativeProp(stacked),
    inline: mapItemAppearanceToNativeProp(inline),
    compactInline: mapItemAppearanceToNativeProp(compactInline),
    tabBarBackgroundColor: processColor(tabBarBackgroundColor),
  };
}

function mapItemAppearanceToNativeProp(
  itemAppearance?: BottomTabsScreenItemAppearance,
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
  itemStateAppearance?: BottomTabsScreenItemStateAppearance,
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

function shouldFreezeScreen(
  nativeViewVisible: boolean,
  screenFocused: boolean,
  freezeOverride: boolean | undefined,
) {
  if (!freezeEnabled()) {
    return false;
  }

  if (freezeOverride !== undefined) {
    return freezeOverride;
  }

  if (featureFlags.experiment.controlledBottomTabs) {
    // If the tabs are JS controlled, we want to freeze only when given view is not focused && it is not currently visible
    return !nativeViewVisible && !screenFocused;
  }

  return !nativeViewVisible;
}

function parseIconToNativeProps(icon: Icon | undefined): {
  iconType?: IconType;
  iconImageSource?: ImageSourcePropType;
  iconSfSymbolName?: string;
} {
  if (!icon) {
    return {};
  }

  if ('sfSymbolName' in icon) {
    // iOS-specific: SFSymbol usage
    return {
      iconType: 'sfSymbol',
      iconSfSymbolName: icon.sfSymbolName,
    };
  } else if ('imageSource' in icon) {
    return {
      iconType: 'image',
      iconImageSource: icon.imageSource,
    };
  } else if ('templateSource' in icon) {
    // iOS-specifig: image as a template usage
    return {
      iconType: 'template',
      iconImageSource: icon.templateSource,
    };
  } else {
    // iOS-specific: SFSymbol, image as a template usage
    throw new Error(
      '[RNScreens] Incorrect icon format. You must provide sfSymbolName, imageSource or templateSource.',
    );
  }
}

function parseIconsToNativeProps(
  icon: Icon | undefined,
  selectedIcon: Icon | undefined,
): {
  iconType?: IconType;
  iconImageSource?: ImageSourcePropType;
  iconSfSymbolName?: string;
  selectedIconImageSource?: ImageSourcePropType;
  selectedIconSfSymbolName?: string;
} {
  const { iconImageSource, iconSfSymbolName, iconType } =
    parseIconToNativeProps(icon);
  const {
    iconImageSource: selectedIconImageSource,
    iconSfSymbolName: selectedIconSfSymbolName,
    iconType: selectedIconType,
  } = parseIconToNativeProps(selectedIcon);

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
    iconSfSymbolName,
    selectedIconImageSource,
    selectedIconSfSymbolName,
  };
}

export default BottomTabsScreen;

const styles = StyleSheet.create({
  fillParent: {
    position: 'absolute',
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
