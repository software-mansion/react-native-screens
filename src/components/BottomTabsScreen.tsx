'use client';

import React from 'react';
import BottomTabsScreenNativeComponent, {
  BlurEffect,
  type IconType,
  type NativeProps,
} from '../fabric/BottomTabsScreenNativeComponent';
import {
  type ColorValue,
  type ImageSourcePropType,
  type NativeSyntheticEvent,
  StyleSheet,
  TextStyle,
  type ViewProps,
  findNodeHandle,
} from 'react-native';
import { Freeze } from 'react-freeze';
import { freezeEnabled } from '../core';
import { featureFlags } from '../flags';

export type EmptyObject = Record<string, never>;
export type BottomTabsScreenEventHandler<T> = (
  event: NativeSyntheticEvent<T>,
) => void;

// iOS-specific: SFSymbol usage
export interface SFIcon {
  sfSymbolName: string;
}

export interface ImageIcon {
  imageSource: ImageSourcePropType;
}

// iOS-specific: image as a template usage
export interface TemplateIcon {
  templateSource: ImageSourcePropType;
}

// iOS-specific: SFSymbol, image as a template usage
export type Icon = SFIcon | ImageIcon | TemplateIcon;

export interface BottomTabsScreenProps {
  children?: ViewProps['children'];
  placeholder?: React.ReactNode | undefined;

  // Control

  // Works only in 'controlled' mode. Otherwise this prop indicates only initally selected tab.
  isFocused?: boolean;
  tabKey: string;

  // Tab Bar Appearance
  // tabBarAppearance?: TabBarAppearance; // Does not work due to codegen issue.
  tabBarBackgroundColor?: ColorValue;
  tabBarBlurEffect?: BlurEffect; // defaults to 'none'

  tabBarItemTitleFontFamily?: TextStyle['fontFamily'];
  tabBarItemTitleFontSize?: TextStyle['fontSize'];
  tabBarItemTitleFontWeight?: TextStyle['fontWeight'];
  tabBarItemTitleFontStyle?: TextStyle['fontStyle'];
  tabBarItemTitleFontColor?: TextStyle['color'];
  tabBarItemTitlePositionAdjustment?: {
    horizontal?: number;
    vertical?: number;
  };

  tabBarItemIconColor?: ColorValue;

  tabBarItemBadgeBackgroundColor?: ColorValue;

  // General
  title?: string;

  // Android specific
  iconResourceName?: string;

  icon?: Icon;
  selectedIcon?: Icon;

  badgeValue?: string;

  specialEffects?: {
    repeatedTabSelection?: {
      popToRoot?: boolean;
      scrollToTop?: boolean;
    };
  };

  overrideScrollViewContentInsetAdjustmentBehavior?: boolean; // defaults to true

  // Events
  onWillAppear?: BottomTabsScreenEventHandler<EmptyObject>;
  onDidAppear?: BottomTabsScreenEventHandler<EmptyObject>;
  onWillDisappear?: BottomTabsScreenEventHandler<EmptyObject>;
  onDidDisappear?: BottomTabsScreenEventHandler<EmptyObject>;
}

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
    icon,
    selectedIcon,
    ...rest
  } = props;

  let shouldFreeze = freezeEnabled();

  if (featureFlags.experiment.controlledBottomTabs) {
    // If the tabs are JS controlled, we want to freeze only when given view is not focused && it is not currently visible
    shouldFreeze = shouldFreeze && !nativeViewIsVisible && !isFocused;
  } else {
    shouldFreeze = shouldFreeze && !nativeViewIsVisible;
  }

  const onWillAppearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      console.log(
        `TabsScreen [${componentNodeHandle.current}] onWillAppear received`,
      );
      setNativeViewIsVisible(true);
      onWillAppear?.(event);
    },
    [onWillAppear],
  );

  const onDidAppearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      console.log(
        `TabsScreen [${componentNodeHandle.current}] onDidAppear received`,
      );
      onDidAppear?.(event);
    },
    [onDidAppear],
  );

  const onWillDisappearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      console.log(
        `TabsScreen [${componentNodeHandle.current}] onWillDisappear received`,
      );
      onWillDisappear?.(event);
    },
    [onWillDisappear],
  );

  const onDidDisappearCallback = React.useCallback(
    (event: NativeSyntheticEvent<EmptyObject>) => {
      console.log(
        `TabsScreen [${componentNodeHandle.current}] onDidDisappear received`,
      );
      setNativeViewIsVisible(false);
      onDidDisappear?.(event);
    },
    [onDidDisappear],
  );

  console.info(
    `TabsScreen [${componentNodeHandle.current ?? -1}] render; tabKey: ${
      rest.tabKey
    } shouldFreeze: ${shouldFreeze}, isFocused: ${isFocused} nativeViewIsVisible: ${nativeViewIsVisible}`,
  );

  const iconProps = parseIconsToNativeProps(icon, selectedIcon);

  return (
    <BottomTabsScreenNativeComponent
      collapsable={false}
      style={styles.fillParent}
      onWillAppear={onWillAppearCallback}
      onDidAppear={onDidAppearCallback}
      onWillDisappear={onWillDisappearCallback}
      onDidDisappear={onDidDisappearCallback}
      isFocused={isFocused}
      {...iconProps}
      // @ts-ignore - This is debug only anyway
      ref={componentNodeRef}
      {...rest}>
      <Freeze freeze={shouldFreeze} placeholder={rest.placeholder}>
        {rest.children}
      </Freeze>
    </BottomTabsScreenNativeComponent>
  );
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
