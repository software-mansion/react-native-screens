#import "RNSStackHostComponentView.h"

#import <React/RCTConversions.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/UIView+React.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import "RNSDefines.h"
#import "RNSLog.h"

#import "RNSStackNavigationController.h"
#import "RNSStackOperationCoordinator.h"
#import "RNSStackScreenComponentView.h"
#import "Swift-Bridging.h"

namespace react = facebook::react;

@interface RNSStackHostComponentView () <RCTMountingTransactionObserving>
@end

@implementation RNSStackHostComponentView {
  RNSStackNavigationController *_Nonnull _stackNavigationController;
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
  _stackNavigationController = [RNSStackNavigationController new];
  _stackOperationCoordinator = [RNSStackOperationCoordinator new];
  _renderedScreens = [NSMutableArray new];
}

#pragma mark - UIKit Callbacks

- (void)didMoveToWindow
{
  RNSLog(@"[RNScreens] StackHost [%ld] attached to window", self.tag);
  [self reactAddControllerToClosestParent:_stackNavigationController];
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
  RCTAssert(
      [childComponentView isKindOfClass:RNSStackScreenComponentView.class],
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
  RCTAssert(
      [childComponentView isKindOfClass:RNSStackScreenComponentView.class],
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
    RNSLog(
        @"[RNScreens] ignoring pop operation of %@, already not attached or natively dismissed", stackScreen.screenKey);
  }
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

- (void)addPushOperationIfNeeded:(nonnull RNSStackScreenComponentView *)stackScreen
{
  if (stackScreen.activityMode == RNSStackScreenActivityModeAttached) {
    [_stackOperationCoordinator addPushOperation:stackScreen];
  }
}

- (void)reactAddControllerToClosestParent:(nonnull UIViewController *)controller
{
  RCTAssert(controller != nil, @"[RNScreens] Attempt to move to a nullish controller");
  if (!controller.parentViewController) {
    UIView *parentView = (UIView *)self.reactSuperview;
    while (parentView) {
      if (parentView.reactViewController) {
        [parentView.reactViewController addChildViewController:controller];
        [self addSubview:controller.view];
        [controller didMoveToParentViewController:parentView.reactViewController];
        break;
      }
      parentView = (UIView *)parentView.reactSuperview;
    }
    return;
  }
}

#pragma mark - RCTMountingTransactionObserving

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  [_stackOperationCoordinator executePendingOperationsIfNeeded:_stackNavigationController
                                           withRenderedScreens:_renderedScreens];
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
