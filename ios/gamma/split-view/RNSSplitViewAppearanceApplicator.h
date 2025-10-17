#import <Foundation/Foundation.h>
#import <UIKit/UIKit.h>

@class RNSSplitViewHostComponentView;
@class RNSSplitViewHostController;
@class RNSSplitViewAppearanceCoordinator;

@interface RNSSplitViewAppearanceApplicator : NSObject

- (void)updateAppearanceIfNeededWithSplitView:(RNSSplitViewHostComponentView *)splitView
                          splitViewController:(RNSSplitViewHostController *)splitViewController
                        appearanceCoordinator:(RNSSplitViewAppearanceCoordinator *)appearanceCoordinator;

@end
