#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderMenuToggleStateTracker : NSObject

- (BOOL)getToggleStateForItemWithId:(NSString *)menuItemId initialState:(BOOL)initialState;

- (BOOL)toggleItemWithId:(NSString *)menuItemId;

- (void)selectItemWithId:(NSString *)menuItemId fromIds:(NSArray<NSString *> *)allItemIdsInMenu;

- (void)setToggleState:(BOOL)state forItemWithId:(NSString *)menuItemId;

- (BOOL)toggleStateEquals:(BOOL)state forItemWithId:(NSString *)menuItemId;

@end

NS_ASSUME_NONNULL_END
