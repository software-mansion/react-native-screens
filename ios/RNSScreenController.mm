#import <react/renderer/components/rnscreens/RCTComponentViewHelpers.h>
#import "RNSScreenComponentView.h"

@implementation RNSScreenController {
  RNSScreenComponentView *_initialView;
}

- (instancetype)initWithView:(UIView *)view
{
  if (self = [super init]) {
    self.view = view;
    if ([view isKindOfClass:[RNSScreenComponentView class]]) {
      _initialView = (RNSScreenComponentView *)view;
    } else {
      RCTLogError(@"ScreenController can only be initialized with ScreenComponentView");
    }
  }
  return self;
}

- (void)setViewToSnapshot:(UIView *)snapshot
{
  [self.view removeFromSuperview];
  self.view = snapshot;
}

- (void)resetViewToScreen
{
  [self.view removeFromSuperview];
  self.view = _initialView;
}

// TODO: Find out why this is executed when screen is going out
- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [_initialView notifyWillAppear];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  [_initialView notifyWillDisappear];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  [_initialView notifyAppear];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [_initialView notifyDisappear];
  if (self.parentViewController == nil && self.presentingViewController == nil) {
    // screen dismissed, send event
    [_initialView notifyDismissedWithCount:1];
  }
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];
  BOOL isDisplayedWithinUINavController = [self.parentViewController isKindOfClass:[UINavigationController class]];
  if (isDisplayedWithinUINavController) {
    [_initialView updateBounds];
  }
}

@end
