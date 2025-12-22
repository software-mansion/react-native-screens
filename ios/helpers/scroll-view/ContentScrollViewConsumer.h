#pragma once

@protocol ContentScrollViewConsumer

- (void)registerContentScrollView:(UIScrollView *)scrollView;

- (void)unregisterContentScrollView:(UIScrollView *)scrollView;

@end
