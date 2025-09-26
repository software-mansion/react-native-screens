#import "RNSSheetTranslationEvent.h"
#import <React/RCTAssert.h>

@implementation RNSSheetTranslationEvent {
  double _y;
  int _transitioning;
}

@synthesize viewTag = _viewTag;
@synthesize eventName = _eventName;

- (instancetype)initWithEventName:(NSString *)eventName
                         reactTag:(NSNumber *)reactTag
                                y:(double)y
                    transitioning:(int)transitioning
{
  RCTAssertParam(reactTag);

  if ((self = [super init])) {
    _eventName = [eventName copy];
    _viewTag = reactTag;
    _y = y;
    _transitioning = transitioning;
  }
  return self;
}

RCT_NOT_IMPLEMENTED(-(instancetype)init)

- (NSDictionary *)body
{
  NSDictionary *body = @{
    @"y" : @(_y),
    @"transitioning" : @(_transitioning),
  };

  return body;
}

- (BOOL)canCoalesce
{
  return NO;
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
