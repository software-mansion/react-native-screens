#pragma once

#import "RNSStackScreenComponentView.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RNSStackOperation
- (RNSStackScreenComponentView *)screen;
@end

@interface RNSPushOperation : NSObject <RNSStackOperation>

@property (nonatomic, strong, readonly) RNSStackScreenComponentView *screen;

- (instancetype)initWithScreen:(RNSStackScreenComponentView *)screen;

@end

@interface RNSPopOperation : NSObject <RNSStackOperation>

@property (nonatomic, strong, readonly) RNSStackScreenComponentView *screen;

- (instancetype)initWithScreen:(RNSStackScreenComponentView *)screen;

@end

NS_ASSUME_NONNULL_END
