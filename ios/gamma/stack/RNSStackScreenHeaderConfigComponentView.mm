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

@interface RNSStackScreenHeaderConfigComponentView ()
@end

@implementation RNSStackScreenHeaderConfigComponentView {
  // flags
  BOOL _needsNavigationBarAppearanceUpdate;
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
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSScreenStackProps>();
  _props = defaultProps;

  // flags
  _needsNavigationBarAppearanceUpdate = NO;
  // navigation item props
  _title = nil;
}

- (nullable RNSStackScreenComponentView *)findParent
{
  return static_cast<RNSStackScreenComponentView *>(self.superview);
}

- (void)requestNavigationBarAppearanceUpdate
{
  auto parent = [self findParent];

  if (_needsNavigationBarAppearanceUpdate && parent != nil) {
    _needsNavigationBarAppearanceUpdate = NO;

    auto stackNavigationProps = [[RNSStackNavigationAppearance alloc] init];

    stackNavigationProps.title = _title;

    RNSStackScreenController *stackScreenController = parent.controller;
    [stackScreenController setNeedsNavigationBarAppearanceUpdate:stackNavigationProps];
  }
}

- (void)didMoveToWindow
{
  [self requestNavigationBarAppearanceUpdate];
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
    _needsNavigationBarAppearanceUpdate = YES;
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  [super finalizeUpdates:updateMask];
  [self requestNavigationBarAppearanceUpdate];
}

@end

Class<RCTComponentViewProtocol> RNSStackScreenHeaderConfigCls(void)
{
  return RNSStackScreenHeaderConfigComponentView.class;
}
