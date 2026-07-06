#pragma once

#import <Foundation/Foundation.h>

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

- (instancetype)initWithId:(NSString *)menuElementId
                     title:(nullable NSString *)title
                  itemType:(RNSMenuItemType)itemType
        initialToggleState:(BOOL)initialToggleState
        keepsMenuPresented:(BOOL)keepsMenuPresented;

@end

@interface RNSStackHeaderMenuData : NSObject <RNSStackHeaderMenuElement>

@property (nonatomic, copy, readonly, nullable) NSString *title;
@property (nonatomic, readonly) BOOL singleSelection;
@property (nonatomic, copy, readonly) NSArray<id<RNSStackHeaderMenuElement>> *children;

- (instancetype)initWithId:(NSString *)menuElementId
                     title:(nullable NSString *)title
           singleSelection:(BOOL)singleSelection
                  children:(NSArray<id<RNSStackHeaderMenuElement>> *)children;

@end

NS_ASSUME_NONNULL_END
