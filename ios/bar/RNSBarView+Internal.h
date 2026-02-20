#import "RNSBarView.h"

#import "RNSBarItemView.h"
#import "RNSBarMenuView.h"
#import "RNSBarSpacerView.h"

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, ToolbarSegment) {
  ToolbarSegmentNone,
  ToolbarSegmentLeft,
  ToolbarSegmentRight,
};

@interface RNSBarView () {
@package
  UIView * _view;
  NSMutableArray<UIView<RCTComponentViewProtocol> *> * _toolbarChildren;
  NSMapTable<UIBarButtonItem *, RNSBarItemView *> * _barButtonMap;
  NSMapTable<RNSBarItemView *, UIBarButtonItem *> * _itemBarButtonMap;
  NSMapTable<RNSBarMenuView *, UIBarButtonItem *> * _menuBarButtonMap;
  BOOL _appliedToolbarItems;
  BOOL _originalToolbarHiddenKnown;
  BOOL _originalToolbarHidden;
  BOOL _appliedNavigationItems;
  BOOL _placementIsToolbar;
  NSArray<UIBarButtonItem *> * _Nullable _appliedLeftItems;
  NSArray<UIBarButtonItem *> * _Nullable _appliedRightItems;
  NSArray<UIBarButtonItem *> * _Nullable _appliedToolbarItemArray;
}

@end

@interface RNSBarView (InternalMethods)

- (NSArray<UIBarButtonItem *> *)barItemsForChildren;
- (void)resetBarMappings;

- (BOOL)replaceBarButtonItem:(UIBarButtonItem *)barButton
                    withItem:(UIBarButtonItem *)replacement
            inNavigationItem:(UINavigationItem *)navigationItem
                     segment:(ToolbarSegment)segment;
- (void)clearNavigationItemsIfNeeded;

- (BOOL)replaceBottomBarButtonItem:(UIBarButtonItem *)barButton
                          withItem:(UIBarButtonItem *)replacement
                    viewController:(UIViewController *)viewController;
- (void)updateBottomBarItemsWithViewController:(UIViewController *)viewController;
- (void)clearBottomBarIfNeeded;

@end

NS_ASSUME_NONNULL_END
