#import "RNSFormSheetHostController.h"

@interface RNSFormSheetHostController () <UIAdaptivePresentationControllerDelegate>
@end

@implementation RNSFormSheetHostController {
  CGRect _lastNotifiedFrame;
}

- (instancetype)init
{
  if (self = [super init]) {
    self.modalPresentationStyle = UIModalPresentationFormSheet;
  }
  return self;
}

- (void)resetState
{
  _lastNotifiedFrame = CGRectZero;
}

- (void)loadView
{
  UIView *view = [UIView new];
  view.backgroundColor = [UIColor clearColor];
  self.view = view;
}

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  self.presentationController.delegate = self;
}

- (void)viewDidDisappear:(BOOL)animated
{
  [super viewDidDisappear:animated];
  [self resetState];
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  CGRect newFrame = [self.view convertRect:self.view.bounds toView:nil];

  if (newFrame.size.width > 0 && newFrame.size.height > 0 && !CGRectEqualToRect(newFrame, _lastNotifiedFrame)) {
    _lastNotifiedFrame = newFrame;

    [self.delegate sheetControllerViewDidLayoutSubviews:self];
  }
}

#pragma mark - RN Subviews Management

- (void)insertReactSubview:(UIView *)subview atIndex:(NSInteger)index
{
  [self.view insertSubview:subview atIndex:index];
}

- (void)removeReactSubview:(UIView *)subview
{
  [subview removeFromSuperview];
}

#pragma mark - UIAdaptivePresentationControllerDelegate

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
  [self.delegate sheetControllerDidDismiss:self];
}

@end
