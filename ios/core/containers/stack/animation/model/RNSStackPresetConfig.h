#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationConfig.h"
#import "RNSStackPresetName.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackPresetConfig : NSObject <RNSStackAnimationConfig>

@property (nonatomic, readonly) RNSStackPresetName name;

@property (class, nonatomic, readonly) RNSStackPresetConfig *defaultConfig;

- (instancetype)initWithName:(RNSStackPresetName)name;

@end

NS_ASSUME_NONNULL_END
