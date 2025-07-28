#import <React/RCTConvert.h>
#import <UIKit/UIKit.h>
#import "RNSEnums.h"

NS_ASSUME_NONNULL_BEGIN

@interface RCTConvert (RNSBottomTabs)

+ (UIOffset)UIOffset:(nonnull id)json;

#if !RCT_NEW_ARCH_ENABLED
+ (RNSBottomTabsIconType)RNSBottomTabsIconType:(nonnull id)json;
#endif // !RCT_NEW_ARCH_ENABLED

@end

NS_ASSUME_NONNULL_END
