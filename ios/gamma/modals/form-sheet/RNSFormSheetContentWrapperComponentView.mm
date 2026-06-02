#import "RNSFormSheetContentWrapperComponentView.h"

#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

namespace react = facebook::react;

@interface RNSFormSheetContentWrapperComponentView () <RCTRNSFormSheetContentWrapperViewProtocol>
@end

@implementation RNSFormSheetContentWrapperComponentView

#pragma mark - RCTComponentViewProtocol

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSFormSheetContentWrapperComponentDescriptor>();
}

- (void)updateLayoutMetrics:(const react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const react::LayoutMetrics &)oldLayoutMetrics
{
  [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];

  CGFloat newHeight = layoutMetrics.frame.size.height;
  CGFloat oldHeight = oldLayoutMetrics.frame.size.height;

  if (newHeight != oldHeight) {
    if (_delegate) {
      [_delegate contentWrapper:self didChangeContentHeight:newHeight];
    }
  }
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

- (void)invalidate
{
  _delegate = nil;
}

@end

Class<RCTComponentViewProtocol> RNSFormSheetContentWrapperCls(void)
{
  return RNSFormSheetContentWrapperComponentView.class;
}
