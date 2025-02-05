#import "RNSScreenContentWrapper.h"
#import "RNSScreen.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import "RNSScreenStack.h"

namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSScreenContentWrapper

#ifndef RCT_NEW_ARCH_ENABLED

- (void)reactSetFrame:(CGRect)frame
{
  [super reactSetFrame:frame];
  if (self.delegate != nil) {
    [self.delegate contentWrapper:self receivedReactFrame:frame];
  }
}

#endif // !RCT_NEW_ARCH_ENABLED

- (void)notifyDelegateWithFrame:(CGRect)frame
{
  [self.delegate contentWrapper:self receivedReactFrame:frame];
}

- (void)triggerDelegateUpdate
{
  [self notifyDelegateWithFrame:self.frame];
}

#ifdef RCT_NEW_ARCH_ENABLED

- (void)willMoveToWindow:(UIWindow *)newWindow
{
  if (newWindow == nil) {
    return;
  }
  [self attachToAncestorScreenView];
}

/**
 * Searches for first `RNSScreen` instance that uses `formSheet` presentation and returns it together with accumulated
 * heights of navigation bars discovered along tree path up.
 *
 * TODO: Such travelsal method could be defined as its own algorithm in separate helper methods set.
 */
- (void)attachToAncestorScreenViewStartingFrom:(nonnull RNSScreen *)screenCtrl
{
  UIViewController *controller = screenCtrl;
  float headerHeightErrata = 0.f;

  do {
    if ([controller isKindOfClass:RNSScreen.class]) {
      RNSScreen *currentScreen = static_cast<RNSScreen *>(controller);
      if ([currentScreen.screenView registerContentWrapper:self contentHeightErrata:headerHeightErrata]) {
        break;
      }
    } else if ([controller isKindOfClass:RNSNavigationController.class]) {
      UINavigationBar *navigationBar = static_cast<RNSNavigationController *>(controller).navigationBar;
      headerHeightErrata += navigationBar.frame.size.height * !navigationBar.isHidden;
    }

    controller = controller.parentViewController;
  } while (controller != nil);
}

- (void)attachToAncestorScreenView
{
  if (![self.reactSuperview isKindOfClass:RNSScreenView.class]) {
    RCTLogError(@"Expected reactSuperview to be a RNSScreenView. Found %@", self.reactSuperview);
    return;
  }

  RNSScreen *screen = (RNSScreen *)[self.reactSuperview reactViewController];
  [self attachToAncestorScreenViewStartingFrom:screen];
}

#pragma mark - RCTComponentViewProtocol

- (void)updateLayoutMetrics:(const facebook::react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const facebook::react::LayoutMetrics &)oldLayoutMetrics
{
  [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];
  [self notifyDelegateWithFrame:RCTCGRectFromRect(layoutMetrics.frame)];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScreenContentWrapperComponentDescriptor>();
}

Class<RCTComponentViewProtocol> RNSScreenContentWrapperCls(void)
{
  return RNSScreenContentWrapper.class;
}

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}
#endif // RCT_NEW_ARCH_ENABLED

@end

@implementation RNSScreenContentWrapperManager

RCT_EXPORT_MODULE()

- (UIView *)view
{
  return [RNSScreenContentWrapper new];
}

@end
