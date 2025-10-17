#import <UIKit/UIKit.h>

@class RNSSplitViewScreenComponentView;
@class RNSSplitViewHostController;

NS_ASSUME_NONNULL_BEGIN

@interface RNSSplitViewScreenController : UIViewController

- (instancetype)initWithSplitViewScreenComponentView:(RNSSplitViewScreenComponentView *)componentView;

/// Callback informujący, że kolumna SplitView zmieniła położenie
- (void)columnPositioningDidChangeInSplitViewController:(UISplitViewController *)splitViewController;

/// Czy kontroler znajduje się wewnątrz hierarchii RNSSplitViewHostController
- (BOOL)isInSplitViewHostSubtree;

/// Czy trwa animowana zmiana rozmiaru widoku
- (BOOL)isViewSizeTransitionInProgress;

/// Ustawia potrzebę aktualizacji stanu lifecycle z poziomu React
- (void)setNeedsLifecycleStateUpdate;

@end

NS_ASSUME_NONNULL_END