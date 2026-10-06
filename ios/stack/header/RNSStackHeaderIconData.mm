#import "RNSStackHeaderIconData.h"

@implementation RNSStackHeaderIconData

- (instancetype)initWithType:(RNSStackHeaderIconType)iconType
                 resourceName:(nullable NSString *)resourceName
                   jsonSource:(nullable NSDictionary *)jsonSource
    prefersSynchronousLoading:(BOOL)prefersSynchronousLoading
{
  if (self = [super init]) {
    _iconType = iconType;
    _prefersSynchronousLoading = prefersSynchronousLoading;
    _resourceName = [resourceName copy];
    _jsonSource = [jsonSource copy];
  }
  return self;
}

@end
