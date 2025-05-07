#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#else
#import <React/RCTShadowView.h>
#import <React/RCTViewManager.h>
#endif

#import <React/RCTConvert.h>
#import "RNSScreen.h"
#import "RNSScreenStackHeaderSubview.h"
#import "RNSSearchBar.h"

@interface NSString (RNSStringUtil)

+ (BOOL)rnscreens_isBlankOrNull:(nullable NSString *)string;

@end

@interface RNSScreenStackHeaderConfig :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    UIView
#endif

@property (nonatomic, weak) RNSScreenView *screenView;

#ifdef RCT_NEW_ARCH_ENABLED
@property (nonatomic) BOOL show;
#else
@property (nonatomic) BOOL hide;
#endif

NS_ASSUME_NONNULL_BEGIN

@property (nonatomic, retain) NSString *title;
@property (nonatomic, retain) NSString *titleFontFamily;
@property (nonatomic, retain) NSNumber *titleFontSize;
@property (nonatomic, retain) NSString *titleFontWeight;
@property (nonatomic, retain) UIColor *titleColor;
@property (nonatomic, retain) NSString *backTitle;
@property (nonatomic, retain) NSString *backTitleFontFamily;
@property (nonatomic, retain) NSNumber *backTitleFontSize;
@property (nonatomic, getter=isBackTitleVisible) BOOL backTitleVisible;
@property (nonatomic, retain) UIColor *backgroundColor;
@property (nonatomic, retain) UIColor *color;
@property (nonatomic) BOOL largeTitle;
@property (nonatomic, retain) NSString *largeTitleFontFamily;
@property (nonatomic, retain) NSNumber *largeTitleFontSize;
@property (nonatomic, retain) NSString *largeTitleFontWeight;
@property (nonatomic, retain) UIColor *largeTitleBackgroundColor;
@property (nonatomic) BOOL largeTitleHideShadow;
@property (nonatomic, retain) UIColor *largeTitleColor;
@property (nonatomic) BOOL hideBackButton;
@property (nonatomic) BOOL disableBackButtonMenu;
@property (nonatomic) BOOL hideShadow;
@property (nonatomic) BOOL translucent;
@property (nonatomic) BOOL backButtonInCustomView;
@property (nonatomic) UISemanticContentAttribute direction;
@property (nonatomic) UINavigationItemBackButtonDisplayMode backButtonDisplayMode;
@property (nonatomic) RNSBlurEffectStyle blurEffect;

NS_ASSUME_NONNULL_END

+ (void)willShowViewController:(nonnull UIViewController *)vc
                      animated:(BOOL)animated
                    withConfig:(nonnull RNSScreenStackHeaderConfig *)config;

/**
 * Returns true iff subview of given `type` is present.
 *
 *  **Please note that the subviews are not mounted under the header config in HostTree**
 * This method should serve only to check whether given subview type has been rendered.
 */
- (BOOL)hasSubviewOfType:(RNSScreenStackHeaderSubviewType)type;

/**
 * Returns `true` iff subview of type `left` is present.
 *
 *  **Please note that the subviews are not mounted under the header config in HostTree**
 * This method should serve only to check whether given subview type has been rendered.
 */
- (BOOL)hasSubviewLeft;

/**
 * Returns
 * - `YES` on Paper, when `self.hide == NO`
 * - `YES` on Fabric, when `self.show == YES`
 * - `NO` otherwise.
 *
 * Convenience method, so that we do not need ifdefs in every callsite.
 */
- (BOOL)shouldHeaderBeVisible;

/**
 * Returns `true` iff the applying this header config instance to a view controller will
 * result in visible back button if feasible.
 */
- (BOOL)shouldBackButtonBeVisibleInNavigationBar:(nullable UINavigationBar *)navBar;

#ifdef RCT_NEW_ARCH_ENABLED
/**
 * Allows to send information with size to the corresponding node in shadow tree.
 * This method updates state of header config shadow node only.
 */
- (void)updateShadowStateWithSize:(CGSize)size edgeInsets:(NSDirectionalEdgeInsets)edgeInsets;

/**
 * Updates state of header config shadow node and all subview shadow nodes in context of given UINavigationBar.
 * When `navBar == nil` this method does nothing.
 */
- (void)updateHeaderStateInShadowTreeInContextOfNavigationBar:(nullable UINavigationBar *)navBar;
#else
/**
 * Allows to send information with insets to the corresponding node in shadow tree.
 * Currently only horizontal insets are send through. Vertical ones are filtered out.
 */
- (void)updateHeaderConfigState:(NSDirectionalEdgeInsets)insets;
#endif

@end

@interface RNSScreenStackHeaderConfigManager : RCTViewManager

@end

#ifdef RCT_NEW_ARCH_ENABLED
#else

/**
 * Used as local data send to shadow view on Paper. This helps us to provide Yoga
 * with knowledge of native insets in the navigation bar.
 */
@interface RNSHeaderConfigInsetsPayload : NSObject

@property (nonatomic) NSDirectionalEdgeInsets insets;

- (instancetype)initWithInsets:(NSDirectionalEdgeInsets)insets NS_DESIGNATED_INITIALIZER;

@end

/**
 * Custom shadow view for header config. This is used on Paper to provide Yoga
 * with knowledge of native header insets (horizontal padding).
 */
@interface RNSScreenStackHeaderConfigShadowView : RCTShadowView

@end
#endif

@interface RCTConvert (RNSScreenStackHeader)

+ (UISemanticContentAttribute)UISemanticContentAttribute:(nonnull id)json;
+ (UINavigationItemBackButtonDisplayMode)UINavigationItemBackButtonDisplayMode:(nonnull id)json;

@end
