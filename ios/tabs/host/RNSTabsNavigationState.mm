#import "RNSTabsNavigationState.h"

@implementation RNSTabsNavigationState

- (instancetype)initWithSelectedScreenKey:(nonnull NSString *)selectedScreenKey provenance:(int)provenance
{
  if (self = [super init]) {
    _selectedScreenKey = selectedScreenKey;
    _provenance = provenance;
  }
  return self;
}

- (instancetype)cloneState
{
  auto *clonedValue =
      [[RNSTabsNavigationState alloc] initWithSelectedScreenKey:[NSString stringWithString:self.selectedScreenKey]
                                                     provenance:self.provenance];
  return clonedValue;
}

+ (instancetype)stateWithSelectedScreenKey:(nonnull NSString *)selectedScreenKey provenance:(int)provenance
{
  return [[RNSTabsNavigationState alloc] initWithSelectedScreenKey:selectedScreenKey provenance:provenance];
}

@end

@implementation RNSTabsNavigationStateUpdateContext

- (instancetype)initWithNavState:(nonnull RNSTabsNavigationState *)navState
                      isRepeated:(BOOL)isRepeated
       hasTriggeredSpecialEffect:(BOOL)hasTriggeredSpecialEffect
                  isNativeAction:(BOOL)isNativeAction
{
  if (self = [super init]) {
    _navState = navState;
    _isRepeated = isRepeated;
    _hasTriggeredSpecialEffect = hasTriggeredSpecialEffect;
    _isNativeAction = isNativeAction;
  }
  return self;
}

@end
