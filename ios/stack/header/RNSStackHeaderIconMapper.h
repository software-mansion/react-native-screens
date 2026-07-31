#pragma once

#import <Foundation/Foundation.h>

#import "RNSStackHeaderIconData.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSStackHeaderIconMapper : NSObject

+ (nullable RNSStackHeaderIconData *)iconFromDictionary:(nullable id)dictionary;

@end

NS_ASSUME_NONNULL_END
