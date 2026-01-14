#import "RNSStackHostComponentView.h"

#import <React/RCTConversions.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/UIView+React.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import "RNSDefines.h"

#import "RNSStackScreenComponentView.h"
#import "Swift-Bridging.h"

namespace react = facebook::react;

static void dumpStackHostSubviewsState(NSArray<RNSStackScreenComponentView *> *reactSubviews);

@interface RNSStackHostComponentView () <RCTMountingTransactionObserving>
@end

@implementation RNSStackHostComponentView {
  RNSStackController *_Nonnull _controller;
  NSMutableArray<RNSStackScreenComponentView *> *_Nonnull _reactSubviews;

  bool _hasModifiedReactSubviewsInCurrentTransaction;
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
  _controller = [[RNSStackController alloc] initWithStackHostComponentView:self];
  _hasModifiedReactSubviewsInCurrentTransaction = false;
  _reactSubviews = [NSMutableArray new];
}

- (void)didMoveToWindow
{
  RCTAssert(_controller != nil, @"[RNScreens] Controller must not be nil while attaching to window");

  [self reactAddControllerToClosestParent:_controller];
}

- (void)reactAddControllerToClosestParent:(UIViewController *)controller
{
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

RNS_IGNORE_SUPER_CALL_BEGIN
- (nonnull NSMutableArray<RNSStackScreenComponentView *> *)reactSubviews
{
  return _reactSubviews;
}
RNS_IGNORE_SUPER_CALL_END

- (nonnull RNSStackController *)stackController
{
  RCTAssert(_controller != nil, @"[RNScreens] Controller must not be nil");
  return _controller;
}

#pragma mark - Communication with StackScreen

- (void)stackScreenChangedActivityMode:(nonnull RNSStackScreenComponentView *)stackScreen
{
  [_controller setNeedsUpdateOfChildViewControllers];
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
  [_reactSubviews insertObject:childScreen atIndex:index];
  _hasModifiedReactSubviewsInCurrentTransaction = true;

  NSLog(
      @"StackHost [%ld] mount: StackScreen [%ld] (%@) at %ld",
      self.tag,
      childComponentView.tag,
      childScreen.screenKey,
      index);
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  RCTAssert(
      [childComponentView isKindOfClass:RNSStackScreenComponentView.class],
      @"[RNScreens] Attempt to unmount child of unsupported type: %@, expected %@",
      childComponentView.class,
      RNSStackScreenComponentView.class);

  auto *childScreen = static_cast<RNSStackScreenComponentView *>(childComponentView);
  [_reactSubviews removeObject:childScreen];
  childScreen.stackHost = nil;
  _hasModifiedReactSubviewsInCurrentTransaction = true;

  NSLog(
      @"StackHost [%ld] unmount: StackScreen [%ld] (%@) at %ld",
      self.tag,
      childComponentView.tag,
      childScreen.screenKey,
      index);
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

#pragma mark - RCTMountingTransactionObserving

- (void)mountingTransactionWillMount:(const facebook::react::MountingTransaction &)transaction
                withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  _hasModifiedReactSubviewsInCurrentTransaction = false;
  [_controller reactMountingTransactionWillMount];
}

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  if (_hasModifiedReactSubviewsInCurrentTransaction) {
    [_controller setNeedsUpdateOfChildViewControllers];
    dumpStackHostSubviewsState(_reactSubviews);
  }
  [_controller reactMountingTransactionDidMount];
}

@end

Class<RCTComponentViewProtocol> RNSStackHostCls(void)
{
  return RNSStackHostComponentView.class;
}

static void dumpStackHostSubviewsState(NSArray<RNSStackScreenComponentView *> *reactSubviews)
{
  NSMutableArray<NSString *> *descs = [[NSMutableArray alloc] initWithCapacity:reactSubviews.count];
  for (RNSStackScreenComponentView *screen in reactSubviews) {
    [descs addObject:[NSString stringWithFormat:@"StackScreen [%ld] %@ activityMode=%d",
                                                screen.tag,
                                                screen.screenKey,
                                                screen.activityMode]];
  }
  NSLog(@"%@", descs);
}
