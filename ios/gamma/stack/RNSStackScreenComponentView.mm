#import "RNSStackScreenComponentView.h"
#import <React/RCTConversions.h>
#import <React/RCTMountingTransactionObserving.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import "RNSInvalidatedComponentsRegistry.h"
#import "RNSViewControllerInvalidator.h"
#endif // RCT_NEW_ARCH_ENABLED

#import "Swift-Bridging.h"

namespace react = facebook::react;

@interface RNSStackScreenComponentView () <RCTMountingTransactionObserving>
@end

#pragma mark - View implementation

@implementation RNSStackScreenComponentView {
  RNSStackScreenController *_Nonnull _controller;
  RNSStackScreenComponentEventEmitter *_Nonnull _reactEventEmitter;
#ifdef RCT_NEW_ARCH_ENABLED
  RNSInvalidatedComponentsRegistry *_Nonnull _invalidatedComponentsRegistry;
#endif // RCT_NEW_ARCH_ENABLED

  // Flags
  BOOL _needsLifecycleStateUpdate;
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
  [self resetProps];
  [self setupController];

#ifdef RCT_NEW_ARCH_ENABLED
  _invalidatedComponentsRegistry = [RNSInvalidatedComponentsRegistry new];
#endif // RCT_NEW_ARCH_ENABLED
  _reactEventEmitter = [RNSStackScreenComponentEventEmitter new];

  _needsLifecycleStateUpdate = NO;
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSScreenStackProps>();
  _props = defaultProps;

  // container state
  _screenKey = nil;
  _maxLifecycleState = RNSScreenStackLifecycleInitial;
}

- (void)setupController
{
  _controller = [[RNSStackScreenController alloc] initWithComponentView:self];
  _controller.view = self;
}

#pragma mark - Events

- (nonnull RNSStackScreenComponentEventEmitter *)reactEventEmitter
{
  RCTAssert(_reactEventEmitter != nil, @"[RNScreens] Attempt to access uninitialized _reactEventEmitter");
  return _reactEventEmitter;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSStackScreenProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSStackScreenProps>(props);

  if (oldComponentProps.maxLifecycleState != newComponentProps.maxLifecycleState) {
    _maxLifecycleState = static_cast<RNSScreenStackLifecycleState>(newComponentProps.maxLifecycleState);
    _needsLifecycleStateUpdate = YES;
  }

  if (oldComponentProps.screenKey != newComponentProps.screenKey) {
    RCTAssert(_screenKey == nil, @"[RNScreens] ScreenController cannot change its screenKey");
    _screenKey = RCTNSStringFromStringNilIfEmpty(newComponentProps.screenKey);
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  if (_needsLifecycleStateUpdate) {
    _needsLifecycleStateUpdate = NO;
    [_controller setNeedsLifecycleStateUpdate];
  }

  [super finalizeUpdates:updateMask];
}

- (void)updateEventEmitter:(const facebook::react::EventEmitter::Shared &)eventEmitter
{
  [super updateEventEmitter:eventEmitter];
  [_reactEventEmitter
      updateEventEmitter:std::static_pointer_cast<const react::RNSStackScreenEventEmitter>(eventEmitter)];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSStackScreenComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

#ifdef RCT_NEW_ARCH_ENABLED

#pragma mark - RCTMountingTransactionObserving

- (void)mountingTransactionWillMount:(const facebook::react::MountingTransaction &)transaction
                withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  for (const auto &mutation : transaction.getMutations()) {
    if ([self shouldInvalidateOnMutation:mutation]) {
      [RNSViewControllerInvalidator invalidateViewIfDetached:self forRegistry:_invalidatedComponentsRegistry];
    }
  }
}

#pragma mark - RNSViewControllerInvalidating

- (void)invalidateController
{
  _controller = nil;
}

- (BOOL)shouldInvalidateOnMutation:(const facebook::react::ShadowViewMutation &)mutation
{
  return (mutation.oldChildShadowView.tag == self.tag && mutation.type == facebook::react::ShadowViewMutation::Delete);
}

#endif // RCT_NEW_ARCH_ENABLED

@end

Class<RCTComponentViewProtocol> RNSStackScreenCls(void)
{
  return RNSStackScreenComponentView.class;
}
