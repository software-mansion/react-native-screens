import SplitHost from './SplitHost';
import SplitScreen from './SplitScreen';

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
  SplitScreenColumnType,
  SplitScreenProps,
} from './SplitScreen.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export const Split = {
  Host: SplitHost,
  Column: SplitScreen.Column,
  Inspector: SplitScreen.Inspector,
};
