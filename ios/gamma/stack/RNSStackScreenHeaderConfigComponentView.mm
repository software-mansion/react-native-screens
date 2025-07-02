#import "RNSStackScreenHeaderConfigComponentView.h"

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

@interface RNSStackScreenHeaderConfigComponentView () <RCTMountingTransactionObserving>
@end

@implementation RNSStackScreenHeaderConfigComponentView {
  // flags
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
  
  // flags
  _needsNavigationItemUpdate = NO;
  // navigation item props
  _title = nil;
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSScreenStackProps>();
  _props = defaultProps;
}

#pragma mark - RCTViewComponentViewProtocol

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSStackScreenHeaderConfigComponentDescriptor>();
}

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSStackScreenHeaderConfigProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSStackScreenHeaderConfigProps>(props);
  if (oldComponentProps.title != newComponentProps.title) {
    _title = RCTNSStringFromStringNilIfEmpty(newComponentProps.title);
    _needsNavigationItemUpdate = YES;
  }


  [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
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
 // noop
}

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  if (_needsNavigationItemUpdate) {
    _needsNavigationItemUpdate = NO;
    
    auto stackHeaderAppearanceProps = [[RNSStackHeaderAppearance alloc] init];
    
    stackHeaderAppearanceProps.title = _title;
    
    RCTAssert([self.superview isKindOfClass:RNSStackScreenComponentView.class], @"[RNScreens] Screen header config must be child of a screen");
    auto *stackScreen = static_cast<RNSStackScreenComponentView *>(self.superview);
    RNSStackScreenController *stackScreenController = stackScreen.controller;
    [stackScreenController setNeedsHeaderAppearanceUpdateWithStackHeaderAppearance:stackHeaderAppearanceProps];
  }
}

@end

Class<RCTComponentViewProtocol> RNSStackScreenHeaderConfigCls(void)
{
  return RNSStackScreenHeaderConfigComponentView.class;
}
