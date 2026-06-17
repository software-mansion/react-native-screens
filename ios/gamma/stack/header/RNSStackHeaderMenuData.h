#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@protocol RNSStackHeaderMenuElement <NSObject>
@end

@interface RNSStackHeaderMenuItemData : NSObject <RNSStackHeaderMenuElement>

@property (nonatomic, copy, readonly, nullable) NSString *title;

- (instancetype)initWithTitle:(nullable NSString *)title;

@end

@interface RNSStackHeaderMenuData : NSObject <RNSStackHeaderMenuElement>

@property (nonatomic, copy, readonly, nullable) NSString *title;
@property (nonatomic, copy, readonly) NSArray<id<RNSStackHeaderMenuElement>> *children;

- (instancetype)initWithTitle:(nullable NSString *)title children:(NSArray<id<RNSStackHeaderMenuElement>> *)children;

@end

NS_ASSUME_NONNULL_END
