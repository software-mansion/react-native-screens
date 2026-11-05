import SplitHost from './SplitHost';
import SplitScreen from './SplitScreen';

export type {
  DisplayModeWillChangeEvent, // TODO: This event should be renamed to match the convention
  SplitDisplayModeButtonVisibility,
  SplitBehavior,
  SplitPrimaryEdge,
  SplitPrimaryBackgroundStyle,
  SplitDisplayMode,
  SplitOrientation,
  SplitColorScheme,
  SplitColumnMetrics,
  SplitNavigableColumn,
  SplitHostCommands,
  SplitHostProps,
} from './SplitHost.types';

export type {
  SplitScreenColumnType,
  SplitScreenProps,
} from './SplitScreen.types';

export const Split = {
  /**
   * @platform ios
   * @experimental
   */
  Host: SplitHost,
  /**
   * @platform ios
   * @experimental
   */
  Column: SplitScreen.Column,
  /**
   * @platform ios >= 26
   * @experimental
   */
  Inspector: SplitScreen.Inspector,
};
