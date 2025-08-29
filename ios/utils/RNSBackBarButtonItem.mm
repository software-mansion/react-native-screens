#import "./RNSBackBarButtonItem.h"
#import "RNSDefines.h"

@implementation RNSBackBarButtonItem

- (void)setMenuHidden:(BOOL)menuHidden
{
  _menuHidden = menuHidden;
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(14_0)
- (void)setMenu:(UIMenu *)menu
{
  if (@available(iOS 14.0, *)) {
    if (!_menuHidden) {
      super.menu = menu;
    }
  }
}
#endif

@end
