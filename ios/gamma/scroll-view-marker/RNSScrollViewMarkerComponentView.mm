#import "RNSScrollViewMarkerComponentView.h"
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>

namespace react = facebook::react;

@implementation RNSScrollViewMarkerComponentView

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}

- (void)initState
{
}

#pragma mark - RCTComponentViewProtocol

+ (BOOL)shouldBeRecycled
{
  return NO;
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScrollViewMarkerComponentDescriptor>();
}

@end

Class<RCTComponentViewProtocol> RNSScrollViewMarkerCls(void)
{
  return RNSScrollViewMarkerComponentView.class;
}
