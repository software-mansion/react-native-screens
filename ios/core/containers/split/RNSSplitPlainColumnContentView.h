#pragma once

#import <UIKit/UIKit.h>
#import "RNSSafeAreaProviding.h"

NS_ASSUME_NONNULL_BEGIN

@class RNSSplitPlainColumnContentView;

/**
 * @protocol RNSSplitPlainColumnContentViewDelegate
 * @brief Receives the layout and window changes of the content view of a plain Split column.
 */
@protocol RNSSplitPlainColumnContentViewDelegate <NSObject>

- (void)splitPlainColumnContentViewDidLayoutSubviews:(RNSSplitPlainColumnContentView *)contentView;
- (void)splitPlainColumnContentViewDidMoveToWindow;

@end

/**
 * @class RNSSplitPlainColumnContentView
 * @brief The view that shows the content of a plain Split column, i.e. a column that does not host a stack.
 *
 * It is the view of the view controller the navigation controller of such a column is rooted at. The content of the
 * column is added to this view.
 */
@interface RNSSplitPlainColumnContentView : UIView <RNSSafeAreaProviding>

@property (nonatomic, weak, nullable) id<RNSSplitPlainColumnContentViewDelegate> delegate;

@end

NS_ASSUME_NONNULL_END
