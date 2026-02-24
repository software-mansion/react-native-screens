#import "RCTConvert+RNSTabs.h"

@implementation RCTConvert (RNSTabs)

+ (UIOffset)UIOffset:(id)json;
{
  json = [self NSDictionary:json];
  return UIOffsetMake([json[@"horizontal"] floatValue], [json[@"vertical"] floatValue]);
}

#if !RCT_NEW_ARCH_ENABLED
RCT_ENUM_CONVERTER(
    RNSTabsIconType,
    (@{
      @"image" : @(RNSTabsIconTypeImage),
      @"template" : @(RNSTabsIconTypeTemplate),
      @"sfSymbol" : @(RNSTabsIconTypeSfSymbol),
      @"xcasset" : @(RNSTabsIconTypeXcasset),
    }),
    RNSTabsIconTypeSfSymbol,
    integerValue)

RCT_ENUM_CONVERTER(
    RNSTabBarMinimizeBehavior,
    (@{
      @"automatic" : @(RNSTabBarMinimizeBehaviorAutomatic),
      @"never" : @(RNSTabBarMinimizeBehaviorNever),
      @"onScrollDown" : @(RNSTabBarMinimizeBehaviorOnScrollDown),
      @"onScrollUp" : @(RNSTabBarMinimizeBehaviorOnScrollUp),
    }),
    RNSTabBarMinimizeBehaviorAutomatic,
    integerValue)

RCT_ENUM_CONVERTER(
    RNSTabBarControllerMode,
    (@{
      @"automatic" : @(RNSTabBarControllerModeAutomatic),
      @"tabBar" : @(RNSTabBarControllerModeTabBar),
      @"tabSidebar" : @(RNSTabBarControllerModeTabSidebar),
    }),
    RNSTabBarControllerModeAutomatic,
    integerValue)

RCT_ENUM_CONVERTER(
    RNSOrientation,
    (@{
      @"inherit" : @(RNSOrientationInherit),
      @"all" : @(RNSOrientationAll),
      @"allButUpsideDown" : @(RNSOrientationAllButUpsideDown),
      @"portrait" : @(RNSOrientationPortrait),
      @"portraitUp" : @(RNSOrientationPortraitUp),
      @"portraitDown" : @(RNSOrientationPortraitDown),
      @"landscape" : @(RNSOrientationLandscape),
      @"landscapeLeft" : @(RNSOrientationLandscapeLeft),
      @"landscapeRight" : @(RNSOrientationLandscapeRight),
    }),
    RNSOrientationInherit,
    integerValue)

RCT_ENUM_CONVERTER(
    RNSTabsScreenSystemItem,
    (@{
      @"none" : @(RNSTabsScreenSystemItemNone),
      @"bookmarks" : @(RNSTabsScreenSystemItemBookmarks),
      @"contacts" : @(RNSTabsScreenSystemItemContacts),
      @"downloads" : @(RNSTabsScreenSystemItemDownloads),
      @"favorites" : @(RNSTabsScreenSystemItemFavorites),
      @"featured" : @(RNSTabsScreenSystemItemFeatured),
      @"history" : @(RNSTabsScreenSystemItemHistory),
      @"more" : @(RNSTabsScreenSystemItemMore),
      @"mostRecent" : @(RNSTabsScreenSystemItemMostRecent),
      @"mostViewed" : @(RNSTabsScreenSystemItemMostViewed),
      @"recents" : @(RNSTabsScreenSystemItemRecents),
      @"search" : @(RNSTabsScreenSystemItemSearch),
      @"topRated" : @(RNSTabsScreenSystemItemTopRated),
    }),
    RNSTabsScreenSystemItemNone,
    integerValue)

#endif // !RCT_NEW_ARCH_ENABLED

@end
