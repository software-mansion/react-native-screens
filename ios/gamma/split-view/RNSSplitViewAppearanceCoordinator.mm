#import "RNSSplitViewAppearanceCoordinator.h"

@interface RNSSplitViewAppearanceCoordinator ()

@property (nonatomic, assign) RNSSplitViewAppearanceUpdateFlags updateFlags;

@end

@implementation RNSSplitViewAppearanceCoordinator

- (instancetype)init
{
  self = [super init];
  if (self) {
    _updateFlags = RNSSplitViewAppearanceUpdateFlagNone;
  }
  return self;
}

- (void)needsUpdateForFlag:(RNSSplitViewAppearanceUpdateFlags)updateFlag
{
  self.updateFlags |= updateFlag;
}

- (void)updateIfNeeded:(RNSSplitViewAppearanceUpdateFlags)flag callback:(void (^)(void))callback
{
  if ([self isUpdateNeeded:flag]) {
    self.updateFlags &= ~flag;
    if (callback) {
      callback();
    }
  }
}

- (BOOL)isUpdateNeeded:(RNSSplitViewAppearanceUpdateFlags)flag
{
  return (self.updateFlags & flag) != 0;
}

@end