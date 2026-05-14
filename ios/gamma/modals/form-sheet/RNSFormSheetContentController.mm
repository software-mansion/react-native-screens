#import "RNSFormSheetContentController.h"
#import "RNSFormSheetContentView.h"

#import <React/RCTAssert.h>

@interface RNSFormSheetContentController () <UIAdaptivePresentationControllerDelegate
#if !TARGET_OS_TV
                                             ,
                                             UISheetPresentationControllerDelegate
#endif // !TARGET_OS_TV
                                             >
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

#pragma mark - Presentation Setup

- (void)prepareForPresentation
{
  // The presentation controller is recreated by UIKit on every present/dismiss cycle.
  // We must assign this delegate before actual presentation
  self.presentationController.delegate = self;
#if !TARGET_OS_TV
  self.sheetPresentationController.delegate = self;
#endif // !TARGET_OS_TV
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

#if !TARGET_OS_TV
#pragma mark - UISheetPresentationControllerDelegate

- (void)sheetPresentationControllerDidChangeSelectedDetentIdentifier:
    (UISheetPresentationController *)sheetPresentationController
{
  [self.delegate sheetController:self didChangeDetentIdentifier:sheetPresentationController.selectedDetentIdentifier];
}
#endif // !TARGET_OS_TV

@end
