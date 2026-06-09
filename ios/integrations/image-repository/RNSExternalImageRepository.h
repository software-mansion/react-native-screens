#pragma once

#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * External image repository.
 *
 */
@interface RNSExternalImageRepository : NSObject

+ (instancetype)sharedInstance;

/**
 * This method will trigger an assertion error in debug mode if the key is nullish.
 * In release it'll return `NO`.
 */
- (BOOL)insertImage:(nullable UIImage *)image forKey:(nonnull NSString *)key;

/**
 * This method will trigger an assertion error in debug mode if the key is nullish.
 * In release it'll return `nil`.
 */
- (nullable UIImage *)imageForKey:(nonnull NSString *)key;

/**
 * This method will trigger an assertion error in debug mode if the key is nullish.
 * In release it'll return `NO`.
 */
- (BOOL)removeImageForKey:(nonnull NSString *)key;

@end

NS_ASSUME_NONNULL_END
