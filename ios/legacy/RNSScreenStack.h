#pragma once

#import "RNSReactBaseView.h"
#import "RNSScreenContainer.h"
#import "RNSTabsSpecialEffectsSupporting.h"

#if !TARGET_OS_TV
#import "RNSOrientationProviding.h"
#endif // !TARGET_OS_TV

NS_ASSUME_NONNULL_BEGIN

/**
 * Returns whether the navigation controller currently uses right-to-left layout.
 */
NS_INLINE BOOL RNSNavigationControllerIsRTL(UINavigationController *_Nullable navigationController)
{
  if (navigationController == nil) {
    return NO;
  }

  UISemanticContentAttribute semanticContentAttribute = navigationController.view.semanticContentAttribute;
  if (semanticContentAttribute == UISemanticContentAttributeForceRightToLeft) {
    return YES;
  }
  if (semanticContentAttribute == UISemanticContentAttributeForceLeftToRight) {
    return NO;
  }
  return navigationController.traitCollection.layoutDirection == UITraitEnvironmentLayoutDirectionRightToLeft;
}

@interface RNSNavigationController : UINavigationController <RNSViewControllerDelegate,
                                                             RNSTabsSpecialEffectsSupporting
#if !TARGET_OS_TV
                                                             ,
                                                             RNSOrientationProviding
#endif // !TARGET_OS_TV
                                                             >

@end

@interface RNSScreenStackView : RNSReactBaseView <RNSScreenContainerDelegate>

- (void)markChildUpdated;
- (void)didUpdateChildren;
- (void)startScreenTransition;
- (void)updateScreenTransition:(double)progress;
- (void)finishScreenTransition:(BOOL)canceled;

@property (nonatomic) BOOL customAnimation;
@property (nonatomic) BOOL disableSwipeBack;

@end

#pragma mark-- Integration

@interface RNSScreenStackView ()

/**
 * \return Arrray with ids of screens owned by this stack. Ids are returned in no particular order. The list might be
 * empty. The strings inside the list are nullable if the screen has not been assigned an ID.
 */
@property (nonatomic, readonly, nonnull) NSArray<NSString *> *screenIds;

@property (nonatomic, strong, readonly, nullable) UIColor *nativeContainerBackgroundColor;

@end

#if defined(__cplusplus)
@interface RNSScreenStackManager : RCTViewManager
#else
@interface RNSScreenStackManager : NSObject
#endif // __cplusplus

@end

NS_ASSUME_NONNULL_END
