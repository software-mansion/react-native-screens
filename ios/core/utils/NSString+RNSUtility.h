#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSString (RNSUtility)

+ (BOOL)rnscreens_isBlankOrNull:(NSString *)string;

+ (nullable NSString *)rnscreens_stringOrNilIfBlank:(NSString *)string;

+ (BOOL)rnscreens_isEmptyOrNull:(NSString *)string;

+ (nullable NSString *)rnscreens_stringOrNilIfEmpty:(NSString *)string;

@end

NS_ASSUME_NONNULL_END
