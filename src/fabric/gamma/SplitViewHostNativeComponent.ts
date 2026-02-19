'use client';

import type {
  CodegenTypes as CT,
  ViewProps,
  HostComponent,
} from 'react-native';
import { codegenNativeCommands, codegenNativeComponent } from 'react-native';

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

type SplitViewPrimaryBackgroundStyle = 'default' | 'none' | 'sidebar';

type SplitViewTopColumnForCollapsing =
  | 'default'
  | 'primary'
  | 'supplementary'
  | 'secondary';

interface ColumnMetrics {
  minimumPrimaryColumnWidth?: CT.WithDefault<CT.Float, -1.0>;
  maximumPrimaryColumnWidth?: CT.WithDefault<CT.Float, -1.0>;
  preferredPrimaryColumnWidthOrFraction?: CT.WithDefault<CT.Float, -1.0>;
  minimumSupplementaryColumnWidth?: CT.WithDefault<CT.Float, -1.0>;
  maximumSupplementaryColumnWidth?: CT.WithDefault<CT.Float, -1.0>;
  preferredSupplementaryColumnWidthOrFraction?: CT.WithDefault<CT.Float, -1.0>;

  // iOS 26 only
  minimumSecondaryColumnWidth?: CT.WithDefault<CT.Float, -1.0>;
  preferredSecondaryColumnWidthOrFraction?: CT.WithDefault<CT.Float, -1.0>;
  minimumInspectorColumnWidth?: CT.WithDefault<CT.Float, -1.0>;
  maximumInspectorColumnWidth?: CT.WithDefault<CT.Float, -1.0>;
  preferredInspectorColumnWidthOrFraction?: CT.WithDefault<CT.Float, -1.0>;
}

interface NativeProps extends ViewProps {
  // Appearance

  preferredDisplayMode?: CT.WithDefault<SplitViewDisplayMode, 'automatic'>;
  preferredSplitBehavior?: CT.WithDefault<SplitViewSplitBehavior, 'automatic'>;
  primaryEdge?: CT.WithDefault<SplitViewPrimaryEdge, 'leading'>;
  showSecondaryToggleButton?: CT.WithDefault<boolean, false>;
  displayModeButtonVisibility?: CT.WithDefault<
    SplitViewDisplayModeButtonVisibility,
    'automatic'
  >;
  columnMetrics?: ColumnMetrics;
  orientation?: CT.WithDefault<SplitViewOrientation, 'inherit'>;
  primaryBackgroundStyle?: CT.WithDefault<
    SplitViewPrimaryBackgroundStyle,
    'default'
  >;

  // Behavior

  topColumnForCollapsing?: CT.WithDefault<
    SplitViewTopColumnForCollapsing,
    'default'
  >;

  // Interactions

  presentsWithGesture?: CT.WithDefault<boolean, true>;
  showInspector?: CT.WithDefault<boolean, false>;

  // Custom events

  onCollapse?: CT.DirectEventHandler<GenericEmptyEvent>;
  onDisplayModeWillChange?: CT.DirectEventHandler<DisplayModeWillChangeEvent>;
  onExpand?: CT.DirectEventHandler<GenericEmptyEvent>;
  onInspectorHide?: CT.DirectEventHandler<GenericEmptyEvent>;
}

type ComponentType = HostComponent<NativeProps>;

interface NativeCommands {
  showColumn: (
    viewRef: React.ElementRef<ComponentType>,
    column: string,
  ) => void;
}

export const Commands: NativeCommands = codegenNativeCommands<NativeCommands>({
  supportedCommands: ['showColumn'],
});

export default codegenNativeComponent<NativeProps>('RNSSplitViewHost', {});
