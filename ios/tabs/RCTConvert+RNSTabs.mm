#import "RCTConvert+RNSTabs.h"

@implementation RCTConvert (RNSTabs)

+ (UIOffset)UIOffset:(id)json;
{
  json = [self NSDictionary:json];
  return UIOffsetMake([json[@"horizontal"] floatValue], [json[@"vertical"] floatValue]);
}

@end
