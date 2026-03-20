#pragma once

#import <React/RCTViewManager.h>

#if defined(__cplusplus)
#import <React/RCTViewComponentView.h>
#endif // __cplusplus

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

#if defined(__cplusplus)
@interface RNSScreenContainerView : RCTViewComponentView <RNSScreenContainerDelegate>
#else
@interface RNSScreenContainerView : UIView <RNSScreenContainerDelegate>
#endif // __cplusplus

@property (nonatomic, retain) UIViewController *controller;
@property (nonatomic, retain) NSMutableArray *reactSubviews;

- (void)maybeDismissVC;

@end

NS_ASSUME_NONNULL_END
