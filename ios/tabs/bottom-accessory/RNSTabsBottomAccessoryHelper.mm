#import "RNSTabsBottomAccessoryHelper.h"
#import "RNSTabsBottomAccessoryShadowStateProxy.h"

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#import <React/RCTAssert.h>

namespace react = facebook::react;

static void *RNSTabsBottomAccessoryNativeWrapperViewContext = &RNSTabsBottomAccessoryNativeWrapperViewContext;

@implementation RNSTabsBottomAccessoryHelper {
  RNSTabsBottomAccessoryComponentView *__weak _bottomAccessoryView;
  UIView *__weak _observedNativeWrapperView;

  RNSTabsBottomAccessoryContentComponentView *__weak _regularContentView;
  RNSTabsBottomAccessoryContentComponentView *__weak _inlineContentView;

  id<UITraitChangeRegistration> _traitChangeRegistration;
}

- (instancetype)initWithBottomAccessoryView:(RNSTabsBottomAccessoryComponentView *)bottomAccessoryView
{
  if (self = [super init]) {
    _bottomAccessoryView = bottomAccessoryView;
    [self initState];
    _traitChangeRegistration = [self registerForAccessoryEnvironmentChanges];
  }

  return self;
}

- (void)initState
{
  _observedNativeWrapperView = nil;
  _regularContentView = nil;
  _inlineContentView = nil;
}

#pragma mark - Content view switching workaround

- (void)setContentView:(RNSTabsBottomAccessoryContentComponentView *)contentView
        forEnvironment:(RNSTabsBottomAccessoryEnvironment)environment
{
  switch (environment) {
    case RNSTabsBottomAccessoryEnvironmentRegular:
      _regularContentView = contentView;
      break;

    case RNSTabsBottomAccessoryEnvironmentInline:
      _inlineContentView = contentView;
      break;

    default:
      RCTLogError(@"[RNScreens] Unsupported TabsBottomAccessory environment");
  }

  [self handleContentViewVisibilityForEnvironmentIfNeeded];
}

- (void)handleContentViewVisibilityForEnvironmentIfNeeded
{
  // `hidden` is used as the sole carrier of invisibility, with alpha
  // normalized to 1.0 on both content views:
  // - `RCTViewComponentView.invalidateLayer` unconditionally resets
  //   `layer.opacity` to the React props value on arbitrary commits, which
  //   used to re-show the off-environment copy. It never touches `hidden`,
  //   and with alpha kept at 1.0 the reset becomes a no-op by construction.
  // - The off-environment copy is mounted absoluteFill ON TOP of the active
  //   one (later sibling); when it regained opacity it also captured all
  //   hit-testing, making the accessory unresponsive to taps. Hidden views
  //   are excluded from hit-testing.
  // Applied to whichever content views are registered (messages to nil are
  // no-ops) — the previous both-registered early-return left a lone
  // registered view fully visible until its sibling registered.
  BOOL isInline =
      self->_bottomAccessoryView.traitCollection.tabAccessoryEnvironment == UITabAccessoryEnvironmentInline;

  UIView *viewToShow = isInline ? _inlineContentView : _regularContentView;
  UIView *viewToHide = isInline ? _regularContentView : _inlineContentView;

  viewToShow.hidden = NO;
  viewToShow.alpha = 1.0;
  viewToHide.hidden = YES;
  viewToHide.alpha = 1.0;
}

#pragma mark - Observing environment changes

- (id<UITraitChangeRegistration>)registerForAccessoryEnvironmentChanges
{
  return [_bottomAccessoryView
      registerForTraitChanges:@[ [UITraitTabAccessoryEnvironment class] ]
                  withHandler:^(__kindof id<UITraitEnvironment>, UITraitCollection *previousTraitCollection) {
                    UITabAccessoryEnvironment environment =
                        self->_bottomAccessoryView.traitCollection.tabAccessoryEnvironment;
                    [self->_bottomAccessoryView.reactEventEmitter emitOnEnvironmentChangeIfNeeded:environment];
                    [self handleContentViewVisibilityForEnvironmentIfNeeded];
                  }];
}

#pragma mark - Observing frame changes

- (void)unregisterForAccessoryFrameChanges
{
  UIView *observedNativeWrapperView = _observedNativeWrapperView;
  if (observedNativeWrapperView == nil) {
    return;
  }

  [observedNativeWrapperView removeObserver:self
                                 forKeyPath:@"center"
                                    context:RNSTabsBottomAccessoryNativeWrapperViewContext];
  _observedNativeWrapperView = nil;
}

- (void)registerForAccessoryFrameChanges
{
  UIView *nativeWrapperView = self.nativeWrapperView;
  if (_observedNativeWrapperView == nativeWrapperView) {
    return;
  }

  [self unregisterForAccessoryFrameChanges];
  [nativeWrapperView addObserver:self
                      forKeyPath:@"center"
                         options:NSKeyValueObservingOptionInitial
                         context:RNSTabsBottomAccessoryNativeWrapperViewContext];
  _observedNativeWrapperView = nativeWrapperView;
}

- (void)observeValueForKeyPath:(NSString *)keyPath
                      ofObject:(id)object
                        change:(NSDictionary *)change
                       context:(void *)context
{
  if (context == RNSTabsBottomAccessoryNativeWrapperViewContext) {
    [self notifyWrapperViewFrameHasChanged];
  } else {
    [super observeValueForKeyPath:keyPath ofObject:object change:change context:context];
  }
}

- (UIView *)nativeWrapperView
{
  RCTAssert(_bottomAccessoryView.superview.superview != nil,
            @"[RNScreens] RNSTabsBottomAccessoryComponentView must be the set as bottom accessory.");
  return _bottomAccessoryView.superview.superview;
}

- (void)notifyWrapperViewFrameHasChanged
{
  // We use self.nativeWrapperView because it has both the size and the origin
  // that we want to send to the ShadowNode.
  [_bottomAccessoryView.shadowStateProxy updateShadowStateWithFrame:self.nativeWrapperView.frame];

  // The wrapper frame changes on every regular <-> inline move, so re-evaluate
  // content-view visibility here as well. The one-shot
  // UITraitTabAccessoryEnvironment registration callback is occasionally
  // missed during the minimize transition, which left the wrong copy visible
  // inside the inline accessory (or vice versa); this KVO fires reliably on
  // each transition (and once on registration via
  // NSKeyValueObservingOptionInitial) and self-corrects that.
  [self handleContentViewVisibilityForEnvironmentIfNeeded];
}

#pragma mark - Invalidation

- (void)invalidate
{
  [_bottomAccessoryView unregisterForTraitChanges:_traitChangeRegistration];
  _traitChangeRegistration = nil;
  [self unregisterForAccessoryFrameChanges];
  _bottomAccessoryView = nil;
  _regularContentView = nil;
  _inlineContentView = nil;
}

@end

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
