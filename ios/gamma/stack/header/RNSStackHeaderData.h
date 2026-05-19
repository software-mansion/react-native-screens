#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderData : NSObject

#pragma mark - Navigation Item props

@property (nonatomic, copy, readonly, nullable) NSString *title;
@property (nonatomic, copy, readonly, nullable) NSString *subtitle;
@property (nonatomic, copy, readonly, nullable) NSString *screenKey;
@property (nonatomic, copy, readonly, nullable) NSArray<UIBarButtonItem *> *leadingBarButtonItems;
@property (nonatomic, copy, readonly, nullable) NSArray<UIBarButtonItem *> *trailingBarButtonItems;

/*
 * Custom views for title/subtitle/largeSubtitle placements.
 * When non-nil, these take precedence over string-based title props.
 */
@property (nonatomic, strong, readonly, nullable) UIView *titleView;
@property (nonatomic, strong, readonly, nullable) UIView *subtitleView;
@property (nonatomic, strong, readonly, nullable) UIView *largeSubtitleView;

#pragma mark - Navigation Bar props

@property (nonatomic, readonly) BOOL hidden;
@property (nonatomic, copy, readonly, nullable) NSString *largeTitle;
@property (nonatomic, copy, readonly, nullable) NSString *largeSubtitle;
@property (nonatomic, readonly) BOOL largeTitleEnabled;

- (instancetype)initWithTitle:(nullable NSString *)title
                     subtitle:(nullable NSString *)subtitle
                    screenKey:(nullable NSString *)screenKey
                       hidden:(BOOL)hidden
                   largeTitle:(nullable NSString *)largeTitle
                largeSubtitle:(nullable NSString *)largeSubtitle
            largeTitleEnabled:(BOOL)largeTitleEnabled
        leadingBarButtonItems:(nullable NSArray<UIBarButtonItem *> *)leadingBarButtonItems
       trailingBarButtonItems:(nullable NSArray<UIBarButtonItem *> *)trailingBarButtonItems
                    titleView:(nullable UIView *)titleView
                 subtitleView:(nullable UIView *)subtitleView
            largeSubtitleView:(nullable UIView *)largeSubtitleView;

@end

NS_ASSUME_NONNULL_END
