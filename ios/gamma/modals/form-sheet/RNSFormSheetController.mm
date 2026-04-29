#import "RNSFormSheetController.h"

@interface RNSFormSheetController () <UIAdaptivePresentationControllerDelegate>
@end

@implementation RNSFormSheetController {
  CGSize _lastNotifiedSize;
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
  _lastNotifiedSize = CGSizeZero;
}

- (void)loadView
{
  UIView *view = [[UIView alloc] init];
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
  [self resetState];
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  CGSize newSize = self.view.bounds.size;
  if (newSize.width > 0 && newSize.height > 0 && !CGSizeEqualToSize(newSize, _lastNotifiedSize)) {
    _lastNotifiedSize = newSize;
    if ([self.delegate respondsToSelector:@selector(sheetControllerDidLayoutWithBounds:)]) {
      [self.delegate sheetControllerDidLayoutWithBounds:self.view.bounds];
    }
  }
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
