#pragma once

#import "RNSReactBaseView.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Backing native view for the `ScrollEdgeElement` component. On iOS 26+ it attaches a
 * `UIScrollEdgeElementContainerInteraction` to itself and links it to the scroll view of the nearest
 * `ScrollViewMarker` in the same view controller's view, so that scroll view draws its edge effect
 * under the wrapped views. On older versions it is a plain view.
 */
@interface RNSScrollEdgeElementComponentView : RNSReactBaseView

@end

NS_ASSUME_NONNULL_END
