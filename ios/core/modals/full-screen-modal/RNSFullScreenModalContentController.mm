#import "RNSFullScreenModalContentController.h"
#import "RNSFullScreenModalContentView.h"
#import "RNSFullScreenModalPresentationManager.h"

#import "RNSAssert.h"

@implementation RNSFullScreenModalContentController {
  RNSFullScreenModalPresentationManager *_Nonnull _presentationManager;

  BOOL _needsPresentationUpdate;
}

- (instancetype)init
{
  if (self = [super init]) {
    _presentationManager = [RNSFullScreenModalPresentationManager new];

    _presentationStyle = RNSFullScreenModalPresentationStyleReplacingContent;
    [self applyPresentationStyle];
  }
  return self;
}

- (RNSFullScreenModalContentView *)contentView
{
  return static_cast<RNSFullScreenModalContentView *>(self.view);
}

#pragma mark - Appearance

- (void)setPresentationStyle:(RNSFullScreenModalPresentationStyle)presentationStyle
{
  if (_presentationStyle == presentationStyle) {
    return;
  }
  // Each component passes a fixed style, so the style changes only on mount, before the first presentation.
  RNSAssert(_presentationManager.state == RNSFullScreenModalPresentationStateDismissed,
            @"[RNScreens] The full-screen modal presentation style cannot change while the modal is presented.");

  _presentationStyle = presentationStyle;
  [self applyPresentationStyle];
}

- (void)setNativeContainerBackgroundColor:(nullable UIColor *)nativeContainerBackgroundColor
{
  _nativeContainerBackgroundColor = nativeContainerBackgroundColor;
  [self applyBackgroundColor];
}

- (void)applyPresentationStyle
{
  switch (_presentationStyle) {
    case RNSFullScreenModalPresentationStyleOverContent:
      self.modalPresentationStyle = UIModalPresentationOverFullScreen;
      break;
    case RNSFullScreenModalPresentationStyleReplacingContent:
      self.modalPresentationStyle = UIModalPresentationFullScreen;
      break;
  }
  [self applyBackgroundColor];
}

- (void)applyBackgroundColor
{
  self.viewIfLoaded.backgroundColor = [self resolvedBackgroundColor];
}

- (nonnull UIColor *)resolvedBackgroundColor
{
  if (_nativeContainerBackgroundColor != nil) {
    return _nativeContainerBackgroundColor;
  }

  if (_presentationStyle == RNSFullScreenModalPresentationStyleOverContent) {
    return [UIColor clearColor];
  }

  // Replacing: content without its own background would otherwise show black.
#if TARGET_OS_TV
  // `systemBackgroundColor` is unavailable on tvOS; resolve its light/dark counterpart manually.
  return [UIColor colorWithDynamicProvider:^UIColor *(UITraitCollection *traitCollection) {
    return traitCollection.userInterfaceStyle == UIUserInterfaceStyleDark ? [UIColor blackColor] : [UIColor whiteColor];
  }];
#else
  return [UIColor systemBackgroundColor];
#endif // TARGET_OS_TV
}

#pragma mark - UIKit callbacks

- (void)loadView
{
  self.view = [RNSFullScreenModalContentView new];
  [self applyBackgroundColor];
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  [self.delegate modalControllerViewDidLayoutSubviews:self];
}

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];

  [self.delegate modalControllerViewWillAppear:self];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];

  // The host went away while the presentation was running; UIKit ignores a dismissal requested before this point.
  if (self.presentationProvider == nil) {
    [self.presentingViewController dismissViewControllerAnimated:NO completion:nil];
    return;
  }

  [_presentationManager handleDidPresent];
  [self.delegate modalControllerViewDidAppear:self];

  // Dismisses right away if `isOpen` flipped back while the presentation was landing.
  [self updatePresentationState];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];

  [self.delegate modalControllerViewWillDisappear:self];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];

  [self.delegate modalControllerViewDidDisappear:self];

  // `viewDidDisappear:` also fires when a replacing modal is presented on top of this one; only a controller that
  // left the presentation hierarchy was actually dismissed.
  if (self.presentingViewController == nil) {
    [_presentationManager handleDidLeavePresentationHierarchyWithProvider:self.presentationProvider controller:self];
  }
}

#pragma mark - Presentation

- (void)updatePresentationState
{
  id<RNSFullScreenModalPresentationProvider> presentationProvider = self.presentationProvider;

  if (presentationProvider == nil) {
    return;
  }

  [_presentationManager updatePresentationIfNeededWithProvider:presentationProvider controller:self];
}

#pragma mark - Signals

- (void)setNeedsPresentationUpdate
{
  _needsPresentationUpdate = YES;
}

#pragma mark - Updates

- (void)flushPendingUpdates
{
  if (!_needsPresentationUpdate) {
    return;
  }
  _needsPresentationUpdate = NO;
  [self updatePresentationState];
}

@end
