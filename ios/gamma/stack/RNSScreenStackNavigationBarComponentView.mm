#import "RNSScreenStackNavigationBarComponentView.h"

#import <React/RCTConversions.h>
#import <React/RCTMountingTransactionObserving.h>
#import <React/UIView+React.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import "RNSDefines.h"

#import "Swift-Bridging.h"

namespace react = facebook::react;

@interface RNSScreenStackNavigationBarComponentView () <RCTMountingTransactionObserving>
@end

@implementation RNSScreenStackNavigationBarComponentView {
  RNSNavigationBarController *_Nonnull _controller;
  
  // Flags
  BOOL _needsNavigationItemUpdate;
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
  
  _needsNavigationItemUpdate = NO;
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSScreenStackProps>();
  _props = defaultProps;

  _controller = [[RNSNavigationBarController alloc] initWithNavigationBarComponentView:self];
  
  // navigation item props
  _title = nil;
}

- (void)setNavigationItem:(UINavigationItem *)navigationItem
{
  _controller.navigationItem = navigationItem;
}

#pragma mark - RCTViewComponentViewProtocol

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super mountChildComponentView:childComponentView index:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super unmountChildComponentView:childComponentView index:index];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScreenStackNavigationBarComponentDescriptor>();
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSScreenStackNavigationBarProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSScreenStackNavigationBarProps>(props);
  NSLog(@"props");
  if (oldComponentProps.title != newComponentProps.title) {
    _title = RCTNSStringFromStringNilIfEmpty(newComponentProps.title);
    NSLog(@"props new title %@", _title);
    _needsNavigationItemUpdate = YES;
  }


  [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  if (_needsNavigationItemUpdate) {
    _needsNavigationItemUpdate = NO;
    [_controller setNeedsNavigationItemUpdate];
  }

  [super finalizeUpdates:updateMask];
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
  [_controller reactMountingTransactionWillMount];
}

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  [_controller reactMountingTransactionDidMount];
}

@end

Class<RCTComponentViewProtocol> RNSScreenStackNavigationBarCls(void)
{
  return RNSScreenStackNavigationBarComponentView.class;
}
