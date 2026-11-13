#import "RNSStackHostComponentView.h"

#import <React/RCTConversions.h>
#import <React/RCTLog.h>
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
#import "RNSStackOperationCoordinator.h"
#import "RNSStackScreenComponentView.h"

namespace react = facebook::react;

@interface RNSStackHostComponentView () <RCTMountingTransactionObserving>
@end

@implementation RNSStackHostComponentView {
  RNSStackNavigationController *_Nullable _stackNavigationController;
  RNSStackOperationCoordinator *_Nonnull _stackOperationCoordinator;
  NSMutableArray<RNSStackScreenComponentView *> *_Nonnull _renderedScreens;
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

  _stackOperationCoordinator = [RNSStackOperationCoordinator new];
  _renderedScreens = [NSMutableArray new];
}

#pragma mark - UIKit Callbacks

- (void)didMoveToWindow
{
  RNSLogD(@"[RNScreens] StackHost [%ld] attached to window", self.tag);
  if (_usesExternalNavigationController) {
    if (self.window != nil && _stackNavigationController == nil) {
      RCTLogError(
          @"[RNScreens] Stack.Host expects a navigation controller from its parent, but it has not got one. "
          @"The stack is not shown.");
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

#pragma mark - External navigation controller

- (nullable RNSStackNavigationController *)externalNavigationController
{
  return _usesExternalNavigationController ? _stackNavigationController : nil;
}

- (void)setExternalNavigationController:(nullable RNSStackNavigationController *)navigationController
{
  RCTAssert(_usesExternalNavigationController,
            @"[RNScreens] Only a Stack.Host with `usesExternalNavigationController` takes a navigation controller");
  if (navigationController == _stackNavigationController) {
    return;
  }
  RCTAssert(navigationController == nil || navigationController.viewControllers.count == 0,
            @"[RNScreens] Stack.Host expects an empty navigation controller");
  _stackNavigationController = navigationController;
  [self flushPendingOperations];
}

- (void)updateUsesExternalNavigationController:(BOOL)usesExternalNavigationController
{
  if (_stackNavigationController != nil) {
    RCTLogError(@"[RNScreens] Stack.Host cannot switch between its own and an external navigation controller");
    return;
  }
  _usesExternalNavigationController = usesExternalNavigationController;
}

/**
 * The host learns from its props whether it uses an external navigation controller, so it creates its own one only
 * when the first props are applied.
 */
- (void)createOwnNavigationControllerIfNeeded
{
  if (_usesExternalNavigationController || _stackNavigationController != nil) {
    return;
  }
  _stackNavigationController = [RNSStackNavigationController new];
}

#pragma mark - Communication with StackScreen

- (void)stackScreenChangedActivityMode:(nonnull RNSStackScreenComponentView *)stackScreen
{
  RCTAssert(stackScreen != nil, @"[RNScreens] Expected non nill stackScreen");
  switch (stackScreen.activityMode) {
    case RNSStackScreenActivityModeAttached:
      [_stackOperationCoordinator addPushOperation:stackScreen];
      break;
    case RNSStackScreenActivityModeDetached:
      [_stackOperationCoordinator addPopOperation:stackScreen];
      break;
    default:
      RCTAssert(NO, @"[RNScreens] Unexpected value of activityMode: %d", stackScreen.activityMode);
      return;
  }
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
  [self addPushOperationIfNeeded:childScreen];
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
  [self addPopOperationIfNeeded:childScreen];
}

- (void)addPopOperationIfNeeded:(nonnull RNSStackScreenComponentView *)stackScreen
{
  if (stackScreen.activityMode == RNSStackScreenActivityModeAttached && !stackScreen.isNativelyDismissed) {
    // This shouldn't happen in typical scenarios but it can happen with fast-refresh.
    [_stackOperationCoordinator addPopOperation:stackScreen];
  } else {
    RNSLogD(@"[RNScreens] ignoring pop operation of %@, already not attached or natively dismissed",
            stackScreen.screenKey);
  }
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSStackHostProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSStackHostProps>(props);

  if (oldComponentProps.usesExternalNavigationController != newComponentProps.usesExternalNavigationController) {
    [self updateUsesExternalNavigationController:newComponentProps.usesExternalNavigationController];
  }
  [self createOwnNavigationControllerIfNeeded];

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

- (void)flushPendingOperations
{
  if (_stackNavigationController == nil) {
    return;
  }
  [_stackOperationCoordinator enqueuePendingOperationsIfNeeded:_stackNavigationController
                                           withRenderedScreens:_renderedScreens];
  [_stackNavigationController commitTransaction];
}

- (void)addPushOperationIfNeeded:(nonnull RNSStackScreenComponentView *)stackScreen
{
  if (stackScreen.activityMode == RNSStackScreenActivityModeAttached) {
    [_stackOperationCoordinator addPushOperation:stackScreen];
  }
}

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
  [self flushPendingOperations];
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
