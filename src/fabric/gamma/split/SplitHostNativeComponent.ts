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
  minimumPrimaryColumnWidth?: CT.WithDefault<CT.Float, -1.0> | undefined;
  maximumPrimaryColumnWidth?: CT.WithDefault<CT.Float, -1.0> | undefined;
  preferredPrimaryColumnWidthOrFraction?:
    | CT.WithDefault<CT.Float, -1.0>
    | undefined;
  minimumSupplementaryColumnWidth?: CT.WithDefault<CT.Float, -1.0> | undefined;
  maximumSupplementaryColumnWidth?: CT.WithDefault<CT.Float, -1.0> | undefined;
  preferredSupplementaryColumnWidthOrFraction?:
    | CT.WithDefault<CT.Float, -1.0>
    | undefined;

  // iOS 26 only
  minimumSecondaryColumnWidth?: CT.WithDefault<CT.Float, -1.0> | undefined;
  preferredSecondaryColumnWidthOrFraction?:
    | CT.WithDefault<CT.Float, -1.0>
    | undefined;
  minimumInspectorColumnWidth?: CT.WithDefault<CT.Float, -1.0> | undefined;
  maximumInspectorColumnWidth?: CT.WithDefault<CT.Float, -1.0> | undefined;
  preferredInspectorColumnWidthOrFraction?:
    | CT.WithDefault<CT.Float, -1.0>
    | undefined;
}

interface NativeProps extends ViewProps {
  // Appearance

  preferredDisplayMode?:
    | CT.WithDefault<SplitViewDisplayMode, 'automatic'>
    | undefined;
  preferredSplitBehavior?:
    | CT.WithDefault<SplitViewSplitBehavior, 'automatic'>
    | undefined;
  primaryEdge?: CT.WithDefault<SplitViewPrimaryEdge, 'leading'> | undefined;
  showSecondaryToggleButton?: CT.WithDefault<boolean, false> | undefined;
  displayModeButtonVisibility?:
    | CT.WithDefault<SplitViewDisplayModeButtonVisibility, 'automatic'>
    | undefined;
  columnMetrics?: ColumnMetrics | undefined;
  orientation?: CT.WithDefault<SplitViewOrientation, 'inherit'> | undefined;
  primaryBackgroundStyle?:
    | CT.WithDefault<SplitViewPrimaryBackgroundStyle, 'default'>
    | undefined;

  // Behavior

  topColumnForCollapsing?:
    | CT.WithDefault<SplitViewTopColumnForCollapsing, 'default'>
    | undefined;

  // Interactions

  presentsWithGesture?: CT.WithDefault<boolean, true> | undefined;
  showInspector?: CT.WithDefault<boolean, false> | undefined;

  // Custom events

  onCollapse?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onDisplayModeWillChange?:
    | CT.DirectEventHandler<DisplayModeWillChangeEvent>
    | undefined;
  onExpand?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
  onInspectorHide?: CT.DirectEventHandler<GenericEmptyEvent> | undefined;
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

export default codegenNativeComponent<NativeProps>('RNSSplitHost', {});
