#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderMenuToggleStateTracker : NSObject

@property (nonatomic, assign, readwrite) BOOL toggleStateChanged;

- (BOOL)getToggleStateForItemWithId:(NSString *)menuElementId initialState:(BOOL)initialState;

- (BOOL)toggleItemWithId:(NSString *)menuElementId;

- (void)selectItemWithId:(NSString *)menuElementId fromIds:(NSArray<NSString *> *)allItemIdsInMenu;

@end

NS_ASSUME_NONNULL_END
