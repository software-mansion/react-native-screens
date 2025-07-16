'use client';

import type { ViewProps } from 'react-native';
import codegenNativeComponent from 'react-native/Libraries/Utilities/codegenNativeComponent';
import type { WithDefault } from 'react-native/Libraries/Types/CodegenTypes';

export type SplitViewSplitBehavior =
  | 'automatic'
  | 'displace'
  | 'overlay'
  | 'tile';

export type SplitViewPrimaryEdge = 'leading' | 'trailing';

export type SplitViewDisplayMode =
  | 'automatic'
  | 'secondaryOnly'
  | 'oneBesideSecondary'
  | 'oneOverSecondary'
  | 'twoBesideSecondary'
  | 'twoOverSecondary'
  | 'twoDisplaceSecondary';

export interface NativeProps extends ViewProps {
  // Appearance

  displayMode?: WithDefault<SplitViewDisplayMode, 'automatic'>;
  splitBehavior?: WithDefault<SplitViewSplitBehavior, 'automatic'>;
  primaryEdge?: WithDefault<SplitViewPrimaryEdge, 'leading'>;

  // NOTE: this setter cannot change the value dynamically, even in pure native app
  showSecondaryToggleButton?: WithDefault<boolean, false>;

  // Interactions

  presentsWithGesture?: WithDefault<boolean, true>;
}

export default codegenNativeComponent<NativeProps>('RNSSplitViewHost', {});
