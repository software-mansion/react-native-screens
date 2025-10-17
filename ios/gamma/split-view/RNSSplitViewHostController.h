#import <UIKit/UIKit.h>
#import "RNSSplitViewAppearanceApplicator.h"
#import "RNSSplitViewAppearanceCoordinator.h"
#import "RNSSplitViewHostComponentView.h"
#import "RNSSplitViewNavigationControllerViewFrameObserver.h"

@class RNSSplitViewScreenComponentView;
@class RNSSplitViewScreenController;
@class RNSSplitViewHostComponentEventEmitter;
@class RNSSplitViewNavigationController;

@interface RNSSplitViewHostController
    : UISplitViewController <UISplitViewControllerDelegate, RNSSplitViewNavigationControllerViewFrameObserver>

- (instancetype)initWithSplitViewHostComponentView:(RNSSplitViewHostComponentView *)view
                                   numberOfColumns:(NSInteger)columnCount;

- (void)setNeedsUpdateOfChildViewControllers;
- (void)setNeedsAppearanceUpdate;
- (void)setNeedsSecondaryScreenNavBarUpdate;
- (void)setNeedsDisplayModeUpdate;
- (void)setNeedsOrientationUpdate;

- (void)updateChildViewControllersIfNeeded;
- (void)updateChildViewControllers;
- (void)refreshSecondaryNavBar;
- (void)toggleSplitViewInspector:(BOOL)showInspector;

- (void)reactMountingTransactionWillMount;
- (void)reactMountingTransactionDidMount;

- (NSInteger)evaluateOrientation;

@end