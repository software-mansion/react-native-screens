#pragma once

#import <React/RCTConvert.h>
#import <UIKit/UIKit.h>

#if !RCT_NEW_ARCH_ENABLED
#import "RNSEnums.h"
#endif // !RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

@interface RCTConvert (RNSTabs)

+ (UIOffset)UIOffset:(nonnull id)json;

#if !RCT_NEW_ARCH_ENABLED
+ (RNSTabsIconType)RNSTabsIconType:(nonnull id)json;
+ (RNSOrientation)RNSOrientation:(nonnull id)json;
#endif // !RCT_NEW_ARCH_ENABLED

@end

NS_ASSUME_NONNULL_END
