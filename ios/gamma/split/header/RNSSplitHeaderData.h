#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSSplitHeaderData : NSObject

#pragma mark - Navigation Item props

@property (nonatomic, copy, readonly, nullable) NSString *title;
@property (nonatomic, copy, readonly, nullable) NSString *screenKey;
@property (nonatomic, copy, readonly, nullable) NSArray<UIBarButtonItem *> *leftBarButtonItems;
@property (nonatomic, copy, readonly, nullable) NSArray<UIBarButtonItem *> *rightBarButtonItems;

/*
 * Custom views for title/subtitle/largeSubtitle placements.
 * When non-nil, these take precedence over string-based title props.
 */
@property (nonatomic, strong, readonly, nullable) UIView *titleView;
@property (nonatomic, strong, readonly, nullable) UIView *subtitleView;
@property (nonatomic, strong, readonly, nullable) UIView *largeSubtitleView;

#pragma mark - Navigation Bar props

@property (nonatomic, readonly) BOOL hidden;
@property (nonatomic, readonly) BOOL largeTitle;

- (instancetype)initWithTitle:(nullable NSString *)title
                    screenKey:(nullable NSString *)screenKey
                       hidden:(BOOL)hidden
                   largeTitle:(BOOL)largeTitle
           leftBarButtonItems:(nullable NSArray<UIBarButtonItem *> *)leftBarButtonItems
          rightBarButtonItems:(nullable NSArray<UIBarButtonItem *> *)rightBarButtonItems
                    titleView:(nullable UIView *)titleView
                 subtitleView:(nullable UIView *)subtitleView
            largeSubtitleView:(nullable UIView *)largeSubtitleView;

@end

NS_ASSUME_NONNULL_END
