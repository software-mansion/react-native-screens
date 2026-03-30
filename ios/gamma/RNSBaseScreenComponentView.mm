#import "RNSBaseScreenComponentView.h"

#import <React/RCTAssert.h>
#import <React/RCTConversions.h>

@implementation RNSBaseScreenComponentView {
  BOOL _hasUpdatedActivityMode;
}

// MARK: - Init

- (instancetype)initWithFrame:(CGRect)frame
{
  if (self = [super initWithFrame:frame]) {
    [self initState];
  }
  return self;
}

- (void)initState
{
  [self resetProps];
  [self setupController];
  _hasUpdatedActivityMode = NO;
}

// MARK: - Subclass API

- (void)markActivityModeChanged
{
  _hasUpdatedActivityMode = YES;
}

- (void)updateScreenKey:(nullable NSString *)newKey
{
  RCTAssert(_screenKey == nil, @"[RNScreens] Screen cannot change its screenKey");
  _screenKey = newKey;
}

// MARK: - Abstract interface (subclasses must override)

- (void)setupController
{
  [NSException raise:NSInternalInconsistencyException
              format:@"%@ must override -setupController", NSStringFromClass(self.class)];
}

- (void)resetProps
{
  [NSException raise:NSInternalInconsistencyException
              format:@"%@ must override -resetProps", NSStringFromClass(self.class)];
}

- (void)notifyParentOfActivityModeChange
{
  [NSException raise:NSInternalInconsistencyException
              format:@"%@ must override -notifyParentOfActivityModeChange", NSStringFromClass(self.class)];
}

- (BOOL)isAttached
{
  [NSException raise:NSInternalInconsistencyException
              format:@"%@ must override -isAttached", NSStringFromClass(self.class)];
  return NO;
}

- (UIViewController *)screenViewController
{
  [NSException raise:NSInternalInconsistencyException
              format:@"%@ must override -screenViewController", NSStringFromClass(self.class)];
  return nil;
}

// MARK: - RCTComponentViewProtocol

- (void)finalizeUpdates:(RNComponentViewUpdateMask)updateMask
{
  if (_hasUpdatedActivityMode) {
    _hasUpdatedActivityMode = NO;
    [self notifyParentOfActivityModeChange];
  }
  [super finalizeUpdates:updateMask];
}

+ (BOOL)shouldBeRecycled
{
  // There won't be tens of instances of this component usually & it's easier for now.
  return NO;
}

@end
