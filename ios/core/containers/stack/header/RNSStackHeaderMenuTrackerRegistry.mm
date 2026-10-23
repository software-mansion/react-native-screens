#import "RNSStackHeaderMenuTrackerRegistry.h"
#import "RNSStackHeaderMenuToggleStateTracker.h"

@implementation RNSStackHeaderMenuTrackerRegistry {
  NSMutableDictionary<NSString *, RNSStackHeaderMenuToggleStateTracker *> *_trackers;
}

- (instancetype)init
{
  if (self = [super init]) {
    _trackers = [NSMutableDictionary new];
  }
  return self;
}

- (RNSStackHeaderMenuToggleStateTracker *)trackerForItemId:(NSString *)itemId
{
  RNSStackHeaderMenuToggleStateTracker *tracker = _trackers[itemId];
  if (tracker == nil) {
    tracker = [RNSStackHeaderMenuToggleStateTracker new];
    _trackers[itemId] = tracker;
  }
  return tracker;
}

- (void)resetTrackerForItemId:(NSString *)itemId
{
  _trackers[itemId] = [RNSStackHeaderMenuToggleStateTracker new];
}

- (void)clear
{
  [_trackers removeAllObjects];
}

@end
