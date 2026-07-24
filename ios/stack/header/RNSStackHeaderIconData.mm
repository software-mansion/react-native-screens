#import "RNSStackHeaderIconData.h"

@implementation RNSStackHeaderIconData

- (instancetype)initWithType:(RNSStackHeaderIconType)iconType
                resourceName:(nullable NSString *)resourceName
                  jsonSource:(nullable NSDictionary *)jsonSource
{
  if (self = [super init]) {
    _iconType = iconType;
    _resourceName = [resourceName copy];
    _jsonSource = [jsonSource copy];
  }
  return self;
}

@end
