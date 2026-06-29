#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderMenuToggleStateTracker : NSObject

@property (nonatomic, assign, readwrite) BOOL toggleStateChanged;

- (BOOL)getToggleStateForItemWithId:(NSString *)menuItemId initialState:(BOOL)initialState;

- (BOOL)toggleItemWithId:(NSString *)menuItemId;

- (void)selectItemWithId:(NSString *)menuItemId fromIds:(NSArray<NSString *> *)allItemIdsInMenu;

@end

NS_ASSUME_NONNULL_END
