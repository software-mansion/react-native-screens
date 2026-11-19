#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationConfig.h"
#import "RNSStackAnimationPresetName.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackAnimationPresetConfig : NSObject <RNSStackAnimationConfig>

@property (nonatomic, readonly) RNSStackAnimationPresetName name;

@property (class, nonatomic, readonly) RNSStackAnimationPresetConfig *defaultConfig;

- (instancetype)initWithName:(RNSStackAnimationPresetName)name;

/**
 * The preset named `string` in the `animation` prop, without options; nil for any other string.
 */
+ (nullable RNSStackAnimationPresetConfig *)configNamed:(NSString *)string;

+ (NSString *)stringFromName:(RNSStackAnimationPresetName)name;

@end

NS_ASSUME_NONNULL_END
