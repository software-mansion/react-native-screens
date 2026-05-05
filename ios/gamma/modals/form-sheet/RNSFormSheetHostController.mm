#import "RNSFormSheetHostController.h"
#import "RNSFormSheetContentView.h"

#import <React/RCTAssert.h>

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

- (RNSFormSheetContentView *)contentView
{
  RCTAssert([self.view isKindOfClass:[RNSFormSheetContentView class]],
            @"[RNScreens] ContentView must be of type RNSFormSheetContentView");
  return (RNSFormSheetContentView *)self.view;
}

#pragma mark - UIKit callbacks

- (void)loadView
{
  self.view = [RNSFormSheetContentView new];
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

#pragma mark - UIAdaptivePresentationControllerDelegate

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
  [self.delegate sheetControllerDidNativeDismiss:self];
}

@end
