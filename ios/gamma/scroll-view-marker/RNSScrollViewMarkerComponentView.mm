#import "RNSScrollViewMarkerComponentView.h"
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>

#import <React/RCTAssert.h>
#import <React/RCTScrollViewComponentView.h>

namespace react = facebook::react;

@implementation RNSScrollViewMarkerComponentView {
  BOOL _hasAttemptedRegistration;
}

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}

#pragma mark - Private

- (void)initState
{
  _hasAttemptedRegistration = NO;
}

/**
 * This method throws an error in debug mode in case it fails to find the ScrollView instance,
 * as it does not make sense to use this component if the ScrollView is not there.
 */
- (nullable UIScrollView *)findScrollView
{
  for (UIView *subview in self.subviews) {
    if ([subview isKindOfClass:RCTScrollViewComponentView.class]) {
      return static_cast<RCTScrollViewComponentView *>(subview).scrollView;
    }
  }
  RCTAssert(false, @"[RNScreens] Failed to find ScrollView"); // debug assertion only
  return nil;
}

- (id<RNSScrollViewSeeking>)findSeekingParent
{
  const UIView *superview = self.superview;
  while (superview != nil) {
    if ([superview respondsToSelector:@selector(registerDescendantScrollView:fromMarker:)]) {
      return static_cast<id<RNSScrollViewSeeking>>(superview);
    }
    superview = superview.superview;
  }
  return nil;
}

- (void)maybeRegisterWithSeekingAncestor
{
  if (_hasAttemptedRegistration) {
    return;
  }

  _hasAttemptedRegistration = YES;

  UIScrollView *scrollView = [self findScrollView];

  if (scrollView == nil) {
    return;
  }

  [self configureScrollView:scrollView];

  id<RNSScrollViewSeeking> seekingAncestor = [self findSeekingParent];

  if (seekingAncestor == nil) {
    return;
  }

  [seekingAncestor registerDescendantScrollView:scrollView fromMarker:self];
}

- (void)configureScrollView:(nonnull UIScrollView *)scrollView
{
  if (@available(iOS 26.0, tvOS 26.0, *)) {
    scrollView.topEdgeEffect.style = UIScrollEdgeEffectStyle.hardStyle;
  }
}

#pragma mark - Override

// TODO: This will be way too late to configure options etc.
// Potentially we want to run in the end of transaction, before containers are updated.
- (void)willMoveToWindow:(UIWindow *)newWindow
{
  [super willMoveToWindow:newWindow];
  [self maybeRegisterWithSeekingAncestor];
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  [super updateProps:props oldProps:oldProps];
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super mountChildComponentView:childComponentView index:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super unmountChildComponentView:childComponentView index:index];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  // When we receive props, children are already mounted, but we might not be
  // attached to parent

  [super finalizeUpdates:updateMask];
}

+ (BOOL)shouldBeRecycled
{
  return NO;
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScrollViewMarkerComponentDescriptor>();
}

#pragma mark - RCTMountingTransactionObserving

- (void)mountingTransactionDidMount:(const facebook::react::MountingTransaction &)transaction
               withSurfaceTelemetry:(const facebook::react::SurfaceTelemetry &)surfaceTelemetry
{
  [self maybeRegisterWithSeekingAncestor];
}

@end

Class<RCTComponentViewProtocol> RNSScrollViewMarkerCls(void)
{
  return RNSScrollViewMarkerComponentView.class;
}
