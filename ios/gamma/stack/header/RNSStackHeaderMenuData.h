#pragma once

#import <Foundation/Foundation.h>

@class RNSStackHeaderIconData;

NS_ASSUME_NONNULL_BEGIN

typedef NS_ENUM(NSInteger, RNSMenuItemType) {
  RNSMenuItemTypeAutomatic = 0,
  RNSMenuItemTypeAction,
  RNSMenuItemTypeToggle,
};

@protocol RNSStackHeaderMenuElement <NSObject>

@property (nonatomic, copy, readonly) NSString *menuElementId;

@end

@interface RNSStackHeaderMenuItemData : NSObject <RNSStackHeaderMenuElement>

@property (nonatomic, copy, readonly, nullable) NSString *title;
@property (nonatomic, readonly) RNSMenuItemType itemType;
@property (nonatomic, readonly) BOOL initialToggleState;
@property (nonatomic, readonly) BOOL keepsMenuPresented;
@property (nonatomic, strong, readonly, nullable) RNSStackHeaderIconData *icon;

- (instancetype)initWithId:(NSString *)menuElementId
                     title:(nullable NSString *)title
                  itemType:(RNSMenuItemType)itemType
        initialToggleState:(BOOL)initialToggleState
        keepsMenuPresented:(BOOL)keepsMenuPresented
                      icon:(nullable RNSStackHeaderIconData *)icon;

@end

@interface RNSStackHeaderMenuData : NSObject <RNSStackHeaderMenuElement>

@property (nonatomic, copy, readonly, nullable) NSString *title;
@property (nonatomic, readonly) BOOL singleSelection;
@property (nonatomic, readonly) BOOL displayInline;
@property (nonatomic, copy, readonly) NSArray<id<RNSStackHeaderMenuElement>> *children;
@property (nonatomic, strong, readonly, nullable) RNSStackHeaderIconData *icon;

- (instancetype)initWithId:(NSString *)menuElementId
                     title:(nullable NSString *)title
           singleSelection:(BOOL)singleSelection
             displayInline:(BOOL)displayInline
                  children:(NSArray<id<RNSStackHeaderMenuElement>> *)children
                      icon:(nullable RNSStackHeaderIconData *)icon;

@end

NS_ASSUME_NONNULL_END
