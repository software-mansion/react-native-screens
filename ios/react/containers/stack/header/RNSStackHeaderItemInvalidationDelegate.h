#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 The delegate is told which view changed, not its id: the header tells its children apart by the view.
 */
@protocol RNSStackHeaderItemInvalidationDelegate <NSObject>

/**
 Properties of the header item other than the menus changed, or it gained or lost its custom view.
 */
- (void)headerItemDidInvalidate:(UIView *)headerItem;

/**
 The `menu` or the `menuRepresentation` prop of the header item changed.
 */
- (void)headerItemMenuDidChange:(UIView *)headerItem;

/**
 A view command changed the menu or the menu representation of the header item.
 */
- (void)headerItemMenuDidUpdateFromCommand:(UIView *)headerItem;

- (void)headerItemSpacerDidInvalidate:(UIView *)headerItemSpacer;

@end

NS_ASSUME_NONNULL_END
