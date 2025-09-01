#import "RNSScreenContentWrapper.h"
#import "RNSDefines.h"
#import "RNSScreen.h"
#import "RNSScreenStack.h"

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTLog.h>
#import <React/RCTScrollViewComponentView.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

namespace react = facebook::react;
#else
#import <React/RCTScrollView.h>
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

- (nullable RNS_REACT_SCROLL_VIEW_COMPONENT *)childRCTScrollViewComponent
{
  for (UIView *subview in self.subviews) {
    if ([subview isKindOfClass:RNS_REACT_SCROLL_VIEW_COMPONENT.class]) {
      return static_cast<RNS_REACT_SCROLL_VIEW_COMPONENT *>(subview);
    }
  }
  return nil;
}

- (BOOL)coerceChildScrollViewComponentSizeToSize:(CGSize)size
{
  RNS_REACT_SCROLL_VIEW_COMPONENT *_Nullable scrollViewComponent = [self childRCTScrollViewComponent];

  if (scrollViewComponent == nil) {
    return NO;
  }

  if (self.subviews.count > 2) {
    RCTLogWarn(
        @"[RNScreens] FormSheet with ScrollView expects at most 2 subviews. Got %ld. This might result in incorrect layout. \
          If you want to display header alongside the scrollView, make sure to apply `collapsable: false` on your header component view.",
        self.subviews.count);
  }

  NSUInteger scrollViewComponentIndex = [[self subviews] indexOfObject:scrollViewComponent];

  // Case 1: ScrollView first child - takes whole size.
  if (scrollViewComponentIndex == 0) {
    CGRect newFrame = scrollViewComponent.frame;
    newFrame.size = size;
    scrollViewComponent.frame = newFrame;
    return YES;
  }

  // Case 2: There is a header - we adjust scrollview size by the header height.
  if (scrollViewComponentIndex == 1) {
    UIView *headerView = self.subviews[0];
    CGRect newFrame = scrollViewComponent.frame;
    newFrame.size = size;
    newFrame.size.height -= headerView.frame.size.height;
#ifdef RCT_NEW_ARCH_ENABLED
    // For some unknown yet reason on new architecture the scroll view
    // is placed at (0, 0), which makes no sense given there
    // is another child at lower index in flex layout.
    // TODO: Research why this happens and solve this properly.
    if (newFrame.origin.y == 0) {
      newFrame.origin.y = headerView.frame.size.height;
    }
#endif // RCT_NEW_ARCH_ENABLED
    scrollViewComponent.frame = newFrame;
    return YES;
  }

  return NO;
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
