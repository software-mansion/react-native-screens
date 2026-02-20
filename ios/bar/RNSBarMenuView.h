#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

#import "BarMenuContainer.h"

@class RNSBarView;

NS_ASSUME_NONNULL_BEGIN

@interface RNSBarMenuView : RCTViewComponentView <BarMenuContainer>

@property (nonatomic, weak, nullable) RNSBarView *barParent;
@property (nonatomic, copy, nullable) NSString *title;
@property (nonatomic, copy, nullable) NSString *icon;
@property (nonatomic, copy, nullable) NSString *placement;
@property (nonatomic, copy, nullable) NSString *variant;
@property (nonatomic, strong, nullable) UIColor *tintColor;
@property (nonatomic, strong, nullable) NSNumber *width;
@property (nonatomic, assign) BOOL disabled;
@property (nonatomic, assign) BOOL selected;
@property (nonatomic, assign) BOOL changesSelectionAsPrimaryAction;
@property (nonatomic, copy, nullable) NSString *identifier;
@property (nonatomic, assign) BOOL hidesSharedBackground;
@property (nonatomic, assign) BOOL hasSharesBackground;
@property (nonatomic, assign) BOOL sharesBackground;
@property (nonatomic, assign) BOOL hasBadge;
@property (nonatomic, strong, nullable) NSNumber *badgeCount;
@property (nonatomic, copy, nullable) NSString *badgeValue;
@property (nonatomic, strong, nullable) UIColor *badgeForegroundColor;
@property (nonatomic, strong, nullable) UIColor *badgeBackgroundColor;
@property (nonatomic, copy, nullable) NSString *badgeFontFamily;
@property (nonatomic, copy, nullable) NSString *badgeFontWeight;
@property (nonatomic, strong, nullable) NSNumber *badgeFontSize;
@property (nonatomic, copy, nullable) NSString *titleFontFamily;
@property (nonatomic, copy, nullable) NSString *titleFontWeight;
@property (nonatomic, strong, nullable) NSNumber *titleFontSize;
@property (nonatomic, strong, nullable) UIColor *titleColor;
@property (nonatomic, copy, nullable) NSString *menuTitle;
@property (nonatomic, copy, nullable) NSString *menuLayout;
@property (nonatomic, assign) BOOL menuMultiselectable;
@property (nonatomic, copy, nullable) NSString *selectedId;
@property (nonatomic, copy, nullable) NSString *defaultSelectedId;
@property (nonatomic, copy) NSArray<NSString *> *selectedIds;
@property (nonatomic, copy) NSArray<NSString *> *defaultSelectedIds;
@property (nonatomic, assign) BOOL hasSelectedId;
@property (nonatomic, assign) BOOL hasSelectedIds;
@property (nonatomic, copy, nullable) NSString *testID;

- (UIMenu *)menuRepresentation;
- (BOOL)canApplySelectionAsPrimaryAction;

@end

NS_ASSUME_NONNULL_END
