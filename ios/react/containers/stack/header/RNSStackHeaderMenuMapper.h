#pragma once

#import <Foundation/Foundation.h>

#import "RNSStackHeaderMenuData.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderMenuMapper : NSObject

+ (nullable RNSStackHeaderMenuData *)menuFromDictionary:(nullable id)dictionary;

@end

NS_ASSUME_NONNULL_END
