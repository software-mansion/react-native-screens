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
   * @summary Title of the tab screen, displayed in the tab bar item.
   *
   * @platform android, ios
   */
  title?: string;
  /**
   * @summary Specifies content of tab bar item badge.
   *
   * On iOS, badge is displayed as regular string.
   *
   * On Android, the value is interpreted in the following order:
   * - if the string can be parsed to integer, displays the value as a number;
   * - otherwise if the string is empty, displays "small dot" badge;
   * - otherwise, displays the value as a text.
   *
   * @platform android, ios
   */
  badgeValue?: string;
  // #endregion General

  // #region Common appearance
  /**
   * @summary Specifies the background color for the badge.
   *
   * On Android, it applies to the badge inside the tab bar item.
   *
   * On iOS, it applies to each badge for every tab bar item when tab screen
   * is selected.
   *
   * @platform android, ios
   */
  tabBarItemBadgeBackgroundColor?: ColorValue;
  // #endregion Common appearance

  // #region Android-only appearance
  /**
   * @summary Specifies the icon for the tab bar item.
   *
   * Accepts a string corresponding to the resource name. Initially searches within
   * the app's drawable resources. If no matching resource is found, it defaults to
   * searching within the Android's drawable resources.
   *
   * @platform android
   */
  iconResourceName?: string;
  /**
   * @summary Specifies the color of the text in the badge.
   *
   * @platform android
   */
  tabBarItemBadgeTextColor?: ColorValue;
  // #endregion Android-only appearance

  // #region iOS-only appearance
  /**
   * @summary Specifies the background color for the entire tab bar when tab screen is selected.
   *
   * This property does not affect the tab bar starting from iOS 26.
   *
   * @platform android, ios
   * @supported iOS 18 or lower
   */
  tabBarBackgroundColor?: ColorValue;
  /**
   * @summary Specifies the blur effect applied to the tab bar when tab screen is selected.
   *
   * Works with backgroundColor's alpha < 1.
   *
   * This property does not affect the tab bar starting from iOS 26.
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
   * @summary Specifies the font family used for the title of each tab bar item
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontFamily?: TextStyle['fontFamily'];
  /**
   * @summary Specifies the font size used for the title of each tab bar item
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontSize?: TextStyle['fontSize'];
  /**
   * @summary Specifies the font weight used for the title of each tab bar item
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontWeight?: TextStyle['fontWeight'];
  /**
   * @summary Specifies the font style used for the title of each tab bar item
   * when tab screen is selected.
   *
   * @platform ios
   */
  tabBarItemTitleFontStyle?: TextStyle['fontStyle'];
  /**
   * @summary Specifies the font color used for the title of each tab bar item
   * when tab screen is selected.
   *
   * Overrides the color defined in `tabBarTintColor` and `tabBarItemIconColor`.
   *
   * @platform ios
   */
  tabBarItemTitleFontColor?: TextStyle['color'];
  /**
   * @summary Specifies the title offset for each tab bar item when tab screen
   * is selected.
   *
   * Depending on the iOS version and the device's interface orientation,
   * this setting may affect the alignment of the text, badge and icon.
   *
   * @platform ios
   */
  tabBarItemTitlePositionAdjustment?: {
    horizontal?: number;
    vertical?: number;
  };
  /**
   * @summary Specifies the icon for the tab bar item.
   *
   * The following values are currently supported:
   *
   * - an object with `sfSymbolName` - will attempt to use SF
   *   Symbol with given name,
   * - an object with `imageSource` - will attempt to use image
   *   from provided resource,
   * - an object with `templateSource` - will attempt to use image
   *   from provided resource as template (the color of the image will
   *   depend on props related to icon color and tab bar item's state).
   *
   * If no `selectedIcon` is provided, it will also be used as `selectedIcon`.
   *
   * @platform ios
   */
  icon?: Icon;
  /**
   * @summary Specifies the icon for tab bar item when it is selected.
   *
   * Supports the same values as `icon` property.
   *
   * To use `selectedIcon`, `icon` must also be provided.
   *
   * @platform ios
   */
  selectedIcon?: Icon;
  /**
   * @summary Specifies the icon color for each tab bar item when tab screen
   * is selected.
   *
   * This also impacts the title text color.
   *
   * Starting from iOS 26, it only applies to selected tab bar item. Other items
   * adopt a dark or light appearance depending on the theme of the tab bar.
   *
   * Is overridden by `tabBarItemTitleFontColor` (for title text color).
   * Overrides `tabBarTintColor`.
   *
   * @platform ios
   */
  tabBarItemIconColor?: ColorValue;
  /**
   * @summary Specifies which special effects (also known as microinteractions)
   * are enabled for the tab screen.
   *
   * For repeated tab selection (selecting already focused tab bar item),
   * there are 2 supported special effects:
   * - `popToRoot` - when Stack is nested inside tab screen and repeated
   *   selection is detected, the Stack will pop to root screen,
   * - `scrollToTop` - when there is a ScrollView in first descendant
   *   chain from tab screen and repeated selection is detected, ScrollView
   *   will be scrolled to top.
   *
   * `popToRoot` has priority over `scrollToTop`.
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
   * @summary Allows to control whether contents of a tab screen should be frozen or not. This overrides any default behavior.
   *
   * @default `undefined`
   */
  freezeContents?: boolean;
  /**
   * @summary Specifies if `contentInsetAdjustmentBehavior` of first ScrollView
   * in first descendant chain from tab screen should be overridden back from `never`
   * to `automatic`.
   *
   * By default, `react-native`'s ScrollView has `contentInsetAdjustmentBehavior`
   * set to `never` instead of UIKit-default (which is `automatic`). This
   * prevents ScrollViews from respecting navigation bar insets.
   * When this prop is set to `true`, `automatic` behavior is reverted.
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
   * @summary A callback that gets invoked when the tab screen will disappear.
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
