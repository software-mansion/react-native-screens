#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>

#if RCT_NEW_ARCH_ENABLED
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTView.h>
#endif // RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

@class RNSScreenContentWrapper;

@protocol RNSScreenContentWrapperDelegate <NSObject>

/**
 * Called by the content wrapper on a delegate when React Native updates the layout.
 */
- (void)contentWrapper:(RNSScreenContentWrapper *)contentWrapper receivedReactFrame:(CGRect)reactFrame;

@end

@interface RNSScreenContentWrapper :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    RCTView
#endif

/**
 * Call this method to notify delegate with most recent frame set by React.
 */
- (void)triggerDelegateUpdate;

@property (nonatomic, nullable, weak) id<RNSScreenContentWrapperDelegate> delegate;

@end

@interface RNSScreenContentWrapperManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
