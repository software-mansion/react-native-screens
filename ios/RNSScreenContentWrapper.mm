#import "RNSScreenContentWrapper.h"
#import "RNSScreen.h"
#import "RNSScreenStack.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

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
  RNSScreen *_Nullable screen =
      static_cast<RNSScreen *_Nullable>([[self findFirstScreenViewAncestor] reactViewController]);

  if (screen == nil) {
    // On old architecture, especially when executing `replace` action it can happen that **replaced** (old one) screen
    // receives willMoveToWindow: with not nil argument. On new architecture it seems to work as expected.
#ifdef RCT_NEW_ARCH_ENABLED
    RCTLogWarn(@"Failed to find parent screen controller from %@.", self);
#endif
    return;
  }
  [self attachToAncestorScreenViewStartingFrom:screen];
}

- (nullable RNSScreenView *)findFirstScreenViewAncestor
{
  UIView *currentView = self;

  // In standard scenario this should do only a single iteration.
  // Haven't got repro, but we got reports that there are scenarios
  // when there are intermediate views between screen view & the content wrapper.
  // https://github.com/software-mansion/react-native-screens/pull/2683
  do {
    currentView = currentView.reactSuperview;
  } while (currentView != nil && ![currentView isKindOfClass:RNSScreenView.class]);

  return static_cast<RNSScreenView *_Nullable>(currentView);
}

#ifdef RCT_NEW_ARCH_ENABLED

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
