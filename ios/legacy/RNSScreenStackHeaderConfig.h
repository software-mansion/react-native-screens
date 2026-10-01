#pragma once

#if defined(__cplusplus)
#import <React/RCTConvert.h>
#endif // __cplusplus
#import "RNSDefines.h"
#import "RNSReactBaseView.h"
#import "RNSScreen.h"
#import "RNSScreenStackHeaderSubview.h"
#import "RNSSearchBar.h"

@interface NSString (RNSStringUtil)

+ (BOOL)rnscreens_isBlankOrNull:(nullable NSString *)string;

@end

@interface RNSScreenStackHeaderConfig : RNSReactBaseView

@property (nonatomic, weak) RNSScreenView *screenView;

@property (nonatomic) BOOL show;

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
@property (nonatomic, copy, nullable) NSArray<NSDictionary<NSString *, id> *> *headerRightBarButtonItems;
@property (nonatomic, copy, nullable) NSArray<NSDictionary<NSString *, id> *> *headerLeftBarButtonItems;
@property (nonatomic, readwrite) BOOL synchronousShadowStateUpdatesEnabled;

NS_ASSUME_NONNULL_END

+ (void)willShowViewController:(nonnull UIViewController *)vc
                      animated:(BOOL)animated
                    withConfig:(nonnull RNSScreenStackHeaderConfig *)config;

/**
 * Returns `YES` when screens in the legacy stack are always laid out under the navigation bar
 * (`edgesForExtendedLayout = UIRectEdgeAll`), also when the header is opaque. In that case the content is inset below
 * an opaque bar by the `SafeAreaView` rendered by `ScreenStackItem` (JS) and the screen's origin in the navigation
 * controller's view is always 0. Otherwise (iOS < 26, tvOS, visionOS) a screen with a visible, opaque header is laid
 * out below the bar (`UIRectEdgeAll - UIRectEdgeTop`).
 *
 * Keep in sync with `getSafeAreaEdges` in `src/legacy/components/ScreenStackItem.tsx`.
 */
+ (BOOL)screensExtendUnderOpaqueNavigationBar;

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
 * Returns `YES` when `self.show == YES`, `NO` otherwise.
 */
- (BOOL)shouldHeaderBeVisible;

/**
 * Returns `true` iff the applying this header config instance to a view controller will
 * result in visible back button if feasible.
 */
- (BOOL)shouldBackButtonBeVisibleInNavigationBar:(nullable UINavigationBar *)navBar;

/**
 * Allows to send information with size to the corresponding node in shadow tree.
 * This method updates state of header config shadow node only.
 */
- (void)updateShadowStateWithSize:(CGSize)size
                       edgeInsets:(NSDirectionalEdgeInsets)edgeInsets
                      frameOrigin:(CGPoint)frameOrigin;

/**
 * Updates state of header config shadow node and all subview shadow nodes in context of given UINavigationBar.
 * When `navBar == nil` this method does nothing.
 */
- (void)updateHeaderStateInShadowTreeInContextOfNavigationBar:(nullable UINavigationBar *)navBar;

#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
/**
 * Requests layout of all header subviews attached to the view hierarchy. Header subview updates its state in shadow
 * tree when it is laid out, therefore this method should be called when `navBar` lays out its subviews - the header
 * subviews are laid out later in the same layout pass, after UIKit has positioned the content of the navigation bar.
 * When the content of `navBar` is moved out of the bar (bar minimization on iOS 27+) this method does nothing.
 */
- (void)setNeedsLayoutForHeaderSubviewsInNavigationBar:(nonnull UINavigationBar *)navBar;
#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)

@end

#pragma mark - Experimental

@interface RNSScreenStackHeaderConfig ()

@property (nonatomic) UIUserInterfaceStyle userInterfaceStyle;

@end

#pragma mark - View Manager

#if defined(__cplusplus)
@interface RNSScreenStackHeaderConfigManager : RCTViewManager
#else
@interface RNSScreenStackHeaderConfigManager : NSObject
#endif // __cplusplus

@end
