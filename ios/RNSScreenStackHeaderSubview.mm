#import "RNSScreenStackHeaderSubview.h"

@implementation RNSScreenStackHeaderSubview

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super init]) {
    _bridge = bridge;
  }
  return self;
}

- (void)reactSetFrame:(CGRect)frame
{
  // Block any attempt to set coordinates on RNSScreenStackHeaderSubview. This
  // makes UINavigationBar the only one to control the position of header content.
  [super reactSetFrame:CGRectMake(0, 0, frame.size.width, frame.size.height)];
}

@end
