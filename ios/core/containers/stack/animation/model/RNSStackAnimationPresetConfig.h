#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationConfig.h"
#import "RNSStackAnimationPresetName.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackAnimationPresetConfig : NSObject <RNSStackAnimationConfig>

@property (nonatomic, readonly) RNSStackAnimationPresetName name;

@property (class, nonatomic, readonly) RNSStackAnimationPresetConfig *defaultConfig;

- (instancetype)initWithName:(RNSStackAnimationPresetName)name;

@end

NS_ASSUME_NONNULL_END
