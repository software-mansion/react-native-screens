#pragma once

#import "RNSStackScreenComponentView.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RNSStackOperation

@property (nonatomic, strong, readonly, nonnull) RNSStackScreenComponentView *stackScreen;

@end

@interface RNSPushOperation : NSObject <RNSStackOperation>

@property (nonatomic, strong, readonly, nonnull) RNSStackScreenComponentView *stackScreen;

- (instancetype)initWithScreen:(nonnull RNSStackScreenComponentView *)stackScreen;

@end

@interface RNSPopOperation : NSObject <RNSStackOperation>

@property (nonatomic, strong, readonly, nonnull) RNSStackScreenComponentView *stackScreen;

- (instancetype)initWithScreen:(nonnull RNSStackScreenComponentView *)stackScreen;

@end

NS_ASSUME_NONNULL_END
