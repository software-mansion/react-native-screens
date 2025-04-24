#import <React/RCTViewManager.h>
#import <UIKit/UIKit.h>
#import "RCTViewComponentView.h"

#if RCT_NEW_ARCH_ENABLED
#import <React/RCTFabricComponentsPlugins.h>
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTView.h>
#endif // RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

@class RNSHeaderSubviewContentWrapper;

@protocol RNSHeaderSubviewContentWrapperDelegate <NSObject>

/**
 * Called by the content wrapper on a delegate when React Native updates the layout.
 */
- (void)headerSubviewContentWrapper:(RNSHeaderSubviewContentWrapper *)contentWrapper
                 receivedReactFrame:(CGRect)reactFrame
                          didChange:(BOOL)frameChanged;

@end

/**
 * Component view with layout managed by react-native. Notifies it's delegate on react-native driven layout changes.
 * Does not send notifications when frame is set by native layout.
 */
@interface RNSHeaderSubviewContentWrapper : RCTViewComponentView

/**
 * Register delegate here, to get notifications when layout of this component changes.
 */
@property (nonatomic, nullable, weak) id<RNSHeaderSubviewContentWrapperDelegate> delegate;

@end

@interface RNSHeaderSubviewContentWrapperManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
