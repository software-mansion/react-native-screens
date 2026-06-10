#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSStackHeaderMenuElement <NSObject>

@property (nonatomic, copy, readonly) NSString *menuElementId;

@end

@interface RNSStackHeaderMenuItemData : NSObject <RNSStackHeaderMenuElement>

@property (nonatomic, copy, readonly, nullable) NSString *title;

- (instancetype)initWithId:(NSString *)menuElementId title:(nullable NSString *)title;

@end

@interface RNSStackHeaderMenuData : NSObject <RNSStackHeaderMenuElement>

@property (nonatomic, copy, readonly, nullable) NSString *title;
@property (nonatomic, copy, readonly) NSArray<id<RNSStackHeaderMenuElement>> *children;

- (instancetype)initWithId:(NSString *)menuElementId
                     title:(nullable NSString *)title
                  children:(NSArray<id<RNSStackHeaderMenuElement>> *)children;

@end

NS_ASSUME_NONNULL_END
