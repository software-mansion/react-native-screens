#pragma once

#if defined(__cplusplus)
#import <React/RCTConvert.h>
#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTConvert (RNSTabs)

+ (UIOffset)UIOffset:(nonnull id)json;

@end

NS_ASSUME_NONNULL_END

#endif // defined(__cplusplus)
