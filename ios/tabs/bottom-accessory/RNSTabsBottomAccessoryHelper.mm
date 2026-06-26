#import "RNSTabsBottomAccessoryHelper.h"
#import "RNSTabsBottomAccessoryShadowStateProxy.h"

#if RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE

#import <React/RCTAssert.h>

namespace react = facebook::react;

static void *RNSTabsBottomAccessoryNativeWrapperViewContext = &RNSTabsBottomAccessoryNativeWrapperViewContext;
static void *RNSTabsBottomAccessoryContentViewHiddenContext = &RNSTabsBottomAccessoryContentViewHiddenContext;

@implementation RNSTabsBottomAccessoryHelper {
  RNSTabsBottomAccessoryComponentView *__weak _bottomAccessoryView;
  UIView *__weak _observedNativeWrapperView;

  RNSTabsBottomAccessoryContentComponentView *_regularContentView;
  RNSTabsBottomAccessoryContentComponentView *_inlineContentView;

  BOOL _isAdjustingContentViewVisibility;

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
  _isAdjustingContentViewVisibility = NO;
}

#pragma mark - Content view switching workaround

- (BOOL)isContentViewSwitchingWorkaroundActive
{
  return _regularContentView != nil && _inlineContentView != nil;
}

- (void)setContentView:(RNSTabsBottomAccessoryContentComponentView *)contentView
        forEnvironment:(RNSTabsBottomAccessoryEnvironment)environment
{
  switch (environment) {
    case RNSTabsBottomAccessoryEnvironmentRegular:
      [self replaceContentView:&_regularContentView with:contentView];
      break;

    case RNSTabsBottomAccessoryEnvironmentInline:
      [self replaceContentView:&_inlineContentView with:contentView];
      break;

    default:
      RCTLogError(@"[RNScreens] Unsupported TabsBottomAccessory environment");
  }

  [self handleContentViewVisibilityForEnvironmentIfNeeded];
}

- (void)handleContentViewVisibilityForEnvironmentIfNeeded
{
  if (!self.isContentViewSwitchingWorkaroundActive) {
    return;
  }

  _isAdjustingContentViewVisibility = YES;

  switch (self->_bottomAccessoryView.traitCollection.tabAccessoryEnvironment) {
    case UITabAccessoryEnvironmentInline:
      _regularContentView.hidden = YES;
      _inlineContentView.hidden = NO;
      break;
    default:
      _regularContentView.hidden = NO;
      _inlineContentView.hidden = YES;
      break;
  }

  _isAdjustingContentViewVisibility = NO;
}

#pragma mark - Observing content view hidden changes

- (void)unregisterForContentViewHiddenChanges:(RNSTabsBottomAccessoryContentComponentView *__strong *)observedView
{
  RNSTabsBottomAccessoryContentComponentView *currentlyObserved = *observedView;
  if (currentlyObserved == nil) {
    return;
  }

  [currentlyObserved removeObserver:self forKeyPath:@"hidden" context:RNSTabsBottomAccessoryContentViewHiddenContext];
  *observedView = nil;
}

- (void)replaceContentView:(RNSTabsBottomAccessoryContentComponentView *__strong *)slot
                      with:(nullable RNSTabsBottomAccessoryContentComponentView *)newView
{
  if (*slot == newView) {
    return;
  }

  // Detach the observer from the previous view first; this also clears the slot.
  [self unregisterForContentViewHiddenChanges:slot];

  if (newView != nil) {
    [newView addObserver:self
              forKeyPath:@"hidden"
                 options:NSKeyValueObservingOptionNew
                 context:RNSTabsBottomAccessoryContentViewHiddenContext];
  }

  *slot = newView;
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
  } else if (context == RNSTabsBottomAccessoryContentViewHiddenContext) {
    if (!_isAdjustingContentViewVisibility) {
      [self handleContentViewVisibilityForEnvironmentIfNeeded];
    }
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
}

#pragma mark - Invalidation

- (void)invalidate
{
  [_bottomAccessoryView unregisterForTraitChanges:_traitChangeRegistration];
  _traitChangeRegistration = nil;
  [self unregisterForAccessoryFrameChanges];
  [self unregisterForContentViewHiddenChanges:&_regularContentView];
  [self unregisterForContentViewHiddenChanges:&_inlineContentView];
  _bottomAccessoryView = nil;
}

@end

#endif // RNS_TABS_BOTTOM_ACCESSORY_AVAILABLE
