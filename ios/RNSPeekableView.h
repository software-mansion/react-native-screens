#import <React/RCTViewManager.h>
#import "RNSScreenContainer.h"
#import <React/RCTView.h>

@class RNPreviewViewController;

@interface RNSPeekableWrapper : RCTView <RCTInvalidating>;

@property (nonatomic, copy) UIViewController *screenController;
@property (nonatomic, copy) RNPreviewViewController *previewController;
@property (nonatomic, copy) RCTDirectEventBlock onPop;
@property (nonatomic, copy) RCTDirectEventBlock onPeek;
@property (nonatomic, copy) RCTDirectEventBlock onAction;
@property (nonatomic, copy) RCTDirectEventBlock onDisappear;
@property (nonatomic, copy) NSArray *actionsForPreviewing;

- (instancetype)initWithUIManager:(RCTUIManager *)uiManager;

@end

@interface RNPreviewViewController : UIViewController

- (instancetype)initWithWrapper:(RNSPeekableWrapper *) wrapper;

@end

@interface RNSPeekableView : RCTViewManager

@end
