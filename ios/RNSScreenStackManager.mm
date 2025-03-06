#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTFabricSurface.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/RCTSurfaceTouchHandler.h>
#import <React/RCTSurfaceView.h>
#import <React/UIView+React.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import "RCTSurfaceTouchHandler+RNSUtility.h"
#else
#import <React/RCTBridge.h>
#import <React/RCTRootContentView.h>
#import <React/RCTShadowView.h>
#import <React/RCTTouchHandler.h>
#import <React/RCTUIManager.h>
#import <React/RCTUIManagerUtils.h>
#import "RCTTouchHandler+RNSUtility.h"
#endif // RCT_NEW_ARCH_ENABLED

#import "RNSDefines.h"
#import "RNSPercentDrivenInteractiveTransition.h"
#import "RNSScreen.h"
#import "RNSScreenStackAnimator.h"
#import "RNSScreenStackHeaderConfig.h"
#import "RNSScreenStackManager.h"
#import "RNSScreenStackView.h"
#import "RNSScreenWindowTraits.h"
#import "utils/UINavigationBar+RNSUtility.h"

#import "UIView+RNSUtility.h"

#ifdef RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSScreenStackManager {
  NSPointerArray *_stacks;
}

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(onFinishTransitioning, RCTDirectEventBlock);

#ifdef RCT_NEW_ARCH_ENABLED
#else
- (UIView *)view
{
  RNSScreenStackView *view = [[RNSScreenStackView alloc] initWithManager:self];
  if (!_stacks) {
    _stacks = [NSPointerArray weakObjectsPointerArray];
  }
  [_stacks addPointer:(__bridge void *)view];
  return view;
}
#endif // RCT_NEW_ARCH_ENABLED

- (void)invalidate
{
  for (RNSScreenStackView *stack in _stacks) {
    [stack dismissOnReload];
  }
  _stacks = nil;
}

@end
