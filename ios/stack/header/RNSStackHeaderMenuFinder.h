#pragma once

#import <Foundation/Foundation.h>

#import "RNSStackHeaderItemComponentView.h"
#import "RNSStackHeaderMenuData.h"

NS_ASSUME_NONNULL_BEGIN

static NSString *const RNSTitleMenuTrackerItemId = @"__titleMenu__";

@interface RNSStackHeaderMenuElementSearchResult : NSObject

@property (nonatomic, strong, readonly) id<RNSStackHeaderMenuElement> element;
@property (nonatomic, strong, readonly, nullable) RNSStackHeaderMenuData *parentMenu;

- (instancetype)initWithElement:(id<RNSStackHeaderMenuElement>)element
                     parentMenu:(nullable RNSStackHeaderMenuData *)parentMenu;

@end

typedef NS_ENUM(NSInteger, RNSMenuElementPosition) {
  RNSMenuElementPositionItem,
  RNSMenuElementPositionTitle,
  RNSMenuElementPositionOverflow,
};

@interface RNSMenuElementLocator : NSObject

@property (nonatomic, strong, readonly) RNSStackHeaderMenuElementSearchResult *searchResult;
@property (nonatomic, readonly) RNSMenuElementPosition position;
@property (nonatomic, weak, readonly, nullable) id<RNSStackHeaderItemDataProviding> headerItem;

/**
 * Root menu tree that contains the found element. Used for singleSelectionRoot lookups.
 */
@property (nonatomic, strong, readonly, nullable) RNSStackHeaderMenuData *rootMenu;

/**
 * Tracker key for the toggle state tracker registry.
 */
@property (nonatomic, copy, readonly, nullable) NSString *trackerItemId;

- (instancetype)initWithSearchResult:(RNSStackHeaderMenuElementSearchResult *)searchResult
                            position:(RNSMenuElementPosition)position
                          headerItem:(nullable id<RNSStackHeaderItemDataProviding>)headerItem
                            rootMenu:(nullable RNSStackHeaderMenuData *)rootMenu
                       trackerItemId:(nullable NSString *)trackerItemId;

@end

@interface RNSStackHeaderMenuFinder : NSObject

/**
 * Searches all header items' menus and the title menu for a menu element with the given ID.
 */
+ (nullable RNSMenuElementLocator *)findMenuElementWithId:(NSString *)elementId
                                            inHeaderItems:(NSArray<id<RNSStackHeaderItemDataProviding>> *)items
                                                titleMenu:(nullable RNSStackHeaderMenuData *)titleMenu;

/**
 * Recursively searches a single menu tree for an element with the given ID.
 */
+ (nullable RNSStackHeaderMenuElementSearchResult *)findElementWithId:(NSString *)elementId
                                                               inMenu:(RNSStackHeaderMenuData *)menu;
/**
 * Finds the single selection root menu that contains the element with the given ID.
 */
+ (nullable RNSStackHeaderMenuData *)singleSelectionRootForElementWithId:(NSString *)elementId
                                                                  inMenu:(RNSStackHeaderMenuData *)menu;

@end

NS_ASSUME_NONNULL_END
