import React from 'react';
import { StyleSheet } from 'react-native';
import SplitHostNativeComponent, {
  Commands as SplitHostNativeCommands,
} from '../../../fabric/gamma/split/SplitHostNativeComponent';
import type { SplitHostProps } from './SplitHost.types';
import SplitNavigator from './SplitNavigator';
import type { SplitNavigatorProps } from './SplitNavigator.types';

type NativeRef = React.ComponentRef<typeof SplitHostNativeComponent>;

// Compatibility map for displayMode / splitBehavior validation (same as SplitHost)
const displayModeForSplitCompatibilityMap: Record<
  NonNullable<SplitHostProps['preferredSplitBehavior']>,
  NonNullable<SplitHostProps['preferredDisplayMode']>[]
> = {
  tile: ['secondaryOnly', 'oneBesideSecondary', 'twoBesideSecondary'],
  overlay: ['secondaryOnly', 'oneOverSecondary', 'twoOverSecondary'],
  displace: ['secondaryOnly', 'oneBesideSecondary', 'twoDisplaceSecondary'],
  automatic: [],
};

const isValidDisplayModeForSplitBehavior = (
  displayMode: NonNullable<SplitHostProps['preferredDisplayMode']>,
  splitBehavior: NonNullable<SplitHostProps['preferredSplitBehavior']>,
): boolean => {
  if (splitBehavior === 'automatic') {
    return true;
  }
  return displayModeForSplitCompatibilityMap[splitBehavior].includes(
    displayMode,
  );
};

type ColumnProps = Omit<SplitNavigatorProps, 'columnType'>;

function Primary(props: ColumnProps) {
  return <SplitNavigator columnType="primary" {...props} />;
}

function Secondary(props: ColumnProps) {
  return <SplitNavigator columnType="secondary" {...props} />;
}

function Supplementary(props: ColumnProps) {
  return <SplitNavigator columnType="supplementary" {...props} />;
}

function Inspector(props: ColumnProps) {
  return <SplitNavigator columnType="inspector" {...props} />;
}

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 *
 * Root compound component for SplitView layouts. Use the sub-components to
 * declare columns and the inspector:
 *
 * ```tsx
 * <SplitView preferredSplitBehavior="automatic">
 *   <SplitView.Primary>
 *     <SplitScreen screenKey="menu" activityMode="attached">...</SplitScreen>
 *   </SplitView.Primary>
 *   <SplitView.Secondary>
 *     <SplitScreen screenKey="detail" activityMode="attached">...</SplitScreen>
 *   </SplitView.Secondary>
 * </SplitView>
 * ```
 */
function SplitView({ ref, ...props }: SplitHostProps) {
  const { preferredDisplayMode, preferredSplitBehavior } = props;
  const nativeRef = React.useRef<NativeRef>(null);

  React.useImperativeHandle(
    ref,
    () => ({
      show: column => {
        if (nativeRef.current) {
          SplitHostNativeCommands.showColumn(nativeRef.current, column);
        } else {
          console.warn(
            '[RNScreens] Reference to native SplitHost component has not been updated yet',
          );
        }
      },
    }),
    [],
  );

  React.useEffect(() => {
    if (preferredDisplayMode && preferredSplitBehavior) {
      const isValid = isValidDisplayModeForSplitBehavior(
        preferredDisplayMode,
        preferredSplitBehavior,
      );
      if (!isValid) {
        const validDisplayModes =
          displayModeForSplitCompatibilityMap[preferredSplitBehavior];
        console.warn(
          `Invalid display mode "${preferredDisplayMode}" for split behavior "${preferredSplitBehavior}".` +
            `\nValid modes for "${preferredSplitBehavior}" are: ${validDisplayModes.join(', ')}.`,
        );
      }
    }
  }, [preferredDisplayMode, preferredSplitBehavior]);

  const children = React.Children.toArray(props.children);

  // Count columns and inspectors to determine the key for re-mounting when column count changes
  const columns = children.filter(child => {
    if (!React.isValidElement(child)) return false;
    const type = child.type;
    return type === Primary || type === Secondary || type === Supplementary;
  });

  const inspectors = children.filter(child => {
    if (!React.isValidElement(child)) return false;
    return child.type === Inspector;
  });

  return (
    <SplitHostNativeComponent
      ref={nativeRef}
      // Force remount when column count changes (UISplitViewController cannot change column count dynamically)
      key={`columns-${columns.length}-inspectors-${inspectors.length}`}
      {...props}
      style={styles.container}>
      {props.children}
    </SplitHostNativeComponent>
  );
}

SplitView.Primary = Primary;
SplitView.Secondary = Secondary;
SplitView.Supplementary = Supplementary;
SplitView.Inspector = Inspector;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SplitView;
