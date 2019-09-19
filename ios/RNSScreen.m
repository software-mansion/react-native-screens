#import <UIKit/UIKit.h>

#import "RNSScreen.h"
#import "RNSScreenContainer.h"

#import <React/RCTUIManager.h>
#import <React/RCTShadowView.h>
#import <React/RCTTouchHandler.h>

@interface RNSScreenFrameData : NSObject
@property (nonatomic, readonly) CGFloat rightInset;
@property (nonatomic, readonly) CGFloat topInset;
@property (nonatomic, readonly) CGFloat bottomInset;
@property (nonatomic, readonly) CGFloat leftInset;
@property (nonatomic, readonly) CGFloat navbarOffset;

- (instancetype)initWithInsets:(UIEdgeInsets)insets;

@end

@implementation RNSScreenFrameData

- (instancetype)initWithInsets:(UIEdgeInsets)insets andNavbarOffset:(CGFloat)navbarOffset
{
  if (self = [super init]) {
    _topInset = insets.top;
    _bottomInset = insets.bottom;
    _leftInset = insets.left;
    _rightInset = insets.right;
    _navbarOffset = navbarOffset;
  }
  return self;
}

@end

@interface RNSScreen : UIViewController

- (instancetype)initWithView:(UIView *)view;
- (void)notifyFinishTransitioning;

@end

@interface RNSScreenView()

@property (nonatomic, assign) UIPopoverArrowDirection realPopoverPermittedArrowDirections;

@end

@implementation RNSScreenView {
  __weak RCTBridge *_bridge;
  RNSScreen *_controller;
  BOOL _invalidated;
  NSMapTable *_touchHandlers;
}

@synthesize controller = _controller;

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super init]) {
    _bridge = bridge;
    _controller = [[RNSScreen alloc] initWithView:self];
    _controller.modalPresentationStyle = UIModalPresentationOverCurrentContext;
    _stackPresentation = RNSScreenStackPresentationPush;
    _stackAnimation = RNSScreenStackAnimationDefault;
    _touchHandlers = [NSMapTable weakToStrongObjectsMapTable];
    _realPopoverPermittedArrowDirections = UIPopoverArrowDirectionAny;
  }
  return self;
}

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)atIndex {
  [super insertReactSubview:subview atIndex:atIndex];
  
  RCTTouchHandler *touchHandler = [_touchHandlers objectForKey:subview];
  if (touchHandler == nil) {
    touchHandler = [[RCTTouchHandler alloc] initWithBridge:_bridge];
    [touchHandler attachToView:subview];
    [_touchHandlers setObject:touchHandler forKey:subview];
  }
}

- (void)removeReactSubview:(UIView *)subview {
  [super removeReactSubview:subview];
  RCTTouchHandler *touchHandler = [_touchHandlers objectForKey:subview];
  if (touchHandler != nil) {
    [touchHandler detachFromView:subview];
    [_touchHandlers removeObjectForKey:subview];
  }
}

- (void)updateBounds
{
  CGFloat navbarOffset = 0;
  UINavigationController *navctr = self.controller.navigationController;
  if (!navctr.isNavigationBarHidden && !navctr.navigationBar.isTranslucent) {
    CGRect navbarFrame = navctr.navigationBar.frame;
    navbarOffset = navbarFrame.origin.y + navbarFrame.size.height;
  }

  [_bridge.uiManager
   setLocalData:[[RNSScreenFrameData alloc]
                 initWithInsets:UIEdgeInsetsZero
                 andNavbarOffset:navbarOffset]
   forView:self];
}

#pragma mark - Setter

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

- (void)setStackPresentation:(RNSScreenStackPresentation)stackPresentation
{
  _stackPresentation = stackPresentation;
  switch (stackPresentation) {
    case RNSScreenStackPresentationModal:
      _controller.modalPresentationStyle = UIModalPresentationCurrentContext;
      break;
    case RNSScreenStackPresentationTransparentModal:
      _controller.modalPresentationStyle = UIModalPresentationOverCurrentContext;
      break;
    case RNSScreenStackPresentationPopover:
      _controller.modalPresentationStyle = UIModalPresentationPopover;
      break;
  }
}

- (void)setPopoverPermittedArrowDirections:(NSArray *)popoverPermittedArrowDirections
{
  if (popoverPermittedArrowDirections.count == 0 || [_popoverPermittedArrowDirections isEqualToArray:popoverPermittedArrowDirections]) {
    return;
  }
  _popoverPermittedArrowDirections = popoverPermittedArrowDirections;
  
  UIPopoverArrowDirection permittedArrowDirections = 0;
  for (NSString *direction in popoverPermittedArrowDirections) {
    if ([direction isEqualToString:@"up"]) {
      permittedArrowDirections |= UIPopoverArrowDirectionUp;
    } else if ([direction isEqualToString:@"down"]) {
      permittedArrowDirections |= UIPopoverArrowDirectionDown;
    } else if ([direction isEqualToString:@"left"]) {
      permittedArrowDirections |= UIPopoverArrowDirectionLeft;
    } else if ([direction isEqualToString:@"right"]) {
      permittedArrowDirections |= UIPopoverArrowDirectionRight;
    }
  }
  _realPopoverPermittedArrowDirections = permittedArrowDirections;
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

@interface RNSScreenShadowView : RCTShadowView
@end

@implementation RNSScreenShadowView

- (void)setLocalData:(RNSScreenFrameData *)data
{
  self.paddingTop = (YGValue){data.topInset, YGUnitPoint};
  self.paddingBottom = (YGValue){data.bottomInset, YGUnitPoint};
  self.paddingLeft = (YGValue){data.leftInset, YGUnitPoint};
  self.paddingRight = (YGValue){data.rightInset, YGUnitPoint};
  self.top = (YGValue){data.navbarOffset, YGUnitPoint};
  [self didSetProps:@[@"paddingTop", @"paddingBottom", @"paddingLeft", @"paddingRight", @"top"]];
}

@end

@implementation RNSScreenManager

RCT_EXPORT_MODULE()

RCT_EXPORT_VIEW_PROPERTY(active, BOOL)
RCT_EXPORT_VIEW_PROPERTY(stackPresentation, RNSScreenStackPresentation)
RCT_EXPORT_VIEW_PROPERTY(stackAnimation, RNSScreenStackAnimation)
RCT_EXPORT_VIEW_PROPERTY(popoverSourceViewNativeID, NSString)
RCT_EXPORT_VIEW_PROPERTY(popoverSourceRect, CGRect)
RCT_EXPORT_VIEW_PROPERTY(popoverPermittedArrowDirections, NSArray)
RCT_EXPORT_VIEW_PROPERTY(preferredContentSize, CGSize)
RCT_EXPORT_VIEW_PROPERTY(onDismissed, RCTDirectEventBlock)

- (UIView *)view
{
  return [[RNSScreenView alloc] initWithBridge:self.bridge];
}

- (RCTShadowView *)shadowView
{
  return [RNSScreenShadowView new];
}

@end

@implementation RCTConvert (RNSScreen)

RCT_ENUM_CONVERTER(RNSScreenStackPresentation, (@{
                                                  @"push": @(RNSScreenStackPresentationPush),
                                                  @"modal": @(RNSScreenStackPresentationModal),
                                                  @"transparentModal": @(RNSScreenStackPresentationTransparentModal),
                                                  @"popover": @(RNSScreenStackPresentationPopover)
                                                  }), RNSScreenStackPresentationPush, integerValue)

RCT_ENUM_CONVERTER(RNSScreenStackAnimation, (@{
                                                  @"default": @(RNSScreenStackAnimationDefault),
                                                  @"none": @(RNSScreenStackAnimationNone),
                                                  @"fade": @(RNSScreenStackAnimationFade)
                                                  }), RNSScreenStackAnimationDefault, integerValue)

@end
