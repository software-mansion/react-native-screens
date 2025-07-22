import type { NativeSyntheticEvent, ViewProps } from 'react-native';

// eslint-disable-next-line @typescript-eslint/ban-types
export type GenericEmptyEvent = Readonly<{}>;

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

export type SplitViewDisplayMode =
  | 'automatic'
  | 'secondaryOnly'
  | 'oneBesideSecondary'
  | 'oneOverSecondary'
  | 'twoBesideSecondary'
  | 'twoOverSecondary'
  | 'twoDisplaceSecondary';

export interface SplitViewColumnMetrics {
  /**
   * Specifies the minimum width for the primary column in the SplitView layout, typically representing the leftmost sidebar.
   *
   * @platform ios
   */
  minimumPrimaryColumnWidth?: number;
  /**
   * Specifies the maximum width for the primary column in the SplitView layout, typically representing the leftmost sidebar.
   *
   * @platform ios
   */
  maximumPrimaryColumnWidth?: number;
  /**
   * Specifies the preferred width for the primary column in the SplitView layout, typically representing the leftmost sidebar.
   *
   * @platform ios
   */
  preferredPrimaryColumnWidth?: number;
  /**
   * Specifies the minimum width for the supplementary column in the SplitView layout, typically representing the intermediate sidebar.
   *
   * @platform ios
   */
  minimumSupplementaryColumnWidth?: number;
  /**
   * Specifies the maximum width for the supplementary column in the SplitView layout, typically representing the intermediate sidebar.
   *
   * @platform ios
   */
  maximumSupplementaryColumnWidth?: number;
  /**
   * Specifies the preferred width for the supplementary column in the SplitView layout, typically representing the intermediate sidebar.
   *
   * @platform ios
   */
  preferredSupplementaryColumnWidth?: number;

  // iOS 26 only
  /**
   * Specifies the minimum width for the secondary column in the SplitView layout, typically for the view with the main content.
   *
   * @platform ios
   * @supported iOS 26 or higher
   */
  minimumSecondaryColumnWidth?: number;
  /**
   * Specifies the preferred width for the secondary column in the SplitView layout, typically for the view with the main content.
   *
   * @platform ios
   * @supported iOS 26 or higher
   */
  preferredSecondaryColumnWidth?: number;
  /**
   * Specifies the minimum width for the inspector column in the SplitView layout, typically the view which is providing additional data about the secondary column.
   *
   * @platform ios
   * @supported iOS 26 or higher
   */
  minimumInspectorColumnWidth?: number;
  /**
   * Specifies the maximum width for the inspector column in the SplitView layout, typically the view which is providing additional data about the secondary column.
   *
   * @platform ios
   * @supported iOS 26 or higher
   */
  maximumInspectorColumnWidth?: number;
  /**
   * Specifies the preferred width for the inspector column in the SplitView layout, typically the view which is providing additional data about the secondary column.
   *
   * @platform ios
   * @supported iOS 26 or higher
   */
  preferredInspectorColumnWidth?: number;
}
export interface SplitViewHostProps extends ViewProps {
  children?: React.ReactNode;

  /**
   * An object describing bounds for column widths.
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
   *
   * @platform ios
   */
  columnMetrics?: SplitViewColumnMetrics;
  /**
   * Specifies the display mode which will be preferred to use, if the layout requirements are met.
   * The following values are currently supported (they correspond to [UISplitViewController.DisplayMode](https://developer.apple.com/documentation/uikit/uisplitviewcontroller/displaymode-swift.enum)):
   *
   * - `automatic` - display mode is chosen by the OS, the appropriate display mode is based on the device and the current app size
   * - `secondaryOnly` – only the secondary column is displayed
   * - `oneBesideSecondary` – a sidebar is displayed side-by-side with the secondary column
   * - `twoBesideSecondary` – two sidebars are displayed side-by-side with the secondary column
   * - `oneOverSecondary` – a one sidebar is displayed over the secondary column
   * - `twoOverSecondary` – two sidebars are displayed over the secondary column
   * - `twoDisplaceSecondary` – two sidebars are displacind the secondary column, moving it partially offscreen
   *
   * @platform ios
   */
  displayMode?: SplitViewDisplayMode;
  /**
   * Determines whether the button for changing the SplitView display mode is visible on the screen.
   * The following values are currently supported (they correspond to [UISplitViewController.DisplayModeButtonVisibility](https://developer.apple.com/documentation/uikit/uisplitviewcontroller/displaymodebuttonvisibility-swift.enum)):
   *
   * - `automatic` - the visibility of the display mode button is set by system
   * - `always` – the display mode button is always visible
   * - `never` – the display mode button is always hidden
   *
   * @platform ios
   */
  displayModeButtonVisibility?: SplitViewDisplayModeButtonVisibility;
  /**
   * A callback that gets invoked when the SplitView was collapsed to a single column.
   *
   * @platform ios
   */
  onCollapse?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
  /**
   * A callback that gets invoked when the SplitView was expanded to multiple columns.
   *
   * @platform ios
   */
  onExpand?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
  /**
   * A callback that gets invoked when the SplitView inspector is either programmatically hidden (in column presentation) or dismissed (in modal presentation).
   *
   * @remarks
   * The purpose of this callback depends on whether the SplitView is collapsed or expanded.
   *
   * @platform ios
   * @supported iOS 26 or higher
   */
  onInspectorHide?: (e: NativeSyntheticEvent<GenericEmptyEvent>) => void;
  /**
   * Determines whether gestures are enabled to change the display mode.
   *
   * @platform ios
   */
  presentsWithGesture?: boolean;
  /**
   * Indicates on which side primary sidebar is placed, affecting the split view layout.
   * The following values are currently supported (they correspond to [UISplitViewController.PrimaryEdge](https://developer.apple.com/documentation/uikit/uisplitviewcontroller/primaryedge-swift.enum)):
   *
   * - `leading` - primary sidebar is placed on the leading edge of the interface
   * - `trailing` - primary sidebar is placed on the trailing edge of the interface
   *
   * @platform ios
   */
  primaryEdge?: SplitViewPrimaryEdge;
  /**
   * Determines whether inspector column should be displayed on the trailing edge of the main (secondary) column (for expanded SplitView) or as a modal (for collapsed SplitView).
   *
   * @remarks
   * The result on the interface for this prop depends on whether the SplitView is collapsed or expanded.
   *
   * @platform ios
   * @supported iOS 26 or higher
   */
  showInspector?: boolean;
  /**
   * Determines whether a button to toggle to and from secondaryOnly display mode is visible.
   *
   * @platform ios
   */
  showSecondaryToggleButton?: boolean;
  /**
   * Specifies the split behavior which will be preferred to use, if the layout requirements are met.
   * The following values are currently supported (they correspond to [UISplitViewController.SplitBehavior](https://developer.apple.com/documentation/uikit/uisplitviewcontroller/splitbehavior-swift.enum)):
   *
   * - `automatic` - chosen by the OS, the appropriate split behavior is based on the device and the current app size
   * - `displace` – the main column is moved partially offscreen, making a space for sidebars
   * - `overlay` – the sidebars are partially covering main column
   * - `tile` – the sidebars appears side-by-side with the main column
   *
   * @platform ios
   */
  splitBehavior?: SplitViewSplitBehavior;
}
