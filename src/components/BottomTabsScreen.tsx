'use client';

import React from 'react';
import BottomTabsScreenNativeComponent, {
  type BlurEffect,
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

  /**
   * Defines what should be rendered when tab screen is frozen.
   *
   * For more information, refer to `react-freeze`'s docs.
   *
   * @platform android, ios
   */
  placeholder?: React.ReactNode | undefined;

  // Control

  /**
   * In controlled container mode, determines if tab screen is currently
   * focused. There should be exactly one focused screen at any given time.
   *
   * In managed container mode, it only indicates initially selected tab.
   *
   * @platform android, ios
   */
  isFocused?: boolean;

  /**
   * Identifies screen, e.g. when receiving onNativeFocusChange event.
   *
   * @platform android, ios
   */
  tabKey: string;

  // General

  /**
   * Title of the tab screen, displayed in the tab bar.
   *
   * @platform android, ios
   */
  title?: string;

  /**
   * Specifies content of tab bar item badge.
   *
   * @todo Describe prop behavior on Android.
   * On iOS, badge is displayed as regular string.
   *
   * @platform android, ios
   */
  badgeValue?: string;

  // Tab Bar Appearance
  // tabBarAppearance?: TabBarAppearance; // Does not work due to codegen issue.

  // Android-only appearance
  iconResourceName?: string;
  tabBarItemBadgeTextColor?: ColorValue;

  // iOS-only appearance

  /**
   * Specifies background color of the entire tab bar when tab screen is selected.
   *
   * Since iOS 26, it does not affect the tab bar.
   *
   * @platform ios
   * @supported iOS 18 or lower
   */
  tabBarBackgroundColor?: ColorValue;

  /**
   * Specifies blur effect applied to tab bar when tab screen is selected.
   * Works with backgroundColor's alpha < 1.
   *
   * Can be:
   * - one of styles mapped from UIKit's UIBlurEffectStyle, e.g. `systemUltraThinMaterial`,
   * - `systemDefault` - uses UIKit's default tab bar blur effect,
   * - `none` - disables blur effect.
   *
   * Since iOS 26, it does not affect the tab bar.
   *
   * @default Defaults to `systemDefault`.
   *
   * @platform ios
   * @supported iOS 18 or lower
   */
  tabBarBlurEffect?: BlurEffect;

  /**
   * Specifies title font family of every tab item in the tab bar
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontFamily?: TextStyle['fontFamily'];

  /**
   * Specifies title font size of every tab item in the tab bar
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontSize?: TextStyle['fontSize'];

  /**
   * Specifies title font weight of every tab item in the tab bar
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontWeight?: TextStyle['fontWeight'];

  /**
   * Specifies title font style of every tab item in the tab bar
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontStyle?: TextStyle['fontStyle'];

  /**
   * Specifies title font color of every tab item in the tab bar
   * when tab screen is selected.
   *
   * Overrides color defined in `tabBarTintColor` and `tabBarItemIconColor`.
   *
   * @platform ios
   */
  tabBarItemTitleFontColor?: TextStyle['color'];

  /**
   * Specifies title offset of every tab item in the tab bar
   * when tab screen is selected.
   *
   * Depending on iOS version, interface orientation,
   * this setting might impact text, badge and icon.
   *
   * @platform ios
   */
  tabBarItemTitlePositionAdjustment?: {
    horizontal?: number;
    vertical?: number;
  };

  /**
   * Specifies icon for tab bar item representing the tab screen.
   *
   * Can be:
   * - an object with `sfSymbolName` - will attempt to use SF
   *   Symbol with given name,
   * - an object with `imageSource` - will attempt to use image
   *   from provided resource,
   * - an object with `templateSource` - will attempt to use image
   *   from provided resource as template (color of the image will
   *   depend on props related to icon color and tab bar item's state).
   *
   * If no `selectedIcon` is provided, it will also be used as `selectedIcon`.
   *
   * @platform ios
   */
  icon?: Icon;

  /**
   * Specifies icon for tab bar item representing the tab screen
   * when it is selected.
   *
   * Accepts the same prop type as `icon`.
   *
   * To use `selectedIcon`, `icon` must also be provided.
   *
   * @platform ios
   */
  selectedIcon?: Icon;

  /**
   * Specifies color of the icons for every tab item in the tab bar
   * when tab screen is selected. Impacts also title text color.
   *
   * On iOS 26, it only applies to selected tab bar item. Other items
   * are dark or light depending on the theme of the tab bar.
   *
   * Is overriden by `tabBarItemTitleFontColor` (for title text color).
   * Overrides `tabBarTintColor`.
   *
   * @platform ios
   */
  tabBarItemIconColor?: ColorValue;

  /**
   * Specifies background color of badges for every tab item in the
   * tab bar when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemBadgeBackgroundColor?: ColorValue;

  /**
   * Specifies which special effects (also known as microinteractions)
   * are enabled for tab screen.
   *
   * For repeated tab selection (selecting already focused tab bar item),
   * there are 2 special effects:
   * - `popToRoot` - when Stack is nested inside tab screen and repeated
   *   selection is detected, the Stack will pop to root screen.
   * - `scrollToTop` - when ScrollView is in first descendant chain from
   *   tab screen and repeated selection is detected, ScrollView will
   *   be scrolled to top.
   *
   * `popToRoot` has priority over `scrollToTop`,
   *
   * @default All special effects are enabled by default.
   *
   * @platform ios
   */
  specialEffects?: {
    repeatedTabSelection?: {
      popToRoot?: boolean;
      scrollToTop?: boolean;
    };
  };

  /**
   * Specifies if `contentInsetAdjustmentBehavior` of ScrollViews in first
   * descendant chain from tab screen should be overriden back from `never`
   * to `automatic`.
   *
   * By default, `react-native`'s ScrollView has `contentInsetAdjustmentBehavior`
   * set to `never` instead of UIKit-default (which is `automatic`). This
   * prevents ScrollViews from respecting navigation bar insets.
   * When this prop is set to `true`, `automatic` behavior is reverted for
   * first ScrollView in first descendant chain from tab screen.
   *
   * @default Defaults to `true`.
   *
   * @platform ios
   */
  overrideScrollViewContentInsetAdjustmentBehavior?: boolean;

  // Events

  /**
   * A callback that gets invoked when the tab screen will appear.
   * This is called as soon as the transition begins.
   *
   * @platform android, ios
   */
  onWillAppear?: BottomTabsScreenEventHandler<EmptyObject>;

  /**
   * A callback that gets invoked when the tab screen did appear.
   * This is called as soon as the transition ends.
   *
   * @platform android, ios
   */
  onDidAppear?: BottomTabsScreenEventHandler<EmptyObject>;

  /**
   * A callback that gets invoked when the tab screeen will disappear.
   * This is called as soon as the transition begins.
   *
   * @platform android, ios
   */
  onWillDisappear?: BottomTabsScreenEventHandler<EmptyObject>;

  /**
   * A callback that gets invoked when the tab screen did disappear.
   * This is called as soon as the transition ends.
   *
   * @platform android, ios
   */
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
