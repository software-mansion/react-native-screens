// Implementation adapted from `react-native-safe-area-context`:
// https://github.com/AppAndFlow/react-native-safe-area-context/blob/v5.6.1/src/SafeArea.types.ts
import { ViewProps } from 'react-native';

/**
 * Edge of a view.
 *
 * @remarks
 * The following values are supported:
 * - `'top'`
 * - `'right'`
 * - `'bottom'`
 * - `'left'`
 */
export type Edge = 'top' | 'right' | 'bottom' | 'left';

/**
 * Kind of insets a {@link SafeAreaView} takes into account on Android.
 *
 * @remarks
 * The following values are supported:
 * - `'all'` — both kinds below; for each edge, the larger inset is used.
 * - `'system'` — the insets defined by the system, such as the system bars or
 *   the display cutout.
 * - `'interface'` — the insets of the native containers' own interface.
 */
export type InsetType = 'all' | 'system' | 'interface';

/**
 * How a {@link SafeAreaView} applies the insets.
 *
 * @remarks
 * The following values are supported:
 * - `'padding'` — the insets are added to the view's own padding, so the view
 *   keeps its frame and paints its background under the bars.
 * - `'margin'` — the insets are added to the view's own margin, so the view
 *   is displaced and shrinks instead.
 */
export type SafeAreaViewMode = 'padding' | 'margin';

/**
 * Props for {@link SafeAreaView}.
 *
 * @experimental
 */
export interface SafeAreaViewProps extends ViewProps {
  /**
   * Edges of the view that are inset by the safe area.
   *
   * @remarks
   * For each edge set to `true`, the inset of that edge is added to the
   * view's own padding or margin, see {@link SafeAreaViewProps.mode | mode}.
   * The other edges are not inset.
   *
   * @defaultValue No edge is inset.
   * @platform android, ios
   */
  edges?: Readonly<Partial<Record<Edge, boolean>>> | undefined;
  /**
   * How the insets are applied, as padding or as margin.
   *
   * @defaultValue `'padding'`
   * @platform android, ios
   */
  mode?: SafeAreaViewMode | undefined;
  /**
   * Kind of insets the view takes into account.
   *
   * @defaultValue `'all'`
   * @platform android
   */
  insetType?: InsetType | undefined;
}
