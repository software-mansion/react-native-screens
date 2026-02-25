#import "RNSScrollViewMarkerComponentView.h"
#import "RNSConversions-ScrollViewMarker.h"
#import "RNSEnums.h"
#import "RNSScrollEdgeEffectApplicator.h"

#import <React/RCTMountingTransactionObserving.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>

#import <React/RCTAssert.h>
#import <React/RCTScrollViewComponentView.h>

namespace react = facebook::react;

@interface RNSScrollViewMarkerComponentView () <RNSScrollEdgeEffectProviding, RCTMountingTransactionObserving>
@end

@implementation RNSScrollViewMarkerComponentView {
  BOOL _hasAttemptedRegistration;
  BOOL _needsEdgeEffectUpdate;

  RNSScrollEdgeEffect _leftScrollEdgeEffect;
  RNSScrollEdgeEffect _topScrollEdgeEffect;
  RNSScrollEdgeEffect _rightScrollEdgeEffect;
  RNSScrollEdgeEffect _bottomScrollEdgeEffect;
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
  [self resetProps];
  _hasAttemptedRegistration = NO;
  _needsEdgeEffectUpdate = NO;
}

- (void)resetProps
{
  static const auto defaultProps = std::make_shared<const react::RNSScrollViewMarkerProps>();
  _props = defaultProps;
  _leftScrollEdgeEffect = RNSScrollEdgeEffectAutomatic;
  _topScrollEdgeEffect = RNSScrollEdgeEffectAutomatic;
  _rightScrollEdgeEffect = RNSScrollEdgeEffectAutomatic;
  _bottomScrollEdgeEffect = RNSScrollEdgeEffectAutomatic;
}

/**
 * This method throws an error in debug mode in case it fails to find the ScrollView instance,
 * as it does not make sense to use this component if the ScrollView is not there.
 */
- (nullable UIScrollView *)findScrollView
{
  // It allows 0 for cases where the child is unmounted
  RCTAssert(
      self.subviews.count <= 1,
      @"[RNScreens] ScrollViewMarker expects at most a single child. Subviews: %@",
      self.subviews);

  UIScrollView *_Nullable foundScrollView = [self resolveScrollViewFromChildView:self.subviews.firstObject];

  RCTAssert(foundScrollView != nil, @"[RNScreens] Failed to find ScrollView"); // debug assertion only
  return foundScrollView;
}

- (nullable id<RNSScrollViewSeeking>)findSeekingParent
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

  [self registerWithSeekingAncestor];
  _hasAttemptedRegistration = YES;
}

- (void)registerWithSeekingAncestor
{
  UIScrollView *scrollView = [self findScrollView];

  if (scrollView == nil) {
    return;
  }

  id<RNSScrollViewSeeking> seekingAncestor = [self findSeekingParent];

  if (seekingAncestor == nil) {
    return;
  }

  [seekingAncestor registerDescendantScrollView:scrollView fromMarker:self];
}

- (void)configureScrollView:(nullable UIScrollView *)scrollView
{
  if (scrollView == nil) {
    return;
  }
  [RNSScrollEdgeEffectApplicator applyToScrollView:scrollView withProvider:self];
}

/**
 * Tries to resolve UIScrollView from the passed childView.
 *
 * Currently it supports only direct `UIScrollView` or react-native's `<ScrollView />` component.
 */
- (nullable UIScrollView *)resolveScrollViewFromChildView:(nullable UIView *)childView
{
  if (childView == nil) {
    return nil;
  }

  if ([childView isKindOfClass:UIScrollView.class]) {
    return static_cast<UIScrollView *>(childView);
  }

  if ([childView isKindOfClass:RCTScrollViewComponentView.class]) {
    return static_cast<RCTScrollViewComponentView *>(childView).scrollView;
  }

  return nil;
}

#pragma mark - Override

// TODO: This will be way too late to configure options etc.
// Potentially we want to run in the end of transaction, before containers are updated.
- (void)willMoveToWindow:(UIWindow *)newWindow
{
  [super willMoveToWindow:newWindow];
  [self maybeRegisterWithSeekingAncestor];
}

#pragma mark - RNSScrollEdgeEffectProviding

- (RNSScrollEdgeEffect)leftScrollEdgeEffect
{
  return _leftScrollEdgeEffect;
}

- (RNSScrollEdgeEffect)topScrollEdgeEffect
{
  return _topScrollEdgeEffect;
}

- (RNSScrollEdgeEffect)rightScrollEdgeEffect
{
  return _rightScrollEdgeEffect;
}

- (RNSScrollEdgeEffect)bottomScrollEdgeEffect
{
  return _bottomScrollEdgeEffect;
}

#pragma mark - RCTComponentViewProtocol

- (void)updateProps:(const facebook::react::Props::Shared &)props
           oldProps:(const facebook::react::Props::Shared &)oldProps
{
  using namespace rnscreens::conversion;

  const auto &oldComponentProps = *std::static_pointer_cast<const react::RNSScrollViewMarkerProps>(_props);
  const auto &newComponentProps = *std::static_pointer_cast<const react::RNSScrollViewMarkerProps>(props);

  if (oldComponentProps.leftScrollEdgeEffect != newComponentProps.leftScrollEdgeEffect) {
    _leftScrollEdgeEffect = RNSScrollEdgeEffectFromSVMLeftEdgeEffect(newComponentProps.leftScrollEdgeEffect);
    _needsEdgeEffectUpdate = true;
  }

  if (oldComponentProps.topScrollEdgeEffect != newComponentProps.topScrollEdgeEffect) {
    _topScrollEdgeEffect = RNSScrollEdgeEffectFromSVMTopEdgeEffect(newComponentProps.topScrollEdgeEffect);
    _needsEdgeEffectUpdate = true;
  }

  if (oldComponentProps.rightScrollEdgeEffect != newComponentProps.rightScrollEdgeEffect) {
    _rightScrollEdgeEffect = RNSScrollEdgeEffectFromSVMRightEdgeEffect(newComponentProps.rightScrollEdgeEffect);
    _needsEdgeEffectUpdate = true;
  }

  if (oldComponentProps.bottomScrollEdgeEffect != newComponentProps.bottomScrollEdgeEffect) {
    _bottomScrollEdgeEffect = RNSScrollEdgeEffectFromSVMBottomEdgeEffect(newComponentProps.bottomScrollEdgeEffect);
    _needsEdgeEffectUpdate = true;
  }

  [super updateProps:props oldProps:oldProps];
}

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  // This assumes that in first render children are mounted before props are updated.
  // Also this handles only first render & prop value update. It does not handle case
  // where child scrollview potentially changes. Separate question is whether we even
  // want to handle such case.
  if (_needsEdgeEffectUpdate) {
    _needsEdgeEffectUpdate = NO;
    [self configureScrollView:[self findScrollView]];
  }

  // It allows 0 for cases where the child is unmounted
  RCTAssert(
      self.subviews.count <= 1,
      @"[RNScreens] ScrollViewMarker expects at most a single child. Subviews: %@",
      self.subviews);

  [super finalizeUpdates:updateMask];
}

- (void)mountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super mountChildComponentView:childComponentView index:index];
}

- (void)unmountChildComponentView:(UIView<RCTComponentViewProtocol> *)childComponentView index:(NSInteger)index
{
  [super unmountChildComponentView:childComponentView index:index];
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
