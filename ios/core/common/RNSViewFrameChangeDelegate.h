#pragma once

#import <UIKit/UIKit.h>

NS_ASSUME_NONNULL_BEGIN

/**
 * Notified when the frame of a view changes. The reporter decides which changes it reports (e.g. the split
 * navigation controller reports origin changes only).
 */
@protocol RNSViewFrameChangeDelegate <NSObject>

- (void)viewFrameDidChange:(nonnull UIView *)view;

@end

NS_ASSUME_NONNULL_END
