import SplitHost from './SplitHost';
import SplitNavigator from './SplitNavigator';
import SplitScreen from './SplitScreen';
import SplitView from './SplitView';

export type {
  DisplayModeWillChangeEvent, // TODO: This event should be renamed to match the convention
  SplitDisplayModeButtonVisibility,
  SplitBehavior,
  SplitPrimaryEdge,
  SplitPrimaryBackgroundStyle,
  SplitDisplayMode,
  SplitHostOrientation,
  SplitColumnMetrics,
  SplitNavigableColumn,
  SplitHostCommands,
  SplitHostProps,
} from './SplitHost.types';

export type {
  SplitNavigatorColumnType,
  SplitNavigatorProps,
} from './SplitNavigator.types';

export type {
  SplitScreenActivityMode,
  SplitScreenProps,
  OnDismissEvent,
  OnDismissEventPayload,
} from './SplitScreen.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 *
 * Lower-level API: SplitHost + SplitNavigator + SplitScreen.
 * For most use cases, prefer the compound SplitView component.
 */
export const Split = {
  Host: SplitHost,
  Navigator: SplitNavigator,
};

export { SplitView, SplitScreen, SplitNavigator };
