import { codegenNativeComponent } from 'react-native';
import type { ViewProps } from 'react-native';

// Test-only component implemented in FabricExample
// (`FabricExample/ios/RNSExampleZoomTransitionView.mm`), not available in
// other example apps.
//
// Rendered inside a stack screen, it makes that screen use UIKit's zoom
// transition (`preferredTransition = .zoom`, iOS 18+), zooming from the view
// whose `testID` is `sourceTestID` on the screen below. react-native-screens
// has no API for it; this is how e.g. expo-router's `Link.AppleZoom` sets it.
// Without `sourceTestID` the screen keeps its default transition.
//
// Its `accessibilityValue` reports the navigation bar's state for e2e tests:
// `hidden`, or the bar's alpha (e.g. `1.00`).

export interface NativeProps extends ViewProps {
  sourceTestID?: string;
}

export default codegenNativeComponent<NativeProps>('RNSExampleZoomTransition');
