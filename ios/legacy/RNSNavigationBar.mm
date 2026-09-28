#import "RNSNavigationBar.h"

#if RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV

@implementation RNSNavigationBar

- (void)layoutSubviews
{
  [super layoutSubviews];
  [_layoutDelegate navigationBarDidLayoutSubviews:self];
}

@end

#endif // RNS_IPHONE_OS_VERSION_AVAILABLE(27_0) && !TARGET_OS_TV
