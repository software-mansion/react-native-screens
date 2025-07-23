'use client';

import type { ViewProps } from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type {
  DirectEventHandler,
  Float,
  Int32,
  WithDefault,
} from 'react-native/Libraries/Types/CodegenTypes';

// eslint-disable-next-line @typescript-eslint/ban-types
type GenericEmptyEvent = Readonly<{}>;

type DisplayModeWillChangeEvent = {
  currentDisplayMode: string;
  nextDisplayMode: string;
};

type SplitViewDisplayModeButtonVisibility = 'always' | 'automatic' | 'never';

type SplitViewSplitBehavior = 'automatic' | 'displace' | 'overlay' | 'tile';

type SplitViewPrimaryEdge = 'leading' | 'trailing';

type SplitViewDisplayMode =
  | 'automatic'
  | 'secondaryOnly'
  | 'oneBesideSecondary'
  | 'oneOverSecondary'
  | 'twoBesideSecondary'
  | 'twoOverSecondary'
  | 'twoDisplaceSecondary';

interface ColumnMetrics {
  minimumPrimaryColumnWidth?: WithDefault<Int32, -1>;
  maximumPrimaryColumnWidth?: WithDefault<Int32, -1>;
  preferredPrimaryColumnWidthOrFraction?: WithDefault<Float, -1.0>;
  minimumSupplementaryColumnWidth?: WithDefault<Int32, -1>;
  maximumSupplementaryColumnWidth?: WithDefault<Int32, -1>;
  preferredSupplementaryColumnWidthOrFraction?: WithDefault<Float, -1.0>;

  // iOS 26 only
  minimumSecondaryColumnWidth?: WithDefault<Int32, -1>;
  preferredSecondaryColumnWidthOrFraction?: WithDefault<Float, -1.0>;
  minimumInspectorColumnWidth?: WithDefault<Int32, -1>;
  maximumInspectorColumnWidth?: WithDefault<Int32, -1>;
  preferredInspectorColumnWidthOrFraction?: WithDefault<Float, -1.0>;
}

interface NativeProps extends ViewProps {
  // Appearance

  preferredDisplayMode?: WithDefault<SplitViewDisplayMode, 'automatic'>;
  preferredSplitBehavior?: WithDefault<SplitViewSplitBehavior, 'automatic'>;
  primaryEdge?: WithDefault<SplitViewPrimaryEdge, 'leading'>;
  showSecondaryToggleButton?: WithDefault<boolean, false>;
  displayModeButtonVisibility?: WithDefault<
    SplitViewDisplayModeButtonVisibility,
    'automatic'
  >;
  columnMetrics?: ColumnMetrics;

  // Interactions

  presentsWithGesture?: WithDefault<boolean, true>;
  showInspector?: WithDefault<boolean, false>;

  // Custom events

  onCollapse?: DirectEventHandler<GenericEmptyEvent>;
  onDisplayModeWillChange?: DirectEventHandler<DisplayModeWillChangeEvent>;
  onExpand?: DirectEventHandler<GenericEmptyEvent>;
  onInspectorHide?: DirectEventHandler<GenericEmptyEvent>;
}

export default codegenNativeComponent<NativeProps>('RNSSplitViewHost', {});
