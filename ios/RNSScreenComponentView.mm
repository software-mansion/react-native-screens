#import "RNSScreenComponentView.h"
#import "RNSScreenStackHeaderConfigComponentView.h"

#import <React/RCTConversions.h>

#import <react/renderer/components/ScreensSpec/EventEmitters.h>
#import <react/renderer/components/ScreensSpec/Props.h>
#import <react/renderer/components/ScreensSpec/RCTComponentViewHelpers.h>
#import "../common/cpp/rnscreens/RNSScreenComponentDescriptor.h"

#import "RCTFabricComponentsPlugins.h"

using namespace facebook::react;

@interface RNSScreenComponentView () <RCTRNSScreenViewProtocol>
@end

@implementation RNSScreenComponentView {
    RNSScreenController *_controller;
    RNSScreenShadowNode::ConcreteState::Shared _state;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    static const auto defaultProps = std::make_shared<const RNSScreenProps>();
    _props = defaultProps;
    _controller = [[RNSScreenController alloc] initWithView:self];
  }

  return self;
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super mountChildComponentView:childComponentView index:index];
  if ([childComponentView isKindOfClass:[RNSScreenStackHeaderConfigComponentView class]]) {
    _config = childComponentView;
    ((RNSScreenStackHeaderConfigComponentView *)childComponentView).screenView = self;
  }
}


- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  if ([childComponentView isKindOfClass:[RNSScreenStackHeaderConfigComponentView class]]) {
      _config = nil;
  }
  [super unmountChildComponentView:childComponentView index:index];
}

- (void)updateBounds
{
    if (_state != nullptr) {
        auto boundsSize = self.bounds.size;
        auto newState = RNSScreenState{RCTSizeFromCGSize(boundsSize)};
        _state->updateState(std::move(newState));
        UINavigationController *navctr = _controller.navigationController;
        [navctr.view setNeedsLayout];
    }
}

- (UIView *)reactSuperview
{
  return _reactSuperview;
}

// TODO: Find out why this errors occur (when code is uncomented)
- (void)notifyWillAppear
{
//    std::dynamic_pointer_cast<const RNSScreenEventEmitter>(_eventEmitter)
//        ->onWillAppear(RNSScreenEventEmitter::OnWillAppear{});
}

- (void)notifyWillDisappear
{
//    std::dynamic_pointer_cast<const RNSScreenEventEmitter>(_eventEmitter)
//        ->onWillDisappear(RNSScreenEventEmitter::OnWillDisappear{});
}

- (void)notifyAppear
{
//    std::dynamic_pointer_cast<const RNSScreenEventEmitter>(_eventEmitter)
//        ->onAppear(RNSScreenEventEmitter::OnAppear{});
}

- (void)notifyDisappear
{
//    std::dynamic_pointer_cast<const RNSScreenEventEmitter>(_eventEmitter)
//        ->onDisappear(RNSScreenEventEmitter::OnDisappear{});
}


#pragma mark - RCTComponentViewProtocol

- (void)prepareForRecycle
{
    [super prepareForRecycle];
    _controller=nil;
    _state.reset();
}

+ (ComponentDescriptorProvider)componentDescriptorProvider
{
  return concreteComponentDescriptorProvider<RNSScreenComponentDescriptor>();
}

- (void)updateProps:(Props::Shared const &)props oldProps:(Props::Shared const &)oldProps
{
    const auto &oldScreenProps = *std::static_pointer_cast<const RNSScreenProps>(_props);
    const auto &newScreenProps = *std::static_pointer_cast<const RNSScreenProps>(props);

    [super updateProps:props oldProps:oldProps];
}

- (void)updateState:(facebook::react::State::Shared const &)state
           oldState:(facebook::react::State::Shared const &)oldState
{
    _state = std::static_pointer_cast<const RNSScreenShadowNode::ConcreteState>(state);
}

#pragma mark - Native Commands

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
//  RCTSwitchHandleCommand(self, commandName, args);
}

- (void)setValue:(BOOL)value
{
  
}

@end

Class<RCTComponentViewProtocol> RNSScreenCls(void)
{
  return RNSScreenComponentView.class;
}

