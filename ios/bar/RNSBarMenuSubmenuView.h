#import <React/RCTViewComponentView.h>
#import <UIKit/UIKit.h>

#import "BarMenuContainer.h"

NS_ASSUME_NONNULL_BEGIN

@interface RNSBarMenuSubmenuView : RCTViewComponentView <BarMenuContainer>

@property (nonatomic, weak, nullable) id<BarMenuContainer> menuParent;
@property (nonatomic, copy, nullable) NSString *identifier;
@property (nonatomic, copy, nullable) NSString *title;
@property (nonatomic, copy, nullable) NSString *subtitle;
@property (nonatomic, copy, nullable) NSString *icon;
@property (nonatomic, assign) BOOL inlinePresentation;
@property (nonatomic, copy, nullable) NSString *layout;
@property (nonatomic, assign) BOOL destructive;
@property (nonatomic, assign) BOOL multiselectable;
@property (nonatomic, copy, nullable) NSString *selectedId;
@property (nonatomic, copy, nullable) NSString *defaultSelectedId;
@property (nonatomic, copy) NSArray<NSString *> *selectedIds;
@property (nonatomic, copy) NSArray<NSString *> *defaultSelectedIds;
@property (nonatomic, assign) BOOL hasSelectedId;
@property (nonatomic, assign) BOOL hasSelectedIds;

- (UIMenu *)menuRepresentation;

@end

NS_ASSUME_NONNULL_END
