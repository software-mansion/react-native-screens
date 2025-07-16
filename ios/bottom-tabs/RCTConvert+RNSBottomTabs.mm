#if !RCT_NEW_ARCH_ENABLED
#import "RCTConvert+RNSBottomTabs.h"

@implementation RCTConvert (RNSBottomTabs)

+ (UIOffset)UIOffset:(id)json;
{
  json = [self NSDictionary:json];
  return UIOffsetMake([json[@"horizontal"] floatValue], [json[@"vertical"] floatValue]);
}

@end

#endif // !RCT_NEW_ARCH_ENABLED
