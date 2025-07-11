import React from 'react';
import { StyleSheet } from 'react-native';
import type { ViewProps } from 'react-native';
import SplitViewHostNativeComponent from '../../fabric/gamma/SplitViewHostNativeComponent';
import type {
  NativeProps,
  SplitViewDisplayMode,
  SplitViewSplitBehavior,
} from '../../fabric/gamma/SplitViewHostNativeComponent';

export type SplitViewNativeProps = NativeProps & {
  // SplitView appearance

  displayMode?: SplitViewDisplayMode;
  splitBehavior?: SplitViewSplitBehavior;
};

type SplitViewHostProps = {
  children?: ViewProps['children'];
} & SplitViewNativeProps;

const displayModeForSplitViewCompatibilityMap: Record<
  SplitViewSplitBehavior,
  SplitViewDisplayMode[]
> = {
  tile: ['secondaryOnly', 'oneBesideSecondary', 'twoBesideSecondary'],
  overlay: ['secondaryOnly', 'oneOverSecondary', 'twoOverSecondary'],
  displace: ['secondaryOnly', 'oneBesideSecondary', 'twoDisplaceSecondary'],
  automatic: [], // placeholder for satisfying types; we'll handle it specially in logic
};

const isValidDisplayModeForSplitBehavior = (
  displayMode: SplitViewDisplayMode,
  splitBehavior: SplitViewSplitBehavior,
) => {
  if (splitBehavior === 'automatic') {
    // for automatic we cannot easily verify the compatibility, because it depends on the system preference for display mode, therefore we're assuming that 'automatic' has only valid combinations
    return true;
  }
  return displayModeForSplitViewCompatibilityMap[splitBehavior].includes(
    displayMode,
  );
};

function SplitViewHost({
  children,
  displayMode,
  primaryEdge,
  splitBehavior,
}: SplitViewHostProps) {
  React.useEffect(() => {
    if (displayMode && splitBehavior) {
      const isValid = isValidDisplayModeForSplitBehavior(
        displayMode,
        splitBehavior,
      );
      if (!isValid) {
        const validDisplayModes =
          displayModeForSplitViewCompatibilityMap[splitBehavior];
        console.warn(
          `Invalid display mode "${displayMode}" for split behavior "${splitBehavior}".` +
            `\nValid modes for "${splitBehavior}" are: ${validDisplayModes.join(
              ', ',
            )}.`,
        );
      }
    }
  }, [displayMode, splitBehavior]);

  return (
    <SplitViewHostNativeComponent
      displayMode={displayMode}
      style={styles.container}
      splitBehavior={splitBehavior}
      primaryEdge={primaryEdge}>
      {children}
    </SplitViewHostNativeComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SplitViewHost;
