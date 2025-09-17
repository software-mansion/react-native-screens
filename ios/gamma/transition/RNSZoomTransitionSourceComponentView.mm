#import "RNSZoomTransitionSourceComponentView.h"

#import <RNScreens/RNSScreen.h>
#import <React/RCTConversions.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

namespace react = facebook::react;

@implementation RNSZoomTransitionSourceComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self resetState];
  }
  return self;
}

- (void)resetState
{
  _transitionTag = @"";
}

- (void)didMoveToWindow
{
  if (self.window == nil) {
    return;
  }

  RNSScreen *screenController = [self findAncestorScreen];
  if (screenController == nil) {
    RCTLogError(@"Nullish screen controller");
  }

  [screenController registerForZoomTransition:self];
}

#pragma mark - RCTViewComponentViewProtocol

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSZoomTransitionSourceProps>(_props);

  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSZoomTransitionSourceProps>(props);

  if (newComponentProps.transitionTag != oldComponentProps.transitionTag) {
    _transitionTag = RCTNSStringFromString(newComponentProps.transitionTag);
  }

  [super updateProps:props oldProps:oldProps];
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSZoomTransitionSourceComponentDescriptor>();
}

#pragma mark - Lookup traversals

- (RNSScreen *_Nullable)findAncestorScreen
{
  UIView *screenViewCandidate = self.superview;

  while (screenViewCandidate != nil) {
    if ([screenViewCandidate isKindOfClass:RNSScreenView.class]) {
      return static_cast<RNSScreenView *>(screenViewCandidate).controller;
    }
    screenViewCandidate = screenViewCandidate.superview;
  }

  return nil;
}

@end

Class<RCTComponentViewProtocol> RNSZoomTransitionSourceCls(void)
{
  return RNSZoomTransitionSourceComponentView.class;
}
