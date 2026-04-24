#import "RNSModalFormSheetController.h"

@interface RNSModalFormSheetController () <UIAdaptivePresentationControllerDelegate>
@end

@implementation RNSModalFormSheetController {
  CGSize _lastNotifiedSize;
}

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

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];
  [self layoutContentSubviews];

  CGSize newSize = self.view.bounds.size;
  if (newSize.width > 0 && newSize.height > 0 && !CGSizeEqualToSize(newSize, _lastNotifiedSize)) {
    _lastNotifiedSize = newSize;
    if ([self.delegate respondsToSelector:@selector(sheetControllerDidLayoutWithBounds:)]) {
      [self.delegate sheetControllerDidLayoutWithBounds:self.view.bounds];
    }
  }
}

- (void)layoutContentSubviews
{
  for (UIView *subview in self.view.subviews) {
    // This allows children (e.g., RCTViewComponentView) to take up the full bounds of the sheet
    // before Yoga fully processes the state update, mitigating brief rendering glitches.
    subview.frame = self.view.bounds;
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
