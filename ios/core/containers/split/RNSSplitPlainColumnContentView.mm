#import "RNSSplitPlainColumnContentView.h"
#import "RNSSafeAreaViewNotifications.h"

@implementation RNSSplitPlainColumnContentView

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
