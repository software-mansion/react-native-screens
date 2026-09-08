#pragma once

#if defined(__cplusplus)
#import <React/RCTViewManager.h>
#endif // __cplusplus
#import "RNSReactBaseView.h"

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

#if defined(__cplusplus)
@interface RNSScreenContainerManager : RCTViewManager
#else
@interface RNSScreenContainerManager : NSObject
#endif // __cplusplus

@end

@interface RNSScreenContainerView : RNSReactBaseView <RNSScreenContainerDelegate>

@property (nonatomic, retain) UIViewController *controller;
@property (nonatomic, retain) NSMutableArray *reactSubviews;

- (void)maybeDismissVC;

@end

NS_ASSUME_NONNULL_END
