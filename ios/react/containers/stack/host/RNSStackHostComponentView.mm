#import "RNSStackHostComponentView.h"

#import <React/RCTConversions.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/UIView+React.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import <react/renderer/components/rnscreens/RNSStackHostComponentDescriptor.h>
#import "RNSDefines.h"
#import "RNSLog.h"

#import "RNSContainerHelpers.h"
#import "RNSStackHeaderConfigComponentView.h"
#import "RNSStackNavigationController.h"
#import "RNSStackScreenComponentView.h"

namespace react = facebook::react;

@interface RNSStackHostComponentView () <RCTMountingTransactionObserving>
@end

@implementation RNSStackHostComponentView {
  NSMutableArray<RNSStackScreenComponentView *> *_Nonnull _renderedScreens;
  BOOL _didSetHeadlessModeEnabled;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}

- (void)initState
{
  static const auto defaultProps = std::make_shared<const react::RNSStackHostProps>();
  _props = defaultProps;

  _stackNavigationController = [RNSStackNavigationController new];
  _renderedScreens = [NSMutableArray new];
}

#pragma mark - UIKit Callbacks

- (void)didMoveToWindow
{
  RNSLogD(@"[RNScreens] StackHost [%ld] attached to window", self.tag);
  // In headless mode the host does not show the stack itself.
  if (_headlessModeEnabled) {
    if (self.window != nil) {
      RNSLogE(
          @"[RNScreens] Stack.Host is rendered in a Split.Column, but it is not the direct and only child of the "
          @"column, so the stack is not shown. Set disableStackIntegration on the Split.Column to nest the "
          @"stack as plain content.");
    }
    return;
  }
  if (self.window != nil && _stackNavigationController.parentViewController == nil) {
    BOOL mountResult = [RNSContainerHelpers addChildViewController:_stackNavigationController
                                          toViewControllerManaging:self.reactSuperview
                                                 withContainerView:self];
    if (mountResult) {
      [self setupViewConstraintsForController:_stackNavigationController];
    }
  }
}

// By default, the header buttons that are not inside the native hit area
// cannot be clicked, so we check it by ourselves
- (UIView *)hitTest:(CGPoint)point withEvent:(UIEvent *)event
{
  if (CGRectContainsPoint(_stackNavigationController.navigationBar.frame, point)) {
    RNSStackHeaderConfigComponentView *headerConfig = [self requireTopScreenHeaderConfig];
    CGPoint convertedPoint = [self convertPoint:point toView:headerConfig];
    UIView *headerHitTestResult = [headerConfig hitTest:convertedPoint withEvent:event];
    if (headerHitTestResult != nil) {
      return headerHitTestResult;
    }
  }
  return [super hitTest:point withEvent:event];
}

#pragma mark - RCTComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RCTAssert([childComponentView isKindOfClass:RNSStackScreenComponentView.class],
            @"[RNScreens] Attempt to mount child of unsupported type: %@, expected %@",
            childComponentView.class,
            RNSStackScreenComponentView.class);

  auto *childScreen = static_cast<RNSStackScreenComponentView *>(childComponentView);
  childScreen.stackHost = self;
  [_renderedScreens insertObject:childScreen atIndex:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RCTAssert([childComponentView isKindOfClass:RNSStackScreenComponentView.class],
            @"[RNScreens] Attempt to unmount child of unsupported type: %@, expected %@",
            childComponentView.class,
            RNSStackScreenComponentView.class);

  auto *childScreen = static_cast<RNSStackScreenComponentView *>(childComponentView);
  [_renderedScreens removeObject:childScreen];
  childScreen.stackHost = nil;
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSStackHostProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSStackHostProps>(props);

  if (oldComponentProps.headlessModeEnabled != newComponentProps.headlessModeEnabled) {
    if (_didSetHeadlessModeEnabled) {
      RNSLogW(@"[RNScreens] Changing the headless mode of Stack.Host at runtime is not supported");
    } else {
      _headlessModeEnabled = newComponentProps.headlessModeEnabled;
    }
  }
  _didSetHeadlessModeEnabled = YES;

  [super updateProps:props oldProps:oldProps];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSStackHostComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

#pragma mark - Utils

- (void)setupViewConstraintsForController:(nonnull UIViewController *)controller
{
  // Enable auto-layout to ensure valid size of stack controller view.
  controller.view.translatesAutoresizingMaskIntoConstraints = NO;
  [NSLayoutConstraint activateConstraints:@[
    [controller.view.topAnchor constraintEqualToAnchor:self.topAnchor],
    [controller.view.bottomAnchor constraintEqualToAnchor:self.bottomAnchor],
    [controller.view.leadingAnchor constraintEqualToAnchor:self.leadingAnchor],
    [controller.view.trailingAnchor constraintEqualToAnchor:self.trailingAnchor]
  ]];
}

- (RNSStackHeaderConfigComponentView *)requireTopScreenHeaderConfig
{
  RCTAssert([_stackNavigationController.topViewController.view isKindOfClass:[RNSStackScreenComponentView class]],
            @"[RNScreens] Expected top screen to be a react component view of type RNSStackScreenComponentView");
  auto screenView = (RNSStackScreenComponentView *)_stackNavigationController.topViewController.view;

  return screenView.headerConfig;
}

#pragma mark - RCTMountingTransactionObserving

- (void)mountingTransactionWillMount:(const facebook::react::MountingTransaction &)transaction
                withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  [_stackNavigationController beginTransaction];
}

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  [_stackNavigationController commitTransaction];
}

#pragma mark - Dynamic frameworks support

// Needed because of this: https://github.com/facebook/react-native/pull/37274
#ifdef RCT_DYNAMIC_FRAMEWORKS
+ (void)load
{
  [super load];
}
#endif // RCT_DYNAMIC_FRAMEWORKS

@end

Class<RCTComponentViewProtocol> RNSStackHostCls(void)
{
  return RNSStackHostComponentView.class;
}
