#import <UIKit/UIKit.h>

#import "RNSScreen.h"
#import "RNSScreenContainer.h"

#import <React/RCTUIManager.h>

@interface RNSScreen : UIViewController

- (instancetype)initWithView:(UIView *)view;
- (void)notifyFinishTransitioning;

@end

@implementation RNSScreenView {
  RNSScreen *_controller;
  BOOL _invalidated;
}

@synthesize controller = _controller;

- (instancetype)init
{
  if (self = [super init]) {
    _controller = [[RNSScreen alloc] initWithView:self];
    _controller.modalPresentationStyle = UIModalPresentationOverCurrentContext;
    _stackPresentation = RNSScreenStackPresentationPush;
    _animate = YES;
  }
  return self;
}

- (void)setActive:(BOOL)active
{
  if (active != _active) {
    _active = active;
    [_reactSuperview markChildUpdated];
  }
}

- (void)setPointerEvents:(RCTPointerEvents)pointerEvents
{
  // pointer events settings are managed by the parent screen container, we ignore
  // any attempt of setting that via React props
}

- (UIView *)reactSuperview
{
  return _reactSuperview;
}

- (void)invalidate
{
  _invalidated = YES;
}

- (void)notifyFinishTransitioning
{
  [_controller notifyFinishTransitioning];
}

- (void)notifyDismissed
{
  if (self.onDismissed) {
    dispatch_async(dispatch_get_main_queue(), ^{
      if (self.onDismissed) {
        self.onDismissed(nil);
      }
    });
  }
}

@end

@implementation RNSScreen {
  __weak UIView *_view;
  __weak id _previousFirstResponder;
}

- (instancetype)initWithView:(UIView *)view
{
  if (self = [super init]) {
    _view = view;
  }
  return self;
}

- (id)findFirstResponder:(UIView*)parent
{
  if (parent.isFirstResponder) {
    return parent;
  }
  for (UIView *subView in parent.subviews) {
    id responder = [self findFirstResponder:subView];
    if (responder != nil) {
      return responder;
    }
  }
  return nil;
}

- (void)willMoveToParentViewController:(UIViewController *)parent
{
  if (parent == nil) {
    id responder = [self findFirstResponder:self.view];
    if (responder != nil) {
      _previousFirstResponder = responder;
    }
  }
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  if (self.parentViewController == nil && self.presentingViewController == nil) {
    // screen dismissed, send event
    [((RNSScreenView *)self.view) notifyDismissed];
  }
}

- (void)notifyFinishTransitioning
{
  [_previousFirstResponder becomeFirstResponder];
  _previousFirstResponder = nil;
}

- (void)loadView
{
  if (_view != nil) {
    self.view = _view;
    _view = nil;
  }
}

@end

@implementation RNSScreenManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(active, BOOL)
RCT_EXPORT_VIEW_PROPERTY(animate, BOOL)
RCT_EXPORT_VIEW_PROPERTY(stackPresentation, RNSScreenStackPresentation)
RCT_EXPORT_VIEW_PROPERTY(onDismissed, RCTDirectEventBlock);

- (UIView *)view
{
  return [[RNSScreenView alloc] init];
}

@end

@implementation RCTConvert (RNSScreen)

RCT_ENUM_CONVERTER(RNSScreenStackPresentation, (@{
    @"push": @(RNSScreenStackPresentationPush),
    @"modal": @(RNSScreenStackPresentationModal),
    @"transparentModal": @(RNSScreenStackPresentationTransparentModal)
  }), RNSScreenStackPresentationPush, integerValue)

@end
