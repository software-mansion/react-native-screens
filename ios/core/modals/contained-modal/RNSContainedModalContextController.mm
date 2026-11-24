#import "RNSContainedModalContextController.h"
#import "RNSContainedModalContextView.h"

@implementation RNSContainedModalContextController

- (instancetype)init
{
  if (self = [super init]) {
    self.definesPresentationContext = YES;
  }
  return self;
}

- (void)loadView
{
  self.view = [RNSContainedModalContextView new];
}

@end
