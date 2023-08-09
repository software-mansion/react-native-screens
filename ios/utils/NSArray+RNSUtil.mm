#import "NSArray+RNSUtil.h"

@implementation NSArray (RNSUtil)

- (BOOL)rns_isEmpty
{
  return self.count == 0;
}

- (BOOL)rns_isNotEmpty
{
  return self.count > 0;
}

@end
