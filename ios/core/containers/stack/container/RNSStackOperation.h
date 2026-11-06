#pragma once

#import <Foundation/Foundation.h>

@class RNSStackScreenController;

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackOperation : NSObject

@property (nonatomic, strong, readonly) RNSStackScreenController *screenController;

- (instancetype)initWithScreenController:(nonnull RNSStackScreenController *)screenController;

@end

@interface RNSPushOperation : RNSStackOperation

@end

@interface RNSPopOperation : RNSStackOperation

@end

NS_ASSUME_NONNULL_END
