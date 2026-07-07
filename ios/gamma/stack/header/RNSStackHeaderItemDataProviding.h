#pragma once

#import <UIKit/UIKit.h>

#import "RNSHeaderItemPlacement.h"
#import "RNSStackHeaderMenuData.h"

NS_ASSUME_NONNULL_BEGIN

@protocol RNSStackHeaderItemDataProviding <NSObject>

@property (nonatomic, readonly) RNSHeaderItemPlacement placement;
@property (nonatomic, readonly, nullable) NSString *itemId;
@property (nonatomic, readonly, nullable) NSString *title;
@property (nonatomic, readonly, nullable) RNSStackHeaderMenuData *menu;
@property (nonatomic, readonly, nullable) UIView *customView;
@property (nonatomic, readonly) BOOL respondsToOnPress;

@end

NS_ASSUME_NONNULL_END
