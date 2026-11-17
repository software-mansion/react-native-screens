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
  // The provider component view (the wrapper) owns this view's geometry; the
  // mask keeps it filling the wrapper between explicit layout passes.
  view.autoresizingMask = UIViewAutoresizingFlexibleWidth | UIViewAutoresizingFlexibleHeight;
  self.view = view;
}

@end
