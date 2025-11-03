import React from 'react';
import { StyleSheet } from 'react-native';
import SplitViewHostNativeComponent from '../../../fabric/gamma/SplitViewHostNativeComponent';
import type {
  SplitViewDisplayMode,
  SplitViewHostProps,
  SplitViewSplitBehavior,
} from './SplitViewHost.types';
import SplitViewScreen from './SplitViewScreen';

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
  const { preferredDisplayMode, preferredSplitBehavior } = props;

  React.useEffect(() => {
    if (preferredDisplayMode && preferredSplitBehavior) {
      const isValid = isValidDisplayModeForSplitBehavior(
        preferredDisplayMode,
        preferredSplitBehavior,
      );
      if (!isValid) {
        const validDisplayModes =
          displayModeForSplitViewCompatibilityMap[preferredSplitBehavior];
        console.warn(
          `Invalid display mode "${preferredDisplayMode}" for split behavior "${preferredSplitBehavior}".` +
            `\nValid modes for "${preferredSplitBehavior}" are: ${validDisplayModes.join(
              ', ',
            )}.`,
        );
      }
    }
  }, [preferredDisplayMode, preferredSplitBehavior]);

  const children = React.Children.toArray(props.children);

  const columns = children.filter(
    // @ts-ignore - type is valid attribute for child
    child => child.type === SplitViewScreen.Column,
  );

  const inspectors = children.filter(
    // @ts-ignore - type is valid attribute for child
    child => child.type === SplitViewScreen.Inspector,
  );

  return (
    <SplitViewHostNativeComponent
      // UISplitViewController requires the number of columns to be specified at initialization and it cannot be changed dynamically later.
      // By using a specific key in this form, we can detect changes in the number of React children.
      // This enables us to fully recreate the SplitView when necessary, ensuring the correct column configuration is always applied.
      key={`columns-${columns.length}-inspectors-${inspectors.length}`}
      {...props}
      style={styles.container}>
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
