#import "RNSTransitionProgressEvent.h"

@implementation RNSTransitionProgressEvent {
  double _progress;
  BOOL _closing;
}

@synthesize viewTag = _viewTag;
@synthesize coalescingKey = _coalescingKey;

- (instancetype)initWithReactTag:(NSNumber *)reactTag progress:(double)progress closing:(BOOL)closing
{
  static uint16_t coalescingKey = 0;
  if ((self = [super init])) {
    _viewTag = reactTag;
    _coalescingKey = coalescingKey++;
    _progress = progress;
    _closing = closing;
  }
  return self;
}

RCT_NOT_IMPLEMENTED(- (instancetype)init)

- (NSString *)eventName
{
  return @"onTransitionProgress";
}

- (BOOL)canCoalesce
{
  // TODO: event coalescing
  return NO;
}

- (id<RCTEvent>)coalesceWithEvent:(id<RCTEvent>)newEvent;
{
  return newEvent;
}

+ (NSString *)moduleDotMethod
{
  return @"RCTEventEmitter.receiveEvent";
}

- (NSArray *)arguments
{
  NSMutableDictionary *body = [NSMutableDictionary new];
  [body setObject:_viewTag forKey:@"target"];
  [body setObject:@(_progress) forKey:@"progress"];
  [body setObject:@(_closing) forKey:@"closing"];
  return @[self.viewTag, @"onTransitionProgress", body];
}

@end
