#pragma once

#import "RNSExternalImageRepository.h"

typedef void (^ImageCallback)(NSString *, UIImage *);

@interface RNSExternalImageRepository ()

- (nullable UIImage *)imageForKey:(nonnull NSString *)key withInsertionCallback:(ImageCallback)callback;

@end
