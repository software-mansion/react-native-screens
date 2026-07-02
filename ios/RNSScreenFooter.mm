#import "RNSScreenFooter.h"
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import "RNSScreen.h"

// iOS implementation of the formSheet sheet footer (`unstable_sheetFooter`),
// mirroring the contract of Android's ScreenFooter:
//
//  - The footer overlays the sheet content and is pinned to the bottom edge of
//    the parent RNSScreenView. Consumers reserve space for it (if desired) by
//    padding their scroll content; the footer can also be used as a surface
//    for blur / scroll edge effects layered over the content.
//  - Yoga lays the footer out as a regular child of the Screen (full width,
//    height derived from its children, positioned in flow). We accept Yoga's
//    size but re-pin `origin.y` to the bottom of the parent after every layout
//    pass. Frames are used on purpose instead of Auto Layout constraints -
//    Fabric assigns frames directly and fights constraint-based positioning.
//    The pin is (re)applied from `updateLayoutMetrics:` (React-driven writes)
//    and from the parent screen's `layoutSubviews` (UIKit-driven writes,
//    including continuous resizes during interactive detent changes).
//  - When the keyboard overlaps the sheet, the footer is lifted above it,
//    animated with the keyboard's own duration & curve - the counterpart of
//    the WindowInsetsAnimationCompat callback in Android's ScreenFooter.

@implementation RNSScreenFooter {
  // Keyboard end frame in screen coordinates. CGRectNull when hidden.
  CGRect _keyboardFrameEnd;
}

- (instancetype)init
{
  if (self = [super init]) {
    self.translatesAutoresizingMaskIntoConstraints = false;
    _keyboardFrameEnd = CGRectNull;
#if !TARGET_OS_TV && !TARGET_OS_VISION
    NSNotificationCenter *center = [NSNotificationCenter defaultCenter];
    [center addObserver:self
               selector:@selector(keyboardWillChangeFrame:)
                   name:UIKeyboardWillChangeFrameNotification
                 object:nil];
    [center addObserver:self selector:@selector(keyboardWillHide:) name:UIKeyboardWillHideNotification object:nil];
#endif // !TARGET_OS_TV && !TARGET_OS_VISION
  }
  return self;
}

- (void)dealloc
{
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (nullable RNSScreenView *)screenView
{
  if ([self.superview isKindOfClass:RNSScreenView.class]) {
    return (RNSScreenView *)self.superview;
  }
  return nil;
}

#pragma mark - Positioning

- (CGFloat)keyboardOverlapWithParent:(UIView *)parent
{
  if (CGRectIsNull(_keyboardFrameEnd) || CGRectIsEmpty(_keyboardFrameEnd) || parent.window == nil) {
    return 0;
  }
  // Keyboard frames are delivered in screen coordinates; convert via the window.
  CGRect frameInWindow = [parent.window convertRect:_keyboardFrameEnd fromWindow:nil];
  CGRect frameInParent = [parent convertRect:frameInWindow fromView:parent.window];
  return MAX(0, CGRectGetMaxY(parent.bounds) - CGRectGetMinY(frameInParent));
}

- (void)updateFooterPosition
{
  UIView *parent = [self screenView] ?: self.superview;
  if (parent == nil) {
    return;
  }

  CGRect frame = self.frame;
  CGFloat targetY = parent.bounds.size.height - frame.size.height - [self keyboardOverlapWithParent:parent];
  // Never push the footer above the top of the sheet.
  targetY = MAX(0, targetY);

  if (fabs(frame.origin.y - targetY) < 0.5) {
    return;
  }
  frame.origin.y = targetY;
  self.frame = frame;

  if (self.onLayout != nil) {
    self.onLayout(self.frame);
  }
}

#pragma mark - UIView / Fabric lifecycle

- (void)didMoveToSuperview
{
  [super didMoveToSuperview];
  if (self.superview != nil) {
    [self updateFooterPosition];
  }
}

- (void)layoutSubviews
{
  [super layoutSubviews];
  [self updateFooterPosition];
}

- (void)updateLayoutMetrics:(const react::LayoutMetrics &)layoutMetrics
           oldLayoutMetrics:(const react::LayoutMetrics &)oldLayoutMetrics
{
  // Super applies Yoga's frame. Accept the size, then immediately re-pin to
  // the bottom edge of the parent screen.
  [super updateLayoutMetrics:layoutMetrics oldLayoutMetrics:oldLayoutMetrics];
  [self updateFooterPosition];
}

- (void)prepareForRecycle
{
  [super prepareForRecycle];
  _keyboardFrameEnd = CGRectNull;
}

#pragma mark - Keyboard

#if !TARGET_OS_TV && !TARGET_OS_VISION

- (void)keyboardWillChangeFrame:(NSNotification *)notification
{
  _keyboardFrameEnd = [notification.userInfo[UIKeyboardFrameEndUserInfoKey] CGRectValue];
  [self animateFooterWithKeyboardNotification:notification];
}

- (void)keyboardWillHide:(NSNotification *)notification
{
  _keyboardFrameEnd = CGRectNull;
  [self animateFooterWithKeyboardNotification:notification];
}

- (void)animateFooterWithKeyboardNotification:(NSNotification *)notification
{
  if (self.window == nil) {
    return;
  }
  NSTimeInterval duration = [notification.userInfo[UIKeyboardAnimationDurationUserInfoKey] doubleValue];
  UIViewAnimationCurve curve =
      (UIViewAnimationCurve)[notification.userInfo[UIKeyboardAnimationCurveUserInfoKey] integerValue];
  // UIKit may move / resize the whole sheet in response to the keyboard as
  // well; the parent's layoutSubviews re-pins the footer during that
  // animation, this block covers the keyboard-only part of the movement.
  [UIView animateWithDuration:duration
                        delay:0
                      options:(UIViewAnimationOptions)(curve << 16)
                   animations:^{
                     [self updateFooterPosition];
                   }
                   completion:nil];
}

#endif // !TARGET_OS_TV && !TARGET_OS_VISION

#pragma mark - Fabric registration

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSScreenFooterComponentDescriptor>();
}

Class<RCTComponentViewProtocol> RNSScreenFooterCls(void)
{
  return RNSScreenFooter.class;
}

#pragma mark - Dynamic frameworks support

// Needed because of this: https://github.com/facebook/react-native/pull/37274
#ifdef RCT_DYNAMIC_FRAMEWORKS
+ (void)load
{
  [super load];
}
#endif // RCT_DYNAMIC_FRAMEWORKS

@end

@implementation RNSScreenFooterManager

@end
