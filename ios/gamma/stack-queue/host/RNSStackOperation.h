#pragma once

#import "RNSStackScreenComponentView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackOperation : NSObject
@end

@interface RNSPushOperation : RNSStackOperation

@property (nonatomic, strong, readonly) RNSStackScreenComponentView *screen;

- (instancetype)initWithScreen:(RNSStackScreenComponentView *)screen;

@end

@implementation RNSPushOperation

- (instancetype)initWithScreen:(RNSStackScreenComponentView *)screen
{
  if (self = [super init]) {
    _screen = screen;
  }
  return self;
}

@end

@interface RNSPopOperation : RNSStackOperation

@property (nonatomic, strong, readonly) RNSStackScreenComponentView *screen;

- (instancetype)initWithScreen:(RNSStackScreenComponentView *)screen;

@end

@implementation RNSPopOperation

- (instancetype)initWithScreen:(RNSStackScreenComponentView *)screen
{
  if (self = [super init]) {
    _screen = screen;
  }
  return self;
}

@end

NS_ASSUME_NONNULL_END
