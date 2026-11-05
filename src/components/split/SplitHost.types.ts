import type { ViewProps } from 'react-native';
import type {
  InterfaceOrientation,
  ColorScheme,
  EmptyEventPayload,
  NativeEventHandler,
} from '../shared/types';

export type DisplayModeWillChangeEvent = {
  currentDisplayMode: string;
  nextDisplayMode: string;
};

/**
 * Visibility of the button for changing the Split display mode.
 *
 * @remarks
 * The following values are currently supported:
 * - `'automatic'` — the visibility of the display mode button is set by
 *   system
 * - `'always'` — the display mode button is always visible
 * - `'never'` — the display mode button is always hidden
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uisplitviewcontroller/displaymodebuttonvisibility-swift.enum | UISplitViewController.DisplayModeButtonVisibility}
 */
export type SplitDisplayModeButtonVisibility = 'always' | 'automatic' | 'never';

/**
 * Split behavior of a Split.
 *
 * @remarks
 * The following values are currently supported:
 * - `'automatic'` — chosen by the OS, the appropriate split behavior is based
 *   on the device and the current app size
 * - `'displace'` — the main column is moved partially offscreen, making a
 *   space for sidebars
 * - `'overlay'` — the sidebars are partially covering main column
 * - `'tile'` — the sidebars appear side-by-side with the main column
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uisplitviewcontroller/splitbehavior-swift.enum | UISplitViewController.SplitBehavior}
 */
export type SplitBehavior = 'automatic' | 'displace' | 'overlay' | 'tile';

/**
 * Side on which the primary sidebar of a Split is placed.
 *
 * @remarks
 * The following values are currently supported:
 * - `'leading'` — primary sidebar is placed on the leading edge of the
 *   interface
 * - `'trailing'` — primary sidebar is placed on the trailing edge of the
 *   interface
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uisplitviewcontroller/primaryedge-swift.enum | UISplitViewController.PrimaryEdge}
 */
export type SplitPrimaryEdge = 'leading' | 'trailing';

/**
 * Background style of the primary view controller of a Split.
 *
 * @remarks
 * The following values are currently supported:
 * - `'default'` — chosen by the OS, the appropriate background style is based
 *   on the device preferences
 * - `'none'` — a style that has no visual effect on the background appearance
 *   of the primary view controller
 * - `'sidebar'` — a style that applies a blurred effect to the background of
 *   the primary view controller
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uisplitviewcontroller/backgroundstyle | UISplitViewController.BackgroundStyle}
 */
export type SplitPrimaryBackgroundStyle = 'default' | 'none' | 'sidebar';

/**
 * Display mode of a Split.
 *
 * @remarks
 * The following values are currently supported:
 * - `'automatic'` — display mode is chosen by the OS, the appropriate display
 *   mode is based on the device and the current app size
 * - `'secondaryOnly'` — only the secondary column is displayed
 * - `'oneBesideSecondary'` — a sidebar is displayed side-by-side with the
 *   secondary column
 * - `'twoBesideSecondary'` — two sidebars are displayed side-by-side with the
 *   secondary column
 * - `'oneOverSecondary'` — one sidebar is displayed over the secondary column
 * - `'twoOverSecondary'` — two sidebars are displayed over the secondary
 *   column
 * - `'twoDisplaceSecondary'` — two sidebars are displacing the secondary
 *   column, moving it partially offscreen
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uisplitviewcontroller/displaymode-swift.enum | UISplitViewController.DisplayMode}
 */
export type SplitDisplayMode =
  | 'automatic'
  | 'secondaryOnly'
  | 'oneBesideSecondary'
  | 'oneOverSecondary'
  | 'twoBesideSecondary'
  | 'twoOverSecondary'
  | 'twoDisplaceSecondary';

/**
 * Supported orientations of a Split.
 *
 * @remarks
 * The following values are currently supported:
 * - `'inherit'` — Split supports the same orientations as parent component,
 * - `'all'` — Split supports all orientations,
 * - `'allButUpsideDown'` — Split supports all but the upside-down portrait
 *   interface orientation,
 * - `'portrait'` — Split supports both portrait-up and portrait-down
 *   interface orientations,
 * - `'portraitUp'` — Split supports a portrait-up interface orientation,
 * - `'portraitDown'` — Split supports a portrait-down interface orientation,
 * - `'landscape'` — Split supports both landscape-left and landscape-right
 *   interface orientations,
 * - `'landscapeLeft'` — Split supports landscape-left interface orientation,
 * - `'landscapeRight'` — Split supports landscape-right interface
 *   orientation.
 *
 * @see {@link https://developer.apple.com/documentation/uikit/uiinterfaceorientationmask | UIInterfaceOrientationMask}
 */
export type SplitOrientation = InterfaceOrientation | 'inherit';

/**
 * Color scheme used by a Split and any child containers.
 *
 * @remarks
 * The following values are currently supported:
 * - `'inherit'` — the interface style from parent,
 * - `'light'` — the light interface style,
 * - `'dark'` — the dark interface style.
 */
export type SplitColorScheme = ColorScheme | 'inherit';

export interface SplitColumnMetrics {
  /**
   * Minimum width for the primary sidebar.
   *
   * @remarks
   * Specifies the minimum width for the primary column in the Split layout,
   * typically representing the leftmost sidebar.
   */
  minimumPrimaryColumnWidth?: number | undefined;
  /**
   * Maximum width for the primary sidebar.
   *
   * @remarks
   * Specifies the maximum width (in points) for the primary column in the
   * Split layout, typically representing the leftmost sidebar.
   */
  maximumPrimaryColumnWidth?: number | undefined;
  /**
   * Preferred width for the primary sidebar.
   *
   * @remarks
   * Specifies the preferred width (in points or as a fraction for percentage
   * width support) for the primary column in the Split layout, typically
   * representing the leftmost sidebar.
   */
  preferredPrimaryColumnWidthOrFraction?: number | undefined;
  /**
   * Minimum width for the intermediate sidebar.
   *
   * @remarks
   * Specifies the minimum width (in points) for the supplementary column in
   * the Split layout, typically representing the intermediate sidebar.
   */
  minimumSupplementaryColumnWidth?: number | undefined;
  /**
   * Maximum width for the intermediate sidebar.
   *
   * @remarks
   * Specifies the maximum width (in points) for the supplementary column in
   * the Split layout, typically representing the intermediate sidebar.
   */
  maximumSupplementaryColumnWidth?: number | undefined;
  /**
   * Preferred width for the intermediate sidebar.
   *
   * @remarks
   * Specifies the preferred width (in points or as a fraction for percentage
   * width support) for the supplementary column in the Split layout,
   * typically representing the intermediate sidebar.
   */
  preferredSupplementaryColumnWidthOrFraction?: number | undefined;
  /**
   * Minimum width for the secondary component.
   *
   * @remarks
   * Specifies the minimum width (in points) for the secondary column in the
   * Split layout, typically for the view with the main content.
   *
   * Supported on iOS 26 or higher.
   */
  minimumSecondaryColumnWidth?: number | undefined;
  /**
   * Preferred width for the secondary component.
   *
   * @remarks
   * Specifies the preferred width (in points or as a fraction for percentage
   * width support) for the secondary column in the Split layout, typically
   * for the view with the main content.
   *
   * Supported on iOS 26 or higher.
   */
  preferredSecondaryColumnWidthOrFraction?: number | undefined;
  /**
   * Minimum width for the inspector component.
   *
   * @remarks
   * Specifies the minimum width (in points) for the inspector column in the
   * Split layout, typically the view which is providing additional data about
   * the secondary column.
   *
   * Supported on iOS 26 or higher.
   */
  minimumInspectorColumnWidth?: number | undefined;
  /**
   * Maximum width for the inspector component.
   *
   * @remarks
   * Specifies the maximum width (in points) for the inspector column in the
   * Split layout, typically the view which is providing additional data about
   * the secondary column.
   *
   * Supported on iOS 26 or higher.
   */
  maximumInspectorColumnWidth?: number | undefined;
  /**
   * Preferred width for the inspector component.
   *
   * @remarks
   * Specifies the preferred width (in points or as a fraction for percentage
   * width support) for the inspector column in the Split layout, typically
   * the view which is providing additional data about the secondary column.
   *
   * Supported on iOS 26 or higher.
   */
  preferredInspectorColumnWidthOrFraction?: number | undefined;
}

/**
 * Column of a Split.
 *
 * @remarks
 * The following values are currently supported:
 * - `'primary'` — the primary sidebar is shown
 * - `'supplementary'` — the supplementary sidebar is shown
 * - `'secondary'` — the secondary (main content) column is shown
 */
export type SplitNavigableColumn = 'primary' | 'supplementary' | 'secondary';

export type SplitHostCommands = {
  show: (column: SplitNavigableColumn) => void;
  /**
   * Hides a sidebar column using UIKit's native transition to the closest
   * supported display mode. UIKit does not support hiding the secondary column.
   *
   * @see {@link https://developer.apple.com/documentation/uikit/uisplitviewcontroller/hide(_:) | UISplitViewController.hide(_:)}
   */
  hide: (column: Exclude<SplitNavigableColumn, 'secondary'>) => void;
};

/**
 * Props for {@link Split.Host}.
 *
 * @experimental
 */
export interface SplitHostProps extends ViewProps {
  children: NonNullable<React.ReactNode>;
  ref?: React.Ref<SplitHostCommands> | undefined;

  /**
   * An object describing bounds for column widths.
   *
   * @remarks
   * It supports definitions for the following columns:
   *
   * - `primary` - the leftmost sidebar
   * - `supplementary` - the intermediate sidebar
   *
   * On iOS 26 or higher, it also supports definitions for:
   *
   * - `secondary` - the view with the main content
   * - `inspector` - the view which is providing additional data about the
   *   secondary column
   *
   * @platform ios
   */
  columnMetrics?: SplitColumnMetrics | undefined;
  /**
   * Determines whether the button for changing the Split display mode is
   * visible on the screen.
   *
   * @defaultValue `'automatic'`
   * @platform ios
   */
  displayModeButtonVisibility?: SplitDisplayModeButtonVisibility | undefined;
  /**
   * A callback that gets invoked when the Split was collapsed to a single
   * column.
   *
   * @platform ios
   */
  onCollapse?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * A callback that gets invoked when the Split displayMode is about to
   * change.
   *
   * @remarks
   * The purpose of this callback is tracking displayMode updates on host from
   * the JS side. These updates might be a consequence of some native
   * interactions, like pressing native button or performing swipe gesture.
   *
   * @platform ios
   */
  onDisplayModeWillChange?:
    | NativeEventHandler<DisplayModeWillChangeEvent>
    | undefined;
  /**
   * A callback that gets invoked when the Split was expanded to multiple
   * columns.
   *
   * @platform ios
   */
  onExpand?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * A callback that gets invoked when the Split inspector is either
   * programmatically hidden (in column presentation) or dismissed (in modal
   * presentation).
   *
   * @remarks
   * The purpose of this callback depends on whether the Split is collapsed or
   * expanded.
   *
   * @platform ios >= 26
   */
  onInspectorHide?: NativeEventHandler<EmptyEventPayload> | undefined;
  /**
   * Specifies supported orientations for the Split.
   *
   * @remarks
   * Procedure for determining supported orientations:
   * 1. Traversal initiates from the root component and moves to the
   *    deepest child possible.
   * 2. Components are queried for their supported orientations:
   *    - if `orientation` is explicitly set (e.g., `portrait`,
   *      `landscape`), it is immediately used,
   *    - if `orientation` is set to `inherit`, the parent component
   *      is queried.
   *
   * @defaultValue `'inherit'`
   * @platform ios
   */
  orientation?: SplitOrientation | undefined;
  /**
   * Specifies the color scheme used by the container and any child
   * containers.
   *
   * @defaultValue `'inherit'`
   * @platform ios
   */
  colorScheme?: SplitColorScheme | undefined;
  /**
   * Determines whether gestures are enabled to change the display mode.
   *
   * @defaultValue `true`
   * @platform ios
   */
  presentsWithGesture?: boolean | undefined;
  /**
   * Specifies the display mode which will be preferred to use, if the layout
   * requirements are met.
   *
   * @remarks
   * Preferred means that we may only suggest the OS which layout we're
   * expecting, but the final decision is dependent on the device's type and
   * size class.
   *
   * @defaultValue `'automatic'`
   * @platform ios
   */
  preferredDisplayMode?: SplitDisplayMode | undefined;
  /**
   * Specifies the split behavior which will be preferred to use, if the layout
   * requirements are met.
   *
   * @remarks
   * Preferred means that we may only suggest the OS which layout we're
   * expecting, but the final decision is dependent on the device's type and
   * size class.
   *
   * @defaultValue `'automatic'`
   * @platform ios
   */
  preferredSplitBehavior?: SplitBehavior | undefined;
  /**
   * Specifies the background style of the primary view controller.
   *
   * @remarks
   * On iOS 18 or lower, we always fall back to `none` which is a system
   * default value. Since iOS 26 the system default value is `sidebar`.
   *
   * According to the documentation, this property shouldn't have any effect
   * on iOS. However, on iOS 26 the support for this prop was added.
   *
   * @defaultValue `'default'`
   * @platform ios >= 26
   */
  primaryBackgroundStyle?: SplitPrimaryBackgroundStyle | undefined;
  /**
   * Indicates on which side primary sidebar is placed, affecting the split
   * view layout.
   *
   * @defaultValue `'leading'`
   * @platform ios
   */
  primaryEdge?: SplitPrimaryEdge | undefined;
  /**
   * Determines whether inspector column should be displayed.
   *
   * @remarks
   * Inspector will be displayed on the trailing edge of the main (secondary)
   * column (for expanded Split) or as a modal (for collapsed Split). The
   * result on the interface for this prop depends on whether the Split is
   * collapsed or expanded.
   *
   * @defaultValue `false`
   * @platform ios >= 26
   */
  showInspector?: boolean | undefined;
  /**
   * Determines whether a button to toggle to and from secondaryOnly display
   * mode is visible.
   *
   * @defaultValue `false`
   * @platform ios
   */
  showSecondaryToggleButton?: boolean | undefined;
  /**
   * Specifies which column should be shown when the split view collapses to a
   * single column.
   *
   * @remarks
   * When the split view transitions from an expanded to a collapsed layout
   * (e.g. rotating an iPad to portrait), this prop determines which column
   * becomes the top (visible) column.
   *
   * When not set, the system default behavior is used.
   *
   * @platform ios
   */
  topColumnForCollapsing?: SplitNavigableColumn | undefined;
}
