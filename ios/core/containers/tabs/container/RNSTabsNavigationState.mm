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

@implementation RNSTabsNavigationStateUpdateRequest

- (instancetype)initWithSelectedScreenKey:(nonnull NSString *)selectedScreenKey
                           baseProvenance:(int)baseProvenance
                             actionOrigin:(RNSTabsActionOrigin)actionOrigin
{
  if (self = [super init]) {
    _selectedScreenKey = selectedScreenKey;
    _baseProvenance = baseProvenance;
    _actionOrigin = actionOrigin;
  }
  return self;
}

- (instancetype)cloneRequest
{
  return [[RNSTabsNavigationStateUpdateRequest alloc]
      initWithSelectedScreenKey:[NSString stringWithString:self.selectedScreenKey]
                 baseProvenance:self.baseProvenance
                   actionOrigin:self.actionOrigin];
}

+ (instancetype)requestWithSelectedScreenKey:(nonnull NSString *)selectedScreenKey
                              baseProvenance:(int)baseProvenance
                                actionOrigin:(RNSTabsActionOrigin)actionOrigin
{
  return [[RNSTabsNavigationStateUpdateRequest alloc] initWithSelectedScreenKey:selectedScreenKey
                                                                 baseProvenance:baseProvenance
                                                                   actionOrigin:actionOrigin];
}

@end

@implementation RNSTabsNavigationStateUpdateContext

- (instancetype)initWithNavState:(nonnull RNSTabsNavigationState *)navState
                      isRepeated:(BOOL)isRepeated
       hasTriggeredSpecialEffect:(BOOL)hasTriggeredSpecialEffect
                    actionOrigin:(RNSTabsActionOrigin)actionOrigin
{
  if (self = [super init]) {
    _navState = navState;
    _isRepeated = isRepeated;
    _hasTriggeredSpecialEffect = hasTriggeredSpecialEffect;
    _actionOrigin = actionOrigin;
  }
  return self;
}

@end
