#import "RNSContainedModalProviderController.h"

@implementation RNSContainedModalProviderController

- (instancetype)init
{
  if (self = [super init]) {
    self.definesPresentationContext = YES;
  }
  return self;
}

- (void)loadView
{
  UIView *view = [[UIView alloc] init];
  view.backgroundColor = [UIColor clearColor];
  self.view = view;
}

@end
