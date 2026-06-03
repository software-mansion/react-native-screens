#import "RNSInlineModalController.h"

@implementation RNSInlineModalController {
  CGRect _lastNotifiedFrame;
}

- (instancetype)init
{
  if (self = [super init]) {
    self.modalPresentationStyle = UIModalPresentationOverCurrentContext;
    self.modalTransitionStyle = UIModalTransitionStyleCrossDissolve;
  }
  return self;
}

- (void)loadView
{
  UIView *view = [[UIView alloc] init];
  view.backgroundColor = [UIColor clearColor];
  // Ensure the view stretches to fill the presentation context
  view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  self.view = view;
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  _lastNotifiedFrame = CGRectZero;
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  UIView *providerView = nil;
  if ([self.delegate respondsToSelector:@selector(providerViewForInlineModalController:)]) {
    providerView = [self.delegate providerViewForInlineModalController:self];
  }

  CGRect newFrame = [self.view convertRect:self.view.bounds toView:providerView];
  if (newFrame.size.width > 0 && newFrame.size.height > 0 && !CGRectEqualToRect(newFrame, _lastNotifiedFrame)) {
    _lastNotifiedFrame = newFrame;
    if ([self.delegate respondsToSelector:@selector(inlineModalControllerDidLayoutWithBounds:)]) {
      [self.delegate inlineModalControllerDidLayoutWithBounds:self.view.bounds];
    }
  }
}

@end
