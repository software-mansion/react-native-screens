#pragma once

#import <React/RCTViewComponentView.h>
#import <React/RCTViewManager.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSScreenContainerDelegate

- (void)markChildUpdated;
- (void)updateContainer;

@end

@protocol RNSViewControllerDelegate

@end

@interface RNSViewController : UIViewController <RNSViewControllerDelegate>

- (UIViewController *)findActiveChildVC;

@end

@interface RNSScreenContainerManager : RCTViewManager

@end

@interface RNSScreenContainerView : RCTViewComponentView <RNSScreenContainerDelegate>

@property (nonatomic, retain) UIViewController *controller;
@property (nonatomic, retain) NSMutableArray *reactSubviews;

- (void)maybeDismissVC;

@end

NS_ASSUME_NONNULL_END
