#import "RNSFormSheetContentWrapperComponentView.h"

#import <React/RCTMountingTransactionObserving.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

namespace react = facebook::react;

@interface RNSFormSheetContentWrapperComponentView () <RCTRNSFormSheetContentWrapperViewProtocol,
                                                       RCTMountingTransactionObserving>
@end

@implementation RNSFormSheetContentWrapperComponentView {
  BOOL _initialHeightReported;
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
  _initialHeightReported = NO;
}

#pragma mark - RCTMountingTransactionObserving

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  // We only need to catch the initial mount because subsequent dynamic height changes
  // are handled directly by `updateLayoutMetrics`.
  if (_initialHeightReported) {
    return;
  }

  if (_delegate && self.frame.size.height > 0) {
    _initialHeightReported = YES;
    [_delegate contentWrapper:self didChangeContentHeight:self.frame.size.height];
  }
}

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
