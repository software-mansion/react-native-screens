#import "RNSSplitViewScreenComponentView.h"
#import <React/RCTAssert.h>
#import <rnscreens/RNSSplitViewScreenComponentDescriptor.h>

#import "Swift-Bridging.h"

namespace react = facebook::react;

@implementation RNSSplitViewScreenComponentView {
  RNSSplitViewScreenController *_Nullable _controller;
  RNSSplitViewScreenShadowStateProxy *_Nonnull _shadowStateProxy;
}

- (RNSSplitViewScreenController *)controller
{
  RCTAssert(
      _controller != nil,
      @"[RNScreens] Attempt to access RNSSplitViewScreenController before RNSSplitViewScreenComponentView was initialized. (for: %@)",
      self);
  return _controller;
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
  [self setupController];

  _shadowStateProxy = [RNSSplitViewScreenShadowStateProxy new];
}

- (void)setupController
{
  _controller = [[RNSSplitViewScreenController alloc] initWithSplitViewScreenComponentView:self];
  _controller.view = self;
}

#pragma mark - ShadowTreeState

- (nonnull RNSSplitViewScreenShadowStateProxy *)shadowStateProxy
{
  RCTAssert(_shadowStateProxy != nil, @"[RNScreens] Attempt to access uninitialized _shadowStateProxy");
  return _shadowStateProxy;
}

#pragma mark - RCTViewComponentViewProtocol

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSSplitViewScreenComponentDescriptor>();
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  // We could consider enabling it someday though.
  return NO;
}

- (void)updateState:(react::State::Shared const &)state oldState:(react::State::Shared const &)oldState
{
  [super updateState:state oldState:oldState];

  [_shadowStateProxy updateState:state oldState:oldState];
}

@end

Class<RCTComponentViewProtocol> RNSSplitViewScreenCls(void)
{
  return RNSSplitViewScreenComponentView.class;
}
