import type { NativeSyntheticEvent, ViewProps } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

export type DisplayModeWillChangeEvent = {
  currentDisplayMode: string;
  nextDisplayMode: string;
};

export type SplitViewDisplayModeButtonVisibility =
  | 'always'
  | 'automatic'
  | 'never';

export type SplitViewSplitBehavior =
  | 'automatic'
  | 'displace'
  | 'overlay'
  | 'tile';

export type SplitViewPrimaryEdge = 'leading' | 'trailing';

export type SplitViewPrimaryBackgroundStyle = 'default' | 'none' | 'sidebar';

export type SplitViewDisplayMode =
  | 'automatic'
  | 'secondaryOnly'
  | 'oneBesideSecondary'
  | 'oneOverSecondary'
  | 'twoBesideSecondary'
  | 'twoOverSecondary'
  | 'twoDisplaceSecondary';

export type SplitViewHostOrientation =
  | 'inherit'
  | 'all'
  | 'allButUpsideDown'
  | 'portrait'
  | 'portraitUp'
  | 'portraitDown'
  | 'landscape'
  | 'landscapeLeft'
  | 'landscapeRight';

export interface SplitViewColumnMetrics {
  /**
   * @summary Minimum width for the primary sidebar.
   *
   * Specifies the minimum width for the primary column in the SplitView layout, typically representing the leftmost sidebar.
   */
  minimumPrimaryColumnWidth?: number;
  /**
   * @summary Maximum width for the primary sidebar.
   *
   * Specifies the maximum width (in points) for the primary column in the SplitView layout, typically representing the leftmost sidebar.
   */
  maximumPrimaryColumnWidth?: number;
  /**
   * @summary Preferred width for the primary sidebar.
   *
   * Specifies the preferred width (in points or as a fraction for percentage width support) for the primary column in the SplitView layout, typically representing the leftmost sidebar.
   */
  preferredPrimaryColumnWidthOrFraction?: number;
  /**
   * @summary Minimum width for the intermediate sidebar.
   *
   * Specifies the minimum width (in points) for the supplementary column in the SplitView layout, typically representing the intermediate sidebar.
   */
  minimumSupplementaryColumnWidth?: number;
  /**
   * @summary Maximum width for the intermediate sidebar.
   *
   * Specifies the maximum width (in points) for the supplementary column in the SplitView layout, typically representing the intermediate sidebar.
   */
  maximumSupplementaryColumnWidth?: number;
  /**
   * @summary Preferred width for the intermediate sidebar.
   *
   * Specifies the preferred width (in points or as a fraction for percentage width support) for the supplementary column in the SplitView layout, typically representing the intermediate sidebar.
   */
  preferredSupplementaryColumnWidthOrFraction?: number;
  /**
   * @summary Minimum width for the secondary component.
   *
   * Specifies the minimum width (in points) for the secondary column in the SplitView layout, typically for the view with the main content.
   *
   * @supported iOS 26 or higher
   */
  minimumSecondaryColumnWidth?: number;
  /**
   * @summary Preferred width for the secondary component.
   *
   * Specifies the preferred width (in points or as a fraction for percentage width support) for the secondary column in the SplitView layout, typically for the view with the main content.
   *
   * @supported iOS 26 or higher
   */
  preferredSecondaryColumnWidthOrFraction?: number;
  /**
   * @summary Minimum width for the inspector component.
   *
   * Specifies the minimum width (in points) for the inspector column in the SplitView layout, typically the view which is providing additional data about the secondary column.
   *
   * @supported iOS 26 or higher
   */
  minimumInspectorColumnWidth?: number;
  /**
   * @summary Maximum width for the inspector component.
   *
   * Specifies the maximum width (in points) for the inspector column in the SplitView layout, typically the view which is providing additional data about the secondary column.
   *
   * @supported iOS 26 or higher
   */
  maximumInspectorColumnWidth?: number;
  /**
   * @summary Preferred width for the inspector component.
   *
   * Specifies the preferred width (in points or as a fraction for percentage width support) for the inspector column in the SplitView layout, typically the view which is providing additional data about the secondary column.
   *
   * @supported iOS 26 or higher
   */
  preferredInspectorColumnWidthOrFraction?: number;
}
export interface SplitViewHostProps extends ViewProps {
  children?: React.ReactNode;

  /**
   * @summary An object describing bounds for column widths.
   *
   * It supports definitions for the following columns:
   *
   * - `primary` - the leftmost sidebar
   * - `supplementary` - the intermediate sidebar
   *
   * On iOS 26 or higher, it also supports definitions for:
   *
   * - `secondary` - the view with the main content
   * - `inspector` - the view which is providing additional data about the secondary column
   */
  columnMetrics?: SplitViewColumnMetrics;
  /**
   * @summary Determines whether the button for changing the SplitView display mode is visible on the screen.
   *
   * The following values are currently supported:
   *
   * - `automatic` - the visibility of the display mode button is set by system
   * - `always` – the display mode button is always visible
   * - `never` – the display mode button is always hidden
   *
   * The supported values corresponds to the official UIKit documentation:
   * @see {@link https://developer.apple.com/documentation/uikit/uisplitviewcontroller/displaymodebuttonvisibility-swift.enum|UISplitViewController.DisplayModeButtonVisibility}
   *
   * @default automatic
   */
  displayModeButtonVisibility?: SplitViewDisplayModeButtonVisibility;
  /**
   * @summary A callback that gets invoked when the SplitView was collapsed to a single column.
   */
  onCollapse?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
  /**
   * @summary A callback that gets invoked when the SplitView displayMode has changed.
   *
   * The purpose of this callback is tracking displayMode updates on host from the JS side.
   * These updates might be a consequence of some native interactions, like pressing native button or performing swipe gesture.
   */
  onDisplayModeWillChange?: (
    e: NativeSyntheticEvent<DisplayModeWillChangeEvent>,
  ) => void;
  /**
   * @summary A callback that gets invoked when the SplitView was expanded to multiple columns.
   */
  onExpand?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
  /**
   * @summary A callback that gets invoked when the SplitView inspector is either programmatically hidden (in column presentation) or dismissed (in modal presentation).
   *
   * The purpose of this callback depends on whether the SplitView is collapsed or expanded.
   *
   * @supported iOS 26 or higher
   */
  onInspectorHide?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
  /**
   * @summary Specifies supported orientations for the tab screen.
   *
   * Procedure for determining supported orientations:
   * 1. Traversal initiates from the root component and moves to the
   *    deepest child possible.
   * 2. Components are queried for their supported orientations:
   *    - if `orientation` is explicitly set (e.g., `portrait`,
   *      `landscape`), it is immediately used,
   *    - if `orientation` is set to `inherit`, the parent component
   *      is queried.
   *
   * The following values are currently supported:
   *
   * - `inherit` - tab screen supports the same orientations as parent
   *   component,
   * - `all` - tab screen supports all orientations,
   * - `allButUpsideDown` - tab screen supports all but the upside-down
   *   portrait interface orientation,
   * - `portrait` - tab screen supports both portrait-up and portrait-down
   *   interface orientations,
   * - 'portraitUp' - tab screen supports a portrait-up interface
   *   orientation,
   * - `portraitDown` - tab screen supports a portrait-down interface
   *   orientation,
   *   interface orientation,
   * - `landscape` - tab screen supports both landscape-left and
   *   landscape-right interface orientations,
   * - `landscapeLeft` - tab screen supports landscape-left interface
   *   orientaion,
   * - `landscapeRight` - tab screen supports landscape-right interface
   *   orientaion.
   *
   * The supported values (apart from `inherit`) correspond to the official
   * UIKit documentation:
   *
   * @see {@link https://developer.apple.com/documentation/uikit/uiinterfaceorientationmask|UIInterfaceOrientationMask}
   *
   * @default inherit
   *
   * @platform ios
   */
  orientation?: SplitViewHostOrientation;
  /**
   * @summary Determines whether gestures are enabled to change the display mode.
   */
  presentsWithGesture?: boolean;
  /**
   * @summary Specifies the display mode which will be preferred to use, if the layout requirements are met.
   *
   * Preferred means that we may only suggest the OS which layout we're expecting, but the final decision is dependent on the device's type and size class.
   *
   * The following values are currently supported:
   *
   * - `automatic` - display mode is chosen by the OS, the appropriate display mode is based on the device and the current app size
   * - `secondaryOnly` – only the secondary column is displayed
   * - `oneBesideSecondary` – a sidebar is displayed side-by-side with the secondary column
   * - `twoBesideSecondary` – two sidebars are displayed side-by-side with the secondary column
   * - `oneOverSecondary` – a one sidebar is displayed over the secondary column
   * - `twoOverSecondary` – two sidebars are displayed over the secondary column
   * - `twoDisplaceSecondary` – two sidebars are displacind the secondary column, moving it partially offscreen
   *
   * The supported values corresponds to the official UIKit documentation:
   * @see {@link https://developer.apple.com/documentation/uikit/uisplitviewcontroller/displaymode-swift.enum|UISplitViewController.DisplayMode}
   *
   * @default automatic
   */
  preferredDisplayMode?: SplitViewDisplayMode;
  /**
   * @summary Specifies the split behavior which will be preferred to use, if the layout requirements are met.
   *
   * Preferred means that we may only suggest the OS which layout we're expecting, but the final decision is dependent on the device's type and size class.
   *
   * The following values are currently supported:
   *
   * - `automatic` - chosen by the OS, the appropriate split behavior is based on the device and the current app size
   * - `displace` – the main column is moved partially offscreen, making a space for sidebars
   * - `overlay` – the sidebars are partially covering main column
   * - `tile` – the sidebars appears side-by-side with the main column
   *
   * The supported values corresponds to the official UIKit documentation:
   * @see {@link https://developer.apple.com/documentation/uikit/uisplitviewcontroller/splitbehavior-swift.enum|UISplitViewController.SplitBehavior}
   *
   * @default automatic
   */
  preferredSplitBehavior?: SplitViewSplitBehavior;
  /**
   * @summary Specifies the background style of the primary view controller.
   *
   * On iOS 18 or lower, we always fall back to `none` which is a system default value. Since iOS 26 the system default value is `sidebar`.
   *
   * The following values are currently supported:
   *
   * - `default` - chosen by the OS, the appropriate background style is based on the device preferences
   * - `none` - a style that has no visual effect on the background appearance of the primary view controller
   * - `sidebar` - a style that applies a blurred effect to the background of the primary view controller
   *
   * The supported values correspond to the official UIKit documentation:
   * @see {@link https://developer.apple.com/documentation/uikit/uisplitviewcontroller/backgroundstyle|UISplitViewController.BackgroundStyle}
   *
   * @default default
   *
   * @supported iOS 26 or higher
   *
   * @remarks
   * According to the documentation, this property shouldn't have any effect on iOS. However, on iOS 26 the support for this prop was added.
   */
  primaryBackgroundStyle?: SplitViewPrimaryBackgroundStyle;
  /**
   * @summary Indicates on which side primary sidebar is placed, affecting the split view layout.
   *
   * The following values are currently supported:
   *
   * - `leading` - primary sidebar is placed on the leading edge of the interface
   * - `trailing` - primary sidebar is placed on the trailing edge of the interface
   *
   * The supported values corresponds to the official UIKit documentation:
   * @see {@link https://developer.apple.com/documentation/uikit/uisplitviewcontroller/primaryedge-swift.enum|UISplitViewController.PrimaryEdge}
   *
   * @default leading
   */
  primaryEdge?: SplitViewPrimaryEdge;
  /**
   * @summary Determines whether inspector column should be displayed.
   *
   * Inspector will be displayed on the trailing edge of the main (secondary) column (for expanded SplitView) or as a modal (for collapsed SplitView).
   * The result on the interface for this prop depends on whether the SplitView is collapsed or expanded.
   *
   * @supported iOS 26 or higher
   */
  showInspector?: boolean;
  /**
   * @summary Determines whether a button to toggle to and from secondaryOnly display mode is visible.
   */
  showSecondaryToggleButton?: boolean;
}
