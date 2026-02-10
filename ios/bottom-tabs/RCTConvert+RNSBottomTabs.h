#pragma once

#import <React/RCTConvert.h>
#import <UIKit/UIKit.h>

#if !RCT_NEW_ARCH_ENABLED
#import "RNSEnums.h"
#endif // !RCT_NEW_ARCH_ENABLED

NS_ASSUME_NONNULL_BEGIN

@interface RCTConvert (RNSBottomTabs)

+ (UIOffset)UIOffset:(nonnull id)json;

#if !RCT_NEW_ARCH_ENABLED
+ (RNSBottomTabsIconType)RNSBottomTabsIconType:(nonnull id)json;
+ (RNSOrientation)RNSOrientation:(nonnull id)json;
#endif // !RCT_NEW_ARCH_ENABLED

@end

NS_ASSUME_NONNULL_END
