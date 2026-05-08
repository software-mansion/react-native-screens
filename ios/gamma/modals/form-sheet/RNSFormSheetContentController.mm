#import "RNSFormSheetContentController.h"
#import "RNSFormSheetContentView.h"

#import <React/RCTAssert.h>

@interface RNSFormSheetContentController () <UIAdaptivePresentationControllerDelegate>
@end

@implementation RNSFormSheetContentController

- (instancetype)init
{
  if (self = [super init]) {
    self.modalPresentationStyle = UIModalPresentationFormSheet;
    self.presentationController.delegate = self;
  }
  return self;
}

- (RNSFormSheetContentView *)contentView
{
  RCTAssert([self.view isKindOfClass:[RNSFormSheetContentView class]],
            @"[RNScreens] ContentView must be of type RNSFormSheetContentView");
  return static_cast<RNSFormSheetContentView *>(self.view);
}

#pragma mark - UIKit callbacks

- (void)loadView
{
  self.view = [RNSFormSheetContentView new];
}

- (void)viewDidLayoutSubviews
{
  [super viewDidLayoutSubviews];

  [self.delegate sheetControllerViewDidLayoutSubviews:self];
}

#pragma mark - UIAdaptivePresentationControllerDelegate

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
  [self.delegate sheetControllerDidNativeDismiss:self];
}

@end
