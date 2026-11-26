#import "RNSStackNavigationState.h"

const int RNSStackNavigationStateInitialProvenance = -1;

@implementation RNSStackNavigationState

- (instancetype)initWithStack:(NSArray<NSString *> *)stack provenance:(int)provenance
{
  if (self = [super init]) {
    _stack = [stack copy];
    _provenance = provenance;
  }
  return self;
}

+ (instancetype)stateWithStack:(NSArray<NSString *> *)stack provenance:(int)provenance
{
  return [[RNSStackNavigationState alloc] initWithStack:stack provenance:provenance];
}

@end

@implementation RNSStackNavigationStateUpdateRequest

- (instancetype)initWithRequestId:(int)requestId
                            stack:(NSArray<NSString *> *)stack
                   baseProvenance:(int)baseProvenance
                     actionOrigin:(RNSStackActionOrigin)actionOrigin
{
  if (self = [super init]) {
    _requestId = requestId;
    _stack = [stack copy];
    _baseProvenance = baseProvenance;
    _actionOrigin = actionOrigin;
  }
  return self;
}

+ (instancetype)requestWithRequestId:(int)requestId
                               stack:(NSArray<NSString *> *)stack
                      baseProvenance:(int)baseProvenance
                        actionOrigin:(RNSStackActionOrigin)actionOrigin
{
  return [[RNSStackNavigationStateUpdateRequest alloc] initWithRequestId:requestId
                                                                   stack:stack
                                                          baseProvenance:baseProvenance
                                                            actionOrigin:actionOrigin];
}

@end

@implementation RNSStackNavigationStateUpdateContext

- (instancetype)initWithNavState:(RNSStackNavigationState *)navState actionOrigin:(RNSStackActionOrigin)actionOrigin
{
  if (self = [super init]) {
    _navState = navState;
    _actionOrigin = actionOrigin;
  }
  return self;
}

@end
