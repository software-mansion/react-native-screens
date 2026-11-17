#pragma once

#import <Foundation/Foundation.h>

#import "RNSStackHeaderIconData.h"
#import "RNSStackHeaderMenuData.h"

NS_ASSUME_NONNULL_BEGIN

/**
 * Typed options for menu item updates.
 * `has*` flags distinguish "no change" (key absent) from "reset" (key present, null value).
 */
@interface RNSMenuItemUpdateOptions : NSObject

@property (nonatomic, readonly) BOOL hasTitle;
@property (nonatomic, copy, readonly, nullable) NSString *title;
@property (nonatomic, readonly) BOOL hasIcon;
@property (nonatomic, strong, readonly, nullable) RNSStackHeaderIconData *icon;
@property (nonatomic, readonly) BOOL hasToggleState;
@property (nonatomic, readonly) BOOL toggleState;

- (instancetype)initWithTitle:(nullable NSString *)title
                     hasTitle:(BOOL)hasTitle
                         icon:(nullable RNSStackHeaderIconData *)icon
                      hasIcon:(BOOL)hasIcon
               hasToggleState:(BOOL)hasToggleState
                  toggleState:(BOOL)toggleState;

+ (RNSStackHeaderMenuItemData *)applyOptions:(RNSMenuItemUpdateOptions *)options
                                  toMenuItem:(RNSStackHeaderMenuItemData *)old;

@end

/**
 * Typed options for submenu updates.
 * `has*` flags distinguish "no change" (key absent) from "reset" (key present, null value).
 */
@interface RNSMenuUpdateOptions : NSObject

@property (nonatomic, readonly) BOOL hasTitle;
@property (nonatomic, copy, readonly, nullable) NSString *title;
@property (nonatomic, readonly) BOOL hasIcon;
@property (nonatomic, strong, readonly, nullable) RNSStackHeaderIconData *icon;

- (instancetype)initWithTitle:(nullable NSString *)title
                     hasTitle:(BOOL)hasTitle
                         icon:(nullable RNSStackHeaderIconData *)icon
                      hasIcon:(BOOL)hasIcon;

+ (RNSStackHeaderMenuData *)applyOptions:(RNSMenuUpdateOptions *)options toMenu:(RNSStackHeaderMenuData *)old;

@end

NS_ASSUME_NONNULL_END
