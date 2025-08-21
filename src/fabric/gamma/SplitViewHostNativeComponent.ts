'use client';

import type { ViewProps } from 'react-native';
// eslint-disable-next-line @react-native/no-deep-imports
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type {
  DirectEventHandler,
  Float,
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

type SplitViewOrientation =
  | 'inherit'
  | 'all'
  | 'allButUpsideDown'
  | 'portrait'
  | 'portraitUp'
  | 'portraitDown'
  | 'landscape'
  | 'landscapeLeft'
  | 'landscapeRight';

interface ColumnMetrics {
  minimumPrimaryColumnWidth?: WithDefault<Float, -1.0>;
  maximumPrimaryColumnWidth?: WithDefault<Float, -1.0>;
  preferredPrimaryColumnWidthOrFraction?: WithDefault<Float, -1.0>;
  minimumSupplementaryColumnWidth?: WithDefault<Float, -1.0>;
  maximumSupplementaryColumnWidth?: WithDefault<Float, -1.0>;
  preferredSupplementaryColumnWidthOrFraction?: WithDefault<Float, -1.0>;

  // iOS 26 only
  minimumSecondaryColumnWidth?: WithDefault<Float, -1.0>;
  preferredSecondaryColumnWidthOrFraction?: WithDefault<Float, -1.0>;
  minimumInspectorColumnWidth?: WithDefault<Float, -1.0>;
  maximumInspectorColumnWidth?: WithDefault<Float, -1.0>;
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
  orientation?: WithDefault<SplitViewOrientation, 'inherit'>;

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
