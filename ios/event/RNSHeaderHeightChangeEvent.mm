#import "RNSHeaderHeightChangeEvent.h"
#import <React/RCTAssert.h>

@implementation RNSHeaderHeightChangeEvent {
  double _newHeight;
}

@synthesize viewTag = _viewTag;
@synthesize eventName = _eventName;

- (instancetype)initWithEventName:(NSString *)eventName reactTag:(NSNumber *)reactTag newHeight:(double)newHeight
{
  RCTAssertParam(reactTag);

  if ((self = [super init])) {
    _eventName = [eventName copy];
    _viewTag = reactTag;
    _newHeight = newHeight;
  }
  return self;
}

RCT_NOT_IMPLEMENTED(-(instancetype)init)

- (NSDictionary *)body
{
  NSDictionary *body = @{
    @"newHeight" : @(_newHeight),
  };

  return body;
}

+ (NSString *)moduleDotMethod
{
  return @"RCTEventEmitter.receiveEvent";
}

- (NSArray *)arguments
{
  return @[ self.viewTag, RCTNormalizeInputEventName(self.eventName), [self body] ];
}

@end
