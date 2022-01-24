#import "RNSScreenComponentView.h"

@implementation RNSScreenController {
    CGRect _lastViewFrame;
    UIView* _initialView;
}

- (instancetype)initWithView:(UIView *)view
{
  if (self = [super init]) {
    self.view = view;
    _initialView = view;
  }
  return self;
}

- (void)setViewToSnapshot
{
  UIView* snapshot = [self.view snapshotViewAfterScreenUpdates:NO];
  [self.view removeFromSuperview];
  self.view = snapshot;
}

- (void)resetViewToScreen
{
  [self.view removeFromSuperview];
  self.view=_initialView;
}

// TODO: Find out why this is executed when screen is going out
- (void)viewWillAppear:(BOOL)animated
{
  if([self.view isKindOfClass:[RNSScreenComponentView class]]){
    [super viewWillAppear:animated];
    [((RNSScreenComponentView *)self.view) notifyWillAppear];
  }
}

- (void)viewWillDisappear:(BOOL)animated
{
  if([self.view isKindOfClass:[RNSScreenComponentView class]]){
    [super viewWillDisappear:animated];
    [((RNSScreenComponentView *)self.view) notifyWillDisappear];
  }
}

- (void)viewDidAppear:(BOOL)animated
{
  if([self.view isKindOfClass:[RNSScreenComponentView class]]){
    [super viewDidAppear:animated];
    [((RNSScreenComponentView *)self.view) notifyAppear];
  }
}

- (void)viewDidDisappear:(BOOL)animated
{
  if([self.view isKindOfClass:[RNSScreenComponentView class]]){
    [super viewDidDisappear:animated];
    [((RNSScreenComponentView *)self.view) notifyDisappear];
    if (self.parentViewController == nil && self.presentingViewController == nil) {
      // screen dismissed, send event
      [((RNSScreenComponentView *)self.view) notifyDismissedWithCount:1];
    }
  }
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];
  if([self.view isKindOfClass:[RNSScreenComponentView class]]){
    BOOL isDisplayedWithinUINavController =
        [self.parentViewController isKindOfClass:[UINavigationController class]];
    if ((isDisplayedWithinUINavController) &&
        !CGRectEqualToRect(_lastViewFrame, self.view.frame)) {
          _lastViewFrame = self.view.frame;
          auto viewIfLoaded = (RNSScreenComponentView*)self.viewIfLoaded;
          [viewIfLoaded updateBounds];
    }
  }
}

@end
