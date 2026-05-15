#import "RNSFormSheetContentController.h"
#import "RNSFormSheetContentView.h"
#import "RNSPresentationSourceProvider.h"

#import <React/RCTAssert.h>
#import <React/RCTLog.h>

@interface RNSFormSheetContentController () <UIAdaptivePresentationControllerDelegate>
@end

@implementation RNSFormSheetContentController

- (instancetype)init
{
  if (self = [super init]) {
    self.modalPresentationStyle = UIModalPresentationFormSheet;
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

#pragma mark - Presentation

- (void)prepareForPresentation
{
  // The presentation controller is recreated by UIKit on every present/dismiss cycle.
  // We must assign this delegate before actual presentation
  self.presentationController.delegate = self;
}

// TODO: @t0maboro - This presentation logic is currently quite primitive.
// We are not entirely safe from rapid conflicting updates, and there are edge cases
// where the presentation state might become desynchronized. Addressing this robustly
// might require an approach similar to the tabs implementation using state provenance,
// which will be handled separately.
// Followup ticket: https://github.com/software-mansion/react-native-screens-labs/issues/1420
- (void)presentFromWindow:(nullable UIWindow *)window
{
  if (window == nil) {
    return;
  }
  if (self.presentingViewController != nil) {
    return;
  }

  UIViewController *presentationSourceViewController =
      [RNSPresentationSourceProvider findViewControllerForPresentationInWindow:window];
  if (presentationSourceViewController == nil) {
    RCTLogError(
        @"[RNScreens] Failed to present form sheet: The source view controller cannot be found for target window.");
    return;
  }

  [self prepareForPresentation];
  [presentationSourceViewController presentViewController:self animated:YES completion:nil];
}

- (void)dismiss
{
  if (self.presentingViewController == nil) {
    return;
  }
  [self dismissViewControllerAnimated:YES completion:nil];
}

#pragma mark - UIAdaptivePresentationControllerDelegate

- (void)presentationControllerDidDismiss:(UIPresentationController *)presentationController
{
  [self.delegate sheetControllerDidNativeDismiss:self];
}

@end
