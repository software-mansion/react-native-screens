#import "./RNSBackBarButtonItem.h"
#import "RNSDefines.h"

@implementation RNSBackBarButtonItem

- (void)setMenuHidden:(BOOL)menuHidden
{
  _menuHidden = menuHidden;
}

- (void)setMenu:(UIMenu *)menu
{
  if (@available(iOS 14.0, *)) {
    if (!_menuHidden) {
      super.menu = menu;
    }
  }
}

@end
