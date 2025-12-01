#pragma once

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTViewComponentView.h>
#endif

#import <React/RCTConvert.h>
#import <React/RCTViewManager.h>
#import "RNSEnums.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSScreenStackHeaderSubview :
#ifdef RCT_NEW_ARCH_ENABLED
    RCTViewComponentView
#else
    UIView
#endif

@property (nonatomic) RNSScreenStackHeaderSubviewType type;
@property (nonatomic, readwrite) BOOL synchronousShadowStateUpdatesEnabled;

@property (nonatomic, weak) UIView *reactSuperview;

#ifdef RCT_NEW_ARCH_ENABLED
/**
 * Updates state of the header subview shadow node in shadow tree.
 * This method updates state of header subview shadow node only.
 */
- (void)updateShadowStateWithFrame:(CGRect)frame;

/**
 * Updates state of the header subview shadow node in shadow tree in context of given ancestor view.
 * This method updates state of header subview shadow node only.
 *
 * @param ancestorView - ancestor view in relation to which, the frame send in state update is computed; if this is
 * `nil` the method does nothing.
 */
- (void)updateShadowStateInContextOfAncestorView:(nullable UIView *)ancestorView;

/**
 * Updates state of the header subview shadow node in shadow tree in context of given ancestor view.
 * This method updates state of header subview shadow node only.
 *
 * @param ancestorView ancestor view in relation to which, the frame send in state update is computed; if this is
 * `nil` the method does nothing.
 * @param frame source frame, which will be transformed in relation to `ancestorView`.
 */
- (void)updateShadowStateInContextOfAncestorView:(nullable UIView *)ancestorView withFrame:(CGRect)frame;
#endif

- (UIBarButtonItem *)getUIBarButtonItem;

@end

@interface RNSScreenStackHeaderSubviewManager : RCTViewManager

@property (nonatomic) RNSScreenStackHeaderSubviewType type;

@end

@interface RCTConvert (RNSScreenStackHeaderSubview)

+ (RNSScreenStackHeaderSubviewType)RNSScreenStackHeaderSubviewType:(id)json;

@end

NS_ASSUME_NONNULL_END
