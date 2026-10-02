#pragma once

#import "RNSStackScreenProviding.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackOperation : NSObject

@property (nonatomic, strong, readonly) UIView<RNSStackScreenProviding> *stackScreen;

- (instancetype)initWithScreen:(nonnull UIView<RNSStackScreenProviding> *)stackScreen;

@end

@interface RNSPushOperation : RNSStackOperation

@end

@interface RNSPopOperation : RNSStackOperation

@end

NS_ASSUME_NONNULL_END
