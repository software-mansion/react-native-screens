#if !RCT_NEW_ARCH_ENABLED
#import <UIKit/UIKit.h>
#import <React/RCTConvert.h>
#import "RNSEnums.h"

NS_ASSUME_NONNULL_BEGIN

@interface RCTConvert (RNSBottomTabs)

+ (UIOffset)UIOffset:(nonnull id)json;

+ (RNSBottomTabsIconType)RNSBottomTabsIconType:(nonnull id)json;

@end

NS_ASSUME_NONNULL_END

#endif // !RCT_NEW_ARCH_ENABLED
