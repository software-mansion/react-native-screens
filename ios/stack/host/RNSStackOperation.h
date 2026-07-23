#pragma once

#import "RNSStackScreenComponentView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackOperation : NSObject

@property (nonatomic, strong, readonly) RNSStackScreenComponentView *stackScreen;

- (instancetype)initWithScreen:(nonnull RNSStackScreenComponentView *)stackScreen;

@end

@interface RNSPushOperation : RNSStackOperation

@end

@interface RNSPopOperation : RNSStackOperation

@property (nonatomic, strong, readonly) RNSStackScreenComponentView *stackScreen;

@end

NS_ASSUME_NONNULL_END
