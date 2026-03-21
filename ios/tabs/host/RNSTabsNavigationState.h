#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Describes navigation state of a tabs container.
 *
 * It holds information about key of selected key AND state provenance.
 * The provenance describes *a history of the state*. Conceptually, the state with provenance `N + 1`
 * MUST BE derived from state with provenance `N`.
 */
@interface RNSTabsNavigationState : NSObject

@property (nonatomic, strong, readonly, nonnull) NSString *selectedScreenKey;

@property (nonatomic, readonly) int provenance;

- (instancetype)initWithSelectedScreenKey:(nonnull NSString *)selectedScreenKey provenance:(int)provenance;

- (instancetype)cloneState;

+ (instancetype)stateWithSelectedScreenKey:(nonnull NSString *)selectedScreenKey provenance:(int)provenance;

@end

@interface RNSTabsNavigationStateUpdateContext : NSObject

@property (nonatomic, readonly, strong, nonnull) RNSTabsNavigationState *navState;
@property (nonatomic, readonly) BOOL isRepeated;
@property (nonatomic, readonly) BOOL hasTriggeredSpecialEffect;
@property (nonatomic, readonly) BOOL isNativeAction;

- (instancetype)initWithNavState:(nonnull RNSTabsNavigationState *)navState
                      isRepeated:(BOOL)isRepeated
       hasTriggeredSpecialEffect:(BOOL)hasTriggeredSpecialEffect
                  isNativeAction:(BOOL)isNativeAction;

@end

NS_ASSUME_NONNULL_END
