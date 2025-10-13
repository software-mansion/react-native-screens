#import "./RNSBackBarButtonItem.h"
#import "RNSDefines.h"

@implementation RNSBackBarButtonItem

- (void)setMenuHidden:(BOOL)menuHidden
{
  _menuHidden = menuHidden;
}

- (void)setMenu:(UIMenu *)menu
{
  if (!_menuHidden) {
    super.menu = menu;
  }
}

@end
