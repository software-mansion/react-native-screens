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
  // Overrides
};

type SplitViewHostProps = {
  children?: ViewProps['children'];
} & SplitViewNativeProps;

// According to the UIKit documentation: https://developer.apple.com/documentation/uikit/uisplitviewcontroller/displaymode-swift.enum
// Only specific pairs for displayMode - splitBehavior are valid and others may lead to unexpected results.
// Therefore, we're adding check on the JS side to return a feedback to the client when that pairing isn't valid.
// However, we're not blocking these props to be set on the native side, because it doesn't crash, just the result or transitions may not work as expected.
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

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
function SplitViewHost(props: SplitViewHostProps) {
  const { displayMode, splitBehavior } = props;

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
    <SplitViewHostNativeComponent {...props} style={styles.container}>
      {props.children}
    </SplitViewHostNativeComponent>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SplitViewHost;
