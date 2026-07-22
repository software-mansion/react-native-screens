#import "UIView+RNSUtility.h"

#import <React/RCTSurfaceTouchHandler.h>
#import <React/RCTSurfaceView.h>
#import "RNSModalScreen.h"

@implementation UIView (RNSUtility)

- (nullable RCTSurfaceTouchHandler *)rnscreens_findTouchHandlerInAncestorChain
{
  UIView *parent = self.superview;

  // On Fabric there is no view that exposes touchHandler above us in the view hierarchy, however it is still
  // utilised. `RCTSurfaceView` should be present above us, which hosts `RCTFabricSurface` instance, which in turn
  // hosts `RCTSurfaceTouchHandler` as a private field. When initialised, `RCTSurfaceTouchHandler` is attached to the
  // surface view as a gestureRecognizer <- and this is where we can lay our hands on it.

  // On Fabric, every screen not mounted under react root view has it's own surface touch handler attached
  // (done when the screen is moved to window).
  while (parent != nil && ![parent isKindOfClass:RCTSurfaceView.class] &&
         ![parent isKindOfClass:RNSModalScreen.class]) {
    parent = parent.superview;
  }

  // This could be possible in modal context
  if (parent == nil) {
    return nil;
  }

  // Experimentation shows that RCTSurfaceTouchHandler is the only gestureRecognizer registered here,
  // so we should not be afraid of any performance hit here.
  for (UIGestureRecognizer *recognizer in parent.gestureRecognizers) {
    if ([recognizer isKindOfClass:RCTSurfaceTouchHandler.class]) {
      return static_cast<RCTSurfaceTouchHandler *>(recognizer);
    }
  }

  return nil;
}

@end
