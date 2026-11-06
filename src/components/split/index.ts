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
  SplitColumnProps,
  SplitInspectorProps,
} from './SplitScreen.types';

/**
 * Native split view that shows its content in side-by-side columns.
 *
 * @namespace
 */
export const Split = {
  /**
   * Container that lays out its children as the columns of a native split
   * view.
   *
   * @remarks
   * It takes two or three {@link Split.Column} children, in the order of the
   * columns: the primary and the secondary column, or the primary, the
   * supplementary and the secondary column. It also takes at most one
   * {@link Split.Inspector}.
   *
   * @note
   * This is an implementation detail and may change. Changing the number of
   * columns or inspectors recreates the Split.
   *
   * @platform ios
   * @experimental
   */
  Host: SplitHost,
  /**
   * A column of {@link Split.Host}.
   *
   * @platform ios
   * @experimental
   */
  Column: SplitScreen.Column,
  /**
   * The inspector column of {@link Split.Host}, which shows additional data
   * about the secondary column.
   *
   * @remarks
   * It is shown and hidden with
   * {@link SplitHostProps.showInspector | showInspector}.
   *
   * @platform ios >= 26
   * @experimental
   */
  Inspector: SplitScreen.Inspector,
};
