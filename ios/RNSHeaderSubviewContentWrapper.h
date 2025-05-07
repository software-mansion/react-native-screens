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
                  receivedReactSize:(CGSize)reactSize;

@end

/**
 * Component view with layout managed by react-native. Notifies it's delegate on react-native driven layout changes.
 * Does not send notifications when frame is set by native layout.
 *
 * Note: this view assumes it is placed exactly at origin=(0, 0) relative to its parent in view hierarchy. It overrides
 * the frame received from React enforcing this "partial invariant". "Partial" - because in case it is laid natively it
 * just accepts given frame as is.
 */
@interface RNSHeaderSubviewContentWrapper : UIView <RCTComponentViewProtocol>

/**
 * Register delegate here, to get notifications when layout of this component changes.
 */
@property (nonatomic, nullable, weak) id<RNSHeaderSubviewContentWrapperDelegate> delegate;

@end

@interface RNSHeaderSubviewContentWrapperManager : RCTViewManager

@end

NS_ASSUME_NONNULL_END
