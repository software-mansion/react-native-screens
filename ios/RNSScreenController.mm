#import "RNSScreenComponentView.h"

@implementation RNSScreenController {
  CGRect _lastViewFrame;
}

- (instancetype)initWithView:(UIView *)view
{
  if (self = [super init]) {
    self.view = view;
  }
  return self;
}

// TODO: Find out why this is executed when screen is going out
- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  [((RNSScreenComponentView *)self.view) notifyWillAppear];
}

- (void)viewWillDisappear:(BOOL)animated
{
  [super viewWillDisappear:animated];
  [((RNSScreenComponentView *)self.view) notifyWillDisappear];
}

- (void)viewDidAppear:(BOOL)animated
{
  [super viewDidAppear:animated];
  [((RNSScreenComponentView *)self.view) notifyAppear];
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [((RNSScreenComponentView *)self.view) notifyDisappear];
  if (self.parentViewController == nil && self.presentingViewController == nil) {
    // screen dismissed, send event
    [((RNSScreenComponentView *)self.view) notifyDismissedWithCount:1];
  }
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  BOOL isDisplayedWithinUINavController = [self.parentViewController isKindOfClass:[UINavigationController class]];
  if (isDisplayedWithinUINavController && !CGRectEqualToRect(_lastViewFrame, self.view.frame)) {
    _lastViewFrame = self.view.frame;
    auto viewIfLoaded = (RNSScreenComponentView *)self.viewIfLoaded;
    [viewIfLoaded updateBounds];
  }
}

@end
