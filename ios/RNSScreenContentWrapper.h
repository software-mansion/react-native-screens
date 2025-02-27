#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>
#import "RNSDefines.h"

#if RCT_NEW_ARCH_ENABLED
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTView.h>
#endif // RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

@class RNSScreenContentWrapper;
@class RNS_REACT_SCROLL_VIEW_COMPONENT;

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

@property (nonatomic, nullable, weak) id<RNSScreenContentWrapperDelegate> delegate;

/**
 * Call this method to notify delegate with most recent frame set by React.
 */
- (void)triggerDelegateUpdate;

- (nullable RNS_REACT_SCROLL_VIEW_COMPONENT *)childRCTScrollViewComponent;

- (BOOL)coerceChildScrollViewComponentSizeToSize:(CGSize)size;

@end

@interface RNSScreenContentWrapperManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
