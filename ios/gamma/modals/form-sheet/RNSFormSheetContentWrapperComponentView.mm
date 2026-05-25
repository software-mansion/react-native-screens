#import "RNSFormSheetContentWrapperComponentView.h"

#import <React/RCTMountingTransactionObserving.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>

#import "RNSFormSheetContentView.h"

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

- (id<RNSFormSheetContentWrapperDelegate>)resolveFormSheetContentWrapperDelegate
{
  UIView *view = self.superview;
  while (view != nil) {
    if ([view isKindOfClass:[RNSFormSheetContentView class]]) {
      return ((RNSFormSheetContentView *)view).contentWrapperDelegate;
    }
    view = view.superview;
  }
  return nil;
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

  id<RNSFormSheetContentWrapperDelegate> delegate = [self resolveFormSheetContentWrapperDelegate];
  if (delegate && self.frame.size.height > 0) {
    _initialHeightReported = YES;
    [delegate contentWrapper:self didChangeContentHeight:self.frame.size.height];
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
    id<RNSFormSheetContentWrapperDelegate> delegate = [self resolveFormSheetContentWrapperDelegate];
    if (delegate) {
      [delegate contentWrapper:self didChangeContentHeight:newHeight];
    }
  }
}

@end

Class<RCTComponentViewProtocol> RNSFormSheetContentWrapperCls(void)
{
  return RNSFormSheetContentWrapperComponentView.class;
}
