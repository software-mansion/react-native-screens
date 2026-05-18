#import "RNSStackHeaderData.h"

@implementation RNSStackHeaderData

- (instancetype)initWithTitle:(nullable NSString *)title
                     subtitle:(nullable NSString *)subtitle
                    screenKey:(nullable NSString *)screenKey
                       hidden:(BOOL)hidden
                   largeTitle:(nullable NSString *)largeTitle
            largeTitleEnabled:(BOOL)largeTitleEnabled
        leadingBarButtonItems:(nullable NSArray<UIBarButtonItem *> *)leadingBarButtonItems
       trailingBarButtonItems:(nullable NSArray<UIBarButtonItem *> *)trailingBarButtonItems
                    titleView:(nullable UIView *)titleView
                 subtitleView:(nullable UIView *)subtitleView
            largeSubtitleView:(nullable UIView *)largeSubtitleView
{
  if (self = [super init]) {
    _title = [title copy];
    _subtitle = [subtitle copy];
    _screenKey = [screenKey copy];
    _hidden = hidden;
    _largeTitle = [largeTitle copy];
    _largeTitleEnabled = largeTitleEnabled;
    _leadingBarButtonItems = [leadingBarButtonItems copy];
    _trailingBarButtonItems = [trailingBarButtonItems copy];
    _titleView = titleView;
    _subtitleView = subtitleView;
    _largeSubtitleView = largeSubtitleView;
  }
  return self;
}

@end
