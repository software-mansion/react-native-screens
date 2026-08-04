#pragma once

#if defined(__cplusplus)
#import <React/RCTViewManager.h>
#endif // __cplusplus
#import <UIKit/UIKit.h>
#import "RNSDefines.h"
#import "RNSReactBaseView.h"

#if defined(__cplusplus)
#import <React/RCTFabricComponentsPlugins.h>
#endif // __cplusplus

NS_ASSUME_NONNULL_BEGIN

@class RNSScreenContentWrapper;
@class RCTScrollViewComponentView;

@protocol RNSScreenContentWrapperDelegate <NSObject>

/**
 * Called by the content wrapper on a delegate when React Native updates the layout.
 */
- (void)contentWrapper:(RNSScreenContentWrapper *)contentWrapper receivedReactFrame:(CGRect)reactFrame;

@end

typedef struct {
  RCTScrollViewComponentView *scrollViewComponent;
  UIView *contentContainerView;
} RNSScrollViewSearchResult;

@interface RNSScreenContentWrapper : RNSReactBaseView

@property (nonatomic, nullable, weak) id<RNSScreenContentWrapperDelegate> delegate;

/**
 * Call this method to notify delegate with most recent frame set by React.
 */
- (void)triggerDelegateUpdate;

- (RNSScrollViewSearchResult)childRCTScrollViewComponentAndContentContainer;

- (BOOL)coerceChildScrollViewComponentSizeToSize:(CGSize)size;

@end

#if defined(__cplusplus)
@interface RNSScreenContentWrapperManager : RCTViewManager
#else
@interface RNSScreenContentWrapperManager : NSObject
#endif // __cplusplus

@end

NS_ASSUME_NONNULL_END
