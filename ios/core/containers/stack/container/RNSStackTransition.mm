#import "RNSStackTransition.h"
#import "RNSStackScreenController.h"

@implementation RNSStackTransition

- (instancetype)initFromStack:(NSArray<RNSStackScreenController *> *)fromStack
                      toStack:(NSArray<RNSStackScreenController *> *)toStack
                  interactive:(BOOL)interactive
{
  if (self = [super init]) {
    _fromStack = [fromStack copy];
    _toStack = [toStack copy];
    _kind = [RNSStackTransition kindOfTransitionFromStack:_fromStack toStack:_toStack];
    _isInteractive = interactive;
  }
  return self;
}

- (nullable RNSStackScreenController *)fromScreen
{
  return _fromStack.lastObject;
}

- (nullable RNSStackScreenController *)toScreen
{
  return _toStack.lastObject;
}

+ (RNSStackTransitionKind)kindOfTransitionFromStack:(NSArray<RNSStackScreenController *> *)fromStack
                                            toStack:(NSArray<RNSStackScreenController *> *)toStack
{
  RNSStackScreenController *fromTop = fromStack.lastObject;
  RNSStackScreenController *toTop = toStack.lastObject;

  if (fromTop == toTop) {
    return RNSStackTransitionKindNone;
  }
  if (toTop != nil && [fromStack containsObject:toTop]) {
    return RNSStackTransitionKindPop;
  }
  if (fromTop != nil && [toStack containsObject:fromTop]) {
    return RNSStackTransitionKindPush;
  }
  return RNSStackTransitionKindReplace;
}

@end
