#import "RNSModalFormSheetController.h"

@interface RNSModalFormSheetController () <UIAdaptivePresentationControllerDelegate>
@end

@implementation RNSModalFormSheetController

- (instancetype)init
{
  if (self = [super init]) {
    self.modalPresentationStyle = UIModalPresentationFormSheet;
  }
  return self;
}

- (void)loadView
{
  UIView *view = [[UIView alloc] init];
  view.backgroundColor = [UIColor systemBackgroundColor];
  self.view = view;
}

- (void)viewWillAppear:(BOOL)animated
{
  [super viewWillAppear:animated];
  self.presentationController.delegate = self;
}

- (void)updateContentSubviews:(NSArray<UIView *> *)subviews
{
  for (UIView *view in self.view.subviews) {
    [view removeFromSuperview];
  }

  for (UIView *view in subviews) {
    [self.view addSubview:view];
  }
}

#pragma mark - UIAdaptivePresentationControllerDelegate

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
  if ([self.delegate respondsToSelector:@selector(sheetControllerDidDismiss:)]) {
    [self.delegate sheetControllerDidDismiss:self];
  }
}

@end
