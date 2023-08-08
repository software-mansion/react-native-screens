#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface NSArray (RNSUtil)

@property (nonatomic, readonly, getter=isEmpty) BOOL empty;
@property (nonatomic, readonly, getter=isNotEmpty) BOOL notEmpty;

@end

NS_ASSUME_NONNULL_END
