#pragma once

#import <Foundation/Foundation.h>
#import "RNSStackAnimationConfig.h"
#import "RNSStackAnimationPresetLevel.h"
#import "RNSStackAnimationPresetName.h"
#import "RNSStackAnimationPresetOptions.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackAnimationPresetConfig
    : NSObject <RNSStackAnimationConfig, RNSStackAnimationTransitionConfig, RNSStackAnimationMotionConfig>

@property (nonatomic, readonly) RNSStackAnimationPresetName name;
@property (nonatomic, readonly) RNSStackAnimationPresetOptions *options;

@property (class, nonatomic, readonly) RNSStackAnimationPresetConfig *defaultConfig;

/**
 * `none` without options: what an omitted `push`, `pop`, `enter` or `exit` stands for.
 */
@property (class, nonatomic, readonly) RNSStackAnimationPresetConfig *noneConfig;

- (instancetype)initWithName:(RNSStackAnimationPresetName)name;

- (instancetype)initWithName:(RNSStackAnimationPresetName)name options:(RNSStackAnimationPresetOptions *)options;

/**
 * The preset named `string` in the `animation` prop, without options; nil for any other string.
 */
+ (nullable RNSStackAnimationPresetConfig *)configNamed:(NSString *)string;

+ (NSString *)stringFromName:(RNSStackAnimationPresetName)name;

/**
 * Whether `name` may be written at `level`: `default` only as the whole animation (its two transitions are not built
 * from screen motions), `iosFrom*` never as one screen's motion.
 */
+ (BOOL)presetNamed:(RNSStackAnimationPresetName)name isAllowedAtLevel:(RNSStackAnimationPresetLevel)level;

/**
 * The options `name` accepts at `level` in the object form of the `animation` prop.
 */
+ (BOOL)presetNamed:(RNSStackAnimationPresetName)name
      acceptsOption:(RNSStackAnimationPresetOption)option
            atLevel:(RNSStackAnimationPresetLevel)level;

/**
 * The level as the rejection messages word it.
 */
+ (NSString *)stringFromLevel:(RNSStackAnimationPresetLevel)level;

@end

NS_ASSUME_NONNULL_END
