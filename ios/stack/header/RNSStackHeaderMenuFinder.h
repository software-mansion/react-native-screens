#pragma once

#import <Foundation/Foundation.h>

#import "RNSStackHeaderItemComponentView.h"
#import "RNSStackHeaderMenuData.h"

NS_ASSUME_NONNULL_BEGIN

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

- (instancetype)initWithSearchResult:(RNSStackHeaderMenuElementSearchResult *)searchResult
                            position:(RNSMenuElementPosition)position
                          headerItem:(nullable id<RNSStackHeaderItemDataProviding>)headerItem;

@end

@interface RNSStackHeaderMenuFinder : NSObject

/**
 * Searches all header items' menus for a menu element with the given ID.
 */
+ (nullable RNSMenuElementLocator *)findMenuElementWithId:(NSString *)elementId
                                            inHeaderItems:(NSArray<id<RNSStackHeaderItemDataProviding>> *)items;

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
