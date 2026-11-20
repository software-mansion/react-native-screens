#import "RNSSplitPlainColumnContentView.h"
#import "RNSSafeAreaViewNotifications.h"

@implementation RNSSplitPlainColumnContentView

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    // UINavigationController gives this mask to the view it wraps the view of its view controller in. Without it
    // that wrapper does not follow the navigation controller when it is resized off screen, as in a collapsed split
    // view, and the content of the column is shown with its old size.
    self.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  }
  return self;
}

#pragma mark - Layout

- (void)layoutSubviews
{
  [super layoutSubviews];
  [_delegate splitPlainColumnContentViewDidLayoutSubviews:self];
}

- (void)didMoveToWindow
{
  [super didMoveToWindow];
  [_delegate splitPlainColumnContentViewDidMoveToWindow];
}

#pragma mark - RNSSafeAreaProviding

- (UIEdgeInsets)providerSafeAreaInsets
{
  return self.safeAreaInsets;
}

- (void)dispatchSafeAreaDidChangeNotification
{
  [NSNotificationCenter.defaultCenter postNotificationName:RNSSafeAreaDidChange object:self userInfo:nil];
}

#pragma mark - RNSSafeAreaProviding related methods

// TODO: register for UIKeyboard notifications

- (void)safeAreaInsetsDidChange
{
  [super safeAreaInsetsDidChange];
  [self dispatchSafeAreaDidChangeNotification];
}

@end
