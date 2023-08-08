#import "NSArray+RNSUtil.h"

@implementation NSArray (RNSUtil)

- (BOOL)isEmpty
{
  return self.count == 0;
}

- (BOOL)isNotEmpty
{
  return self.count > 0;
}

@end
