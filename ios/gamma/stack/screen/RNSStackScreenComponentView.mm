#import "RNSStackScreenComponentView.h"
#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

#import "RNSConversions-Stack.h"
#import "RNSStackHostComponentView.h"

#import "Swift-Bridging.h"

namespace react = facebook::react;

#pragma mark - View implementation

@implementation RNSStackScreenComponentView {
  RNSStackScreenController *_Nonnull _controller;
  RNSStackScreenComponentEventEmitter *_Nonnull _reactEventEmitter;
}

// MARK: - RNSBaseScreenComponentView abstract overrides

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSStackScreenProps>();
  _props = defaultProps;

  [self updateScreenKey:nil];
  _activityMode = RNSStackScreenActivityModeDetached;
}

- (void)setupController
{
  _controller = [[RNSStackScreenController alloc] initWithComponentView:self];
  _controller.view = self;
  _reactEventEmitter = [RNSStackScreenComponentEventEmitter new];
}

- (void)notifyParentOfActivityModeChange
{
  [self.stackHost screenChangedActivityMode:self];
}

- (BOOL)isAttached
{
  return _activityMode == RNSStackScreenActivityModeAttached;
}

- (UIViewController *)screenViewController
{
  return _controller;
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

  if (oldComponentProps.activityMode != newComponentProps.activityMode) {
    _activityMode = rnscreens::conversion::convert<RNSStackScreenActivityMode>(newComponentProps.activityMode);
    [self markActivityModeChanged];
  }

  if (oldComponentProps.screenKey != newComponentProps.screenKey) {
    [self updateScreenKey:RCTNSStringFromStringNilIfEmpty(newComponentProps.screenKey)];
  }

  [super updateProps:props oldProps:oldProps];
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

- (void)invalidate
{
  // We want to run after container updates are performed (transitions etc.)
  __weak auto weakSelf = self;
  dispatch_async(dispatch_get_main_queue(), ^{
    auto strongSelf = weakSelf;
    if (strongSelf) {
      strongSelf->_controller = nil;
    }
  });
}

@end

Class<RCTComponentViewProtocol> RNSStackScreenCls(void)
{
  return RNSStackScreenComponentView.class;
}
