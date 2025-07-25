import type {
  ColorValue,
  ImageSourcePropType,
  NativeSyntheticEvent,
  TextStyle,
  ViewProps,
} from 'react-native';

export type EmptyObject = Record<string, never>;

export type BottomTabsScreenEventHandler<T> = (
  event: NativeSyntheticEvent<T>,
) => void;

export type LifecycleStateChangeEvent = Readonly<{
  previousState: number;
  newState: number;
}>;

// iOS-specific: SFSymbol usage
export interface SFIcon {
  sfSymbolName: string;
}

// iOS-specific
export interface ImageIcon {
  imageSource: ImageSourcePropType;
}

// iOS-specific: image as a template usage
export interface TemplateIcon {
  templateSource: ImageSourcePropType;
}

// iOS-specific: SFSymbol, image as a template usage
export type Icon = SFIcon | ImageIcon | TemplateIcon;

// iOS-specific
export type BottomTabsScreenBlurEffect =
  | 'none'
  | 'systemDefault'
  | 'extraLight'
  | 'light'
  | 'dark'
  | 'regular'
  | 'prominent'
  | 'systemUltraThinMaterial'
  | 'systemThinMaterial'
  | 'systemMaterial'
  | 'systemThickMaterial'
  | 'systemChromeMaterial'
  | 'systemUltraThinMaterialLight'
  | 'systemThinMaterialLight'
  | 'systemMaterialLight'
  | 'systemThickMaterialLight'
  | 'systemChromeMaterialLight'
  | 'systemUltraThinMaterialDark'
  | 'systemThinMaterialDark'
  | 'systemMaterialDark'
  | 'systemThickMaterialDark'
  | 'systemChromeMaterialDark';

export interface BottomTabsScreenProps {
  children?: ViewProps['children'];
  /**
   * @summary Defines what should be rendered when tab screen is frozen.
   *
   * @see {@link https://github.com/software-mansion/react-freeze|`react-freeze`'s GitHub repository} for more information about `react-freeze`.
   *
   * @platform android, ios
   */
  placeholder?: React.ReactNode | undefined;

  // #region Control
  /**
   * @summary Determines selected tab.
   *
   * In controlled container mode, determines if tab screen is currently
   * focused.
   *
   * In managed container mode, it only indicates initially selected tab.
   *
   * There should be exactly one focused screen at any given time.
   *
   * @platform android, ios
   */
  isFocused?: boolean;
  /**
   * @summary Identifies screen, e.g. when receiving onNativeFocusChange event.
   *
   * @platform android, ios
   */
  tabKey: string;
  // #endregion

  // #region General
  /**
   * @summary Title of the tab screen, displayed in the tab bar.
   *
   * @platform android, ios
   */
  title?: string;
  /**
   * @summary Specifies content of tab bar item badge.
   *
   * @todo Describe prop behavior on Android.
   * On iOS, badge is displayed as regular string.
   *
   * @platform android, ios
   */
  badgeValue?: string;
  // #endregion General

  // #region Android-only appearance
  iconResourceName?: string;
  tabBarItemBadgeTextColor?: ColorValue;
  // #endregion Android-only appearance

  // #region iOS-only appearance
  /**
   * @summary Specifies background color of the entire tab bar when tab screen is selected.
   *
   * Since iOS 26, it does not affect the tab bar.
   *
   * @platform ios
   * @supported iOS 18 or lower
   */
  tabBarBackgroundColor?: ColorValue;
  /**
   * @summary Specifies blur effect applied to tab bar when tab screen is selected.
   *
   * Works with backgroundColor's alpha < 1.
   *
   * Since iOS 26, it does not affect the tab bar.
   *
   * The following values are currently supported:
   *
   * - `none` - disables blur effect
   * - `systemDefault` - uses UIKit's default tab bar blur effect
   * - one of styles mapped from UIKit's UIBlurEffectStyle, e.g. `systemUltraThinMaterial`
   *
   * Complete list of possible blur effect styles is available in the official UIKit documentation:
   * @see {@link https://developer.apple.com/documentation/uikit/uiblureffect/style|UIBlurEffect.Style}
   *
   * @default systemDefault
   *
   * @platform ios
   * @supported iOS 18 or lower
   */
  tabBarBlurEffect?: BottomTabsScreenBlurEffect;
  /**
   * @summary Specifies title font family of every tab item in the tab bar
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontFamily?: TextStyle['fontFamily'];
  /**
   * @summary Specifies title font size of every tab item in the tab bar
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontSize?: TextStyle['fontSize'];
  /**
   * @summary Specifies title font weight of every tab item in the tab bar
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontWeight?: TextStyle['fontWeight'];
  /**
   * @summary Specifies title font style of every tab item in the tab bar
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontStyle?: TextStyle['fontStyle'];
  /**
   * @summary Specifies title font color of every tab item in the tab bar
   * when tab screen is selected.
   *
   * Overrides color defined in `tabBarTintColor` and `tabBarItemIconColor`.
   *
   * @platform ios
   */
  tabBarItemTitleFontColor?: TextStyle['color'];
  /**
   * @summary Specifies title offset of every tab item in the tab bar
   * when tab screen is selected.
   *
   * Depending on the iOS version and the device's interface orientation,
   * this setting may affect the appearance of the text, badge and icon.
   *
   * @platform ios
   */
  tabBarItemTitlePositionAdjustment?: {
    horizontal?: number;
    vertical?: number;
  };
  /**
   * @summary Specifies icon for tab bar item representing the tab screen.
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
   * @summary Specifies icon for tab bar item representing the tab screen
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
   * @summary Specifies color of the icons for every tab item in the tab bar
   * when tab screen is selected. Impacts also title text color.
   *
   * On iOS 26, it only applies to selected tab bar item. Other items
   * adopt a dark or light appearance depending on the theme of the tab bar.
   *
   * Is overriden by `tabBarItemTitleFontColor` (for title text color).
   * Overrides `tabBarTintColor`.
   *
   * @platform ios
   */
  tabBarItemIconColor?: ColorValue;
  /**
   * @summary Specifies background color of badges for every tab item in the
   * tab bar when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemBadgeBackgroundColor?: ColorValue;
  /**
   * @summary Specifies which special effects (also known as microinteractions)
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
   * @summary Specifies if `contentInsetAdjustmentBehavior` of ScrollViews in first
   * descendant chain from tab screen should be overriden back from `never`
   * to `automatic`.
   *
   * By default, `react-native`'s ScrollView has `contentInsetAdjustmentBehavior`
   * set to `never` instead of UIKit-default (which is `automatic`). This
   * prevents ScrollViews from respecting navigation bar insets.
   * When this prop is set to `true`, `automatic` behavior is reverted for
   * first ScrollView in first descendant chain from tab screen.
   *
   * @default true
   *
   * @platform ios
   */
  overrideScrollViewContentInsetAdjustmentBehavior?: boolean;
  // #endregion iOS-only appearance

  // #region Events
  /**
   * @summary A callback that gets invoked when the tab screen will appear.
   * This is called as soon as the transition begins.
   *
   * @platform android, ios
   */
  onWillAppear?: BottomTabsScreenEventHandler<EmptyObject>;
  /**
   * @summary A callback that gets invoked when the tab screen did appear.
   * This is called as soon as the transition ends.
   *
   * @platform android, ios
   */
  onDidAppear?: BottomTabsScreenEventHandler<EmptyObject>;
  /**
   * @summary A callback that gets invoked when the tab screeen will disappear.
   * This is called as soon as the transition begins.
   *
   * @platform android, ios
   */
  onWillDisappear?: BottomTabsScreenEventHandler<EmptyObject>;
  /**
   * @summary A callback that gets invoked when the tab screen did disappear.
   * This is called as soon as the transition ends.
   *
   * @platform android, ios
   */
  onDidDisappear?: BottomTabsScreenEventHandler<EmptyObject>;
  // #endregion Events
}
