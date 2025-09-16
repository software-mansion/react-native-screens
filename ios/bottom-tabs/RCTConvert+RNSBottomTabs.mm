#import "RCTConvert+RNSBottomTabs.h"

@implementation RCTConvert (RNSBottomTabs)

+ (UIOffset)UIOffset:(id)json;
{
  json = [self NSDictionary:json];
  return UIOffsetMake([json[@"horizontal"] floatValue], [json[@"vertical"] floatValue]);
}

#if !RCT_NEW_ARCH_ENABLED
RCT_ENUM_CONVERTER(
    RNSBottomTabsIconType,
    (@{
      @"image" : @(RNSBottomTabsIconTypeImage),
      @"template" : @(RNSBottomTabsIconTypeTemplate),
      @"sfSymbol" : @(RNSBottomTabsIconTypeSfSymbol),
    }),
    RNSBottomTabsIconTypeSfSymbol,
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
    RNSBottomTabsScreenSystemItem,
    (@{
      @"none" : @(RNSBottomTabsScreenSystemItemNone),
      @"bookmarks" : @(RNSBottomTabsScreenSystemItemBookmarks),
      @"contacts" : @(RNSBottomTabsScreenSystemItemContacts),
      @"downloads" : @(RNSBottomTabsScreenSystemItemDownloads),
      @"favorites" : @(RNSBottomTabsScreenSystemItemFavorites),
      @"featured" : @(RNSBottomTabsScreenSystemItemFeatured),
      @"history" : @(RNSBottomTabsScreenSystemItemHistory),
      @"more" : @(RNSBottomTabsScreenSystemItemMore),
      @"mostRecent" : @(RNSBottomTabsScreenSystemItemMostRecent),
      @"mostViewed" : @(RNSBottomTabsScreenSystemItemMostViewed),
      @"recents" : @(RNSBottomTabsScreenSystemItemRecents),
      @"search" : @(RNSBottomTabsScreenSystemItemSearch),
      @"topRated" : @(RNSBottomTabsScreenSystemItemTopRated),
    }),
    RNSBottomTabsScreenSystemItemNone,
    integerValue)

#endif // !RCT_NEW_ARCH_ENABLED

@end
