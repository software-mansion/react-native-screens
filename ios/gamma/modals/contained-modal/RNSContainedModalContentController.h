#pragma once

#import <UIKit/UIKit.h>
#import "RNSContainedModalProviders.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSContainedModalContentView;
@class RNSContainedModalContentController;

@protocol RNSContainedModalContentControllerDelegate <NSObject>
- (void)modalControllerViewDidLayoutSubviews:(RNSContainedModalContentController *)controller;
- (void)modalControllerViewDidDisappear:(RNSContainedModalContentController *)controller;
@end

@interface RNSContainedModalContentController : UIViewController

@property (nonatomic, weak, nullable) id<RNSContainedModalContentControllerDelegate> delegate;

@property (nonatomic, weak, nullable) id<RNSContainedModalPresentationProvider> presentationProvider;

@property (nonatomic, readonly, nonnull) RNSContainedModalContentView *contentView;

#pragma mark - Signals

- (void)setNeedsPresentationUpdate;

#pragma mark - Updates

- (void)flushPendingUpdates;

@end

NS_ASSUME_NONNULL_END
