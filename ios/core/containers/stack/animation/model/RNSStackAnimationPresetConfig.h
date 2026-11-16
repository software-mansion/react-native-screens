#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationConfig.h"
#import "RNSStackAnimationPresetName.h"
#import "RNSStackAnimationPresetOptions.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackAnimationPresetConfig : NSObject <RNSStackAnimationConfig>

@property (nonatomic, readonly) RNSStackAnimationPresetName name;
@property (nonatomic, readonly) RNSStackAnimationPresetOptions *options;

@property (class, nonatomic, readonly) RNSStackAnimationPresetConfig *defaultConfig;

- (instancetype)initWithName:(RNSStackAnimationPresetName)name;

- (instancetype)initWithName:(RNSStackAnimationPresetName)name options:(RNSStackAnimationPresetOptions *)options;

/**
 * The preset named `string` in the `animation` prop, without options; nil for any other string.
 */
+ (nullable RNSStackAnimationPresetConfig *)configNamed:(NSString *)string;

+ (NSString *)stringFromName:(RNSStackAnimationPresetName)name;

+ (BOOL)presetNamed:(RNSStackAnimationPresetName)name acceptsOption:(RNSStackAnimationPresetOption)option;

@end

NS_ASSUME_NONNULL_END
