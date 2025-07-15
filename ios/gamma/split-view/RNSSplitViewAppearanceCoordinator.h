#import <Foundation/Foundation.h>
#import "RNSSplitViewHostComponentView.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSSplitViewAppearanceCoordinator : NSObject

- (void)updateAppearanceOfSplitView:(RNSSplitViewHostComponentView *)splitView
                     withController:(UISplitViewController *)controller;

@end

NS_ASSUME_NONNULL_END
