#import <UIKit/UIKit.h>

#import "RNSDefines.h"
#import "RNSSearchBar.h"

#import <React/RCTBridge.h>
#import <React/RCTComponent.h>
#import <React/RCTUIManager.h>

#ifdef RCT_NEW_ARCH_ENABLED
#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSConvert.h"
#endif // RCT_NEW_ARCH_ENABLED

#ifdef RCT_NEW_ARCH_ENABLED
namespace react = facebook::react;
#endif // RCT_NEW_ARCH_ENABLED

@implementation RNSSearchBar {
  __weak RCTBridge *_bridge;
  UISearchController *_controller;
  UIColor *_textColor;
}

@synthesize controller = _controller;

- (instancetype)initWithBridge:(RCTBridge *)bridge
{
  if (self = [super init]) {
    _bridge = bridge;
    [self initCommonProps];
  }
  return self;
}

#ifdef RCT_NEW_ARCH_ENABLED

// Needed because of this: https://github.com/facebook/react-native/pull/37274
+ (void)load
{
  [super load];
}

- (instancetype)init
{
  if (self = [super init]) {
    static const auto defaultProps = std::make_shared<const react::RNSSearchBarProps>();
    _props = defaultProps;
    [self initCommonProps];
  }
  return self;
}
#endif

- (void)initCommonProps
{
#if !TARGET_OS_TV
  _controller = [[UISearchController alloc] initWithSearchResultsController:nil];
#else
  // on TVOS UISearchController must contain searchResultsController.
  _controller = [[UISearchController alloc] initWithSearchResultsController:[UIViewController new]];
#endif

  _controller.searchBar.delegate = self;
  _hideWhenScrolling = YES;
  _placement = RNSSearchBarPlacementAutomatic;

  _allowToolbarIntegration = YES;
}

- (void)emitOnFocusEvent
{
#ifdef RCT_NEW_ARCH_ENABLED
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSSearchBarEventEmitter>(_eventEmitter)
        ->onSearchFocus(react::RNSSearchBarEventEmitter::OnSearchFocus{});
  }
#else
  if (self.onSearchFocus) {
    self.onSearchFocus(@{});
  }
#endif
}

- (void)emitOnBlurEvent
{
#ifdef RCT_NEW_ARCH_ENABLED
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSSearchBarEventEmitter>(_eventEmitter)
        ->onSearchBlur(react::RNSSearchBarEventEmitter::OnSearchBlur{});
  }
#else
  if (self.onSearchBlur) {
    self.onSearchBlur(@{});
  }
#endif
}

- (void)emitOnSearchButtonPressEventWithText:(NSString *)text
{
#ifdef RCT_NEW_ARCH_ENABLED
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSSearchBarEventEmitter>(_eventEmitter)
        ->onSearchButtonPress(
            react::RNSSearchBarEventEmitter::OnSearchButtonPress{.text = RCTStringFromNSString(text)});
  }
#else
  if (self.onSearchButtonPress) {
    self.onSearchButtonPress(@{
      @"text" : text,
    });
  }
#endif
}

- (void)emitOnCancelButtonPressEvent
{
#ifdef RCT_NEW_ARCH_ENABLED
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSSearchBarEventEmitter>(_eventEmitter)
        ->onCancelButtonPress(react::RNSSearchBarEventEmitter::OnCancelButtonPress{});
  }
#else
  if (self.onCancelButtonPress) {
    self.onCancelButtonPress(@{});
  }
#endif
}

- (void)emitOnChangeTextEventWithText:(NSString *)text
{
#ifdef RCT_NEW_ARCH_ENABLED
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSSearchBarEventEmitter>(_eventEmitter)
        ->onChangeText(react::RNSSearchBarEventEmitter::OnChangeText{.text = RCTStringFromNSString(text)});
  }
#else
  if (self.onChangeText) {
    self.onChangeText(@{
      @"text" : text,
    });
  }
#endif
}

- (void)setObscureBackground:(BOOL)obscureBackground
{
  if (@available(iOS 9.1, *)) {
    [_controller setObscuresBackgroundDuringPresentation:obscureBackground];
  }
}

- (void)setHideNavigationBar:(BOOL)hideNavigationBar
{
  [_controller setHidesNavigationBarDuringPresentation:hideNavigationBar];
}

- (void)setHideWhenScrolling:(BOOL)hideWhenScrolling
{
  _hideWhenScrolling = hideWhenScrolling;
}

- (void)setAutoCapitalize:(UITextAutocapitalizationType)autoCapitalize
{
  [_controller.searchBar setAutocapitalizationType:autoCapitalize];
}

- (void)setPlaceholder:(NSString *)placeholder
{
  [_controller.searchBar setPlaceholder:placeholder];
}

- (void)setBarTintColor:(UIColor *)barTintColor
{
#if !TARGET_OS_TV
  [_controller.searchBar.searchTextField setBackgroundColor:barTintColor];
#endif
}

- (void)setTintColor:(UIColor *)tintColor
{
  [_controller.searchBar setTintColor:tintColor];
}

- (void)setTextColor:(UIColor *)textColor
{
#if !TARGET_OS_TV
  _textColor = textColor;
  [_controller.searchBar.searchTextField setTextColor:_textColor];
#endif
}

- (void)setCancelButtonText:(NSString *)text
{
  [_controller.searchBar setValue:text forKey:@"cancelButtonText"];
}

- (void)hideCancelButton
{
#if !TARGET_OS_TV
  if (!_controller.automaticallyShowsCancelButton) {
    [_controller.searchBar setShowsCancelButton:NO animated:YES];
  } else {
    // On iOS 13+ UISearchController automatically shows/hides cancel button
    // https://developer.apple.com/documentation/uikit/uisearchcontroller/3152926-automaticallyshowscancelbutton?language=objc
  }
#endif
}

- (void)showCancelButton
{
#if !TARGET_OS_TV
  if (!_controller.automaticallyShowsCancelButton) {
    [_controller.searchBar setShowsCancelButton:YES animated:YES];
  } else {
    // On iOS 13+ UISearchController automatically shows/hides cancel button
    // https://developer.apple.com/documentation/uikit/uisearchcontroller/3152926-automaticallyshowscancelbutton?language=objc
  }
#endif
}

#if RNS_IPHONE_OS_VERSION_AVAILABLE(16_0) && !TARGET_OS_TV
- (UINavigationItemSearchBarPlacement)placementAsUINavigationItemSearchBarPlacement API_AVAILABLE(ios(16.0))
    API_UNAVAILABLE(tvos, watchos)
{
  switch (_placement) {
    case RNSSearchBarPlacementStacked:
      return UINavigationItemSearchBarPlacementStacked;
    case RNSSearchBarPlacementAutomatic:
      return UINavigationItemSearchBarPlacementAutomatic;
    case RNSSearchBarPlacementInline:
      return UINavigationItemSearchBarPlacementInline;
#if RNS_IPHONE_OS_VERSION_AVAILABLE(26_0)
    case RNSSearchBarPlacementIntegrated:
      if (@available(iOS 26, *)) {
        return UINavigationItemSearchBarPlacementIntegrated;
      } else {
        return UINavigationItemSearchBarPlacementInline;
      }
    case RNSSearchBarPlacementIntegratedButton:
      if (@available(iOS 26, *)) {
        return UINavigationItemSearchBarPlacementIntegratedButton;
      } else {
        return UINavigationItemSearchBarPlacementInline;
      }
    case RNSSearchBarPlacementIntegratedCentered:
      if (@available(iOS 26, *)) {
        return UINavigationItemSearchBarPlacementIntegratedCentered;
      } else {
        return UINavigationItemSearchBarPlacementInline;
      }
#else // Check for iOS >= 26
    case RNSSearchBarPlacementIntegrated:
    case RNSSearchBarPlacementIntegratedButton:
    case RNSSearchBarPlacementIntegratedCentered:
      return UINavigationItemSearchBarPlacementInline;
#endif // Check for iOS >= 26
    default:
      RCTLogError(@"[RNScreens] unsupported search bar placement");
      return UINavigationItemSearchBarPlacementStacked;
  }
}
#endif // Check for iOS >= 16 && !TARGET_OS_TV

#pragma mark delegate methods

- (void)searchBarTextDidBeginEditing:(UISearchBar *)searchBar
{
#if !TARGET_OS_TV
  // for some reason, the color does not change when set at the beginning,
  // so we apply it again here
  if (_textColor != nil) {
    [_controller.searchBar.searchTextField setTextColor:_textColor];
  }
#endif

  [self showCancelButton];
  [self becomeFirstResponder];
  [self emitOnFocusEvent];
}

- (void)searchBarTextDidEndEditing:(UISearchBar *)searchBar
{
  [self emitOnBlurEvent];
  [self hideCancelButton];
}

- (void)searchBar:(UISearchBar *)searchBar textDidChange:(NSString *)searchText
{
  [self emitOnChangeTextEventWithText:_controller.searchBar.text];
}

- (void)searchBarSearchButtonClicked:(UISearchBar *)searchBar
{
  [self emitOnSearchButtonPressEventWithText:_controller.searchBar.text];
}

#if !TARGET_OS_TV
- (void)searchBarCancelButtonClicked:(UISearchBar *)searchBar
{
  _controller.searchBar.text = @"";
  [self resignFirstResponder];
  [self hideCancelButton];

  [self emitOnCancelButtonPressEvent];
  [self emitOnChangeTextEventWithText:_controller.searchBar.text];
}
#endif // !TARGET_OS_TV

- (void)blur
{
  [_controller.searchBar resignFirstResponder];
}

- (void)focus
{
  [_controller.searchBar becomeFirstResponder];
}

- (void)clearText
{
  [_controller.searchBar setText:@""];
}

- (void)toggleCancelButton:(BOOL)flag
{
#if !TARGET_OS_TV
  [_controller.searchBar setShowsCancelButton:flag animated:YES];
#endif
}

- (void)setText:(NSString *)text
{
  [_controller.searchBar setText:text];
}

- (void)cancelSearch
{
#if !TARGET_OS_TV
  [self searchBarCancelButtonClicked:_controller.searchBar];
  _controller.active = NO;
#endif
}

#pragma mark-- Fabric specific

#ifdef RCT_NEW_ARCH_ENABLED
- (void)updateProps:(react::Props::Shared const &)props oldProps:(react::Props::Shared const &)oldProps
{
  const auto &oldScreenProps = *std::static_pointer_cast<const react::RNSSearchBarProps>(_props);
  const auto &newScreenProps = *std::static_pointer_cast<const react::RNSSearchBarProps>(props);

  if (oldScreenProps.hideWhenScrolling != newScreenProps.hideWhenScrolling) {
    [self setHideWhenScrolling:newScreenProps.hideWhenScrolling];
  }

  if (oldScreenProps.cancelButtonText != newScreenProps.cancelButtonText) {
    [self setCancelButtonText:RCTNSStringFromStringNilIfEmpty(newScreenProps.cancelButtonText)];
  }

  if (oldScreenProps.obscureBackground != newScreenProps.obscureBackground) {
    [self setObscureBackground:newScreenProps.obscureBackground];
  }

  if (oldScreenProps.hideNavigationBar != newScreenProps.hideNavigationBar) {
    [self setHideNavigationBar:newScreenProps.hideNavigationBar];
  }

  if (oldScreenProps.placeholder != newScreenProps.placeholder) {
    [self setPlaceholder:RCTNSStringFromStringNilIfEmpty(newScreenProps.placeholder)];
  }

#if !TARGET_OS_VISION
  if (oldScreenProps.autoCapitalize != newScreenProps.autoCapitalize) {
    [self setAutoCapitalize:[RNSConvert UITextAutocapitalizationTypeFromCppEquivalent:newScreenProps.autoCapitalize]];
  }
#endif

  if (oldScreenProps.tintColor != newScreenProps.tintColor) {
    [self setTintColor:RCTUIColorFromSharedColor(newScreenProps.tintColor)];
  }

  if (oldScreenProps.barTintColor != newScreenProps.barTintColor) {
    [self setBarTintColor:RCTUIColorFromSharedColor(newScreenProps.barTintColor)];
  }

  if (oldScreenProps.textColor != newScreenProps.textColor) {
    [self setTextColor:RCTUIColorFromSharedColor(newScreenProps.textColor)];
  }

  if (oldScreenProps.placement != newScreenProps.placement) {
    self.placement = [RNSConvert RNSScreenSearchBarPlacementFromCppEquivalent:newScreenProps.placement];
  }

  if (oldScreenProps.allowToolbarIntegration != newScreenProps.allowToolbarIntegration) {
    self.allowToolbarIntegration = newScreenProps.allowToolbarIntegration;
  }

  [super updateProps:props oldProps:oldProps];
}

+ (react::ComponentDescriptorProvider)componentDescriptorProvider
{
  return react::concreteComponentDescriptorProvider<react::RNSSearchBarComponentDescriptor>();
}

- (void)handleCommand:(const NSString *)commandName args:(const NSArray *)args
{
  RCTRNSSearchBarHandleCommand(self, commandName, args);
}

+ (BOOL)shouldBeRecycled
{
  // Recycling RNSSearchBar causes multiple bugs on iOS 26+, resulting in search bar
  // not appearing at all.
  // Details: https://github.com/software-mansion/react-native-screens/pull/3168
  return NO;
}

#else
#endif // RCT_NEW_ARCH_ENABLED

@end

#ifdef RCT_NEW_ARCH_ENABLED
Class<RCTComponentViewProtocol> RNSSearchBarCls(void)
{
  return RNSSearchBar.class;
}
#endif

@implementation RNSSearchBarManager

RCT_EXPORT_MODULE()

#ifdef RCT_NEW_ARCH_ENABLED
#else
- (UIView *)view
{
  return [[RNSSearchBar alloc] initWithBridge:self.bridge];
}
#endif

RCT_EXPORT_VIEW_PROPERTY(obscureBackground, BOOL)
RCT_EXPORT_VIEW_PROPERTY(hideNavigationBar, BOOL)
RCT_EXPORT_VIEW_PROPERTY(hideWhenScrolling, BOOL)
RCT_EXPORT_VIEW_PROPERTY(autoCapitalize, UITextAutocapitalizationType)
RCT_EXPORT_VIEW_PROPERTY(placeholder, NSString)
RCT_EXPORT_VIEW_PROPERTY(barTintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(tintColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(textColor, UIColor)
RCT_EXPORT_VIEW_PROPERTY(cancelButtonText, NSString)
RCT_EXPORT_VIEW_PROPERTY(placement, RNSSearchBarPlacement)
RCT_EXPORT_VIEW_PROPERTY(allowToolbarIntegration, BOOL)

RCT_EXPORT_VIEW_PROPERTY(onChangeText, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onCancelButtonPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSearchButtonPress, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSearchFocus, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSearchBlur, RCTDirectEventBlock)

#ifndef RCT_NEW_ARCH_ENABLED

RCT_EXPORT_METHOD(focus : (NSNumber *_Nonnull)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary *viewRegistry) {
    RNSSearchBar *searchBar = viewRegistry[reactTag];
    [searchBar focus];
  }];
}

RCT_EXPORT_METHOD(blur : (NSNumber *_Nonnull)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary *viewRegistry) {
    RNSSearchBar *searchBar = viewRegistry[reactTag];
    [searchBar blur];
  }];
}

RCT_EXPORT_METHOD(clearText : (NSNumber *_Nonnull)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary *viewRegistry) {
    RNSSearchBar *searchBar = viewRegistry[reactTag];
    [searchBar clearText];
  }];
}

RCT_EXPORT_METHOD(toggleCancelButton : (NSNumber *_Nonnull)reactTag flag : (BOOL)flag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary *viewRegistry) {
    RNSSearchBar *searchBar = viewRegistry[reactTag];
    [searchBar toggleCancelButton:flag];
  }];
}

RCT_EXPORT_METHOD(setText : (NSNumber *_Nonnull)reactTag text : (NSString *)text)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary *viewRegistry) {
    RNSSearchBar *searchBar = viewRegistry[reactTag];
    [searchBar setText:text];
  }];
}

RCT_EXPORT_METHOD(cancelSearch : (NSNumber *_Nonnull)reactTag)
{
  [self.bridge.uiManager addUIBlock:^(__unused RCTUIManager *uiManager, NSDictionary *viewRegistry) {
    RNSSearchBar *searchBar = viewRegistry[reactTag];
    [searchBar cancelSearch];
  }];
}

#endif /* !RCT_NEW_ARCH_ENABLED */

@end

@implementation RCTConvert (RNSScreen)

RCT_ENUM_CONVERTER(
    RNSSearchBarPlacement,
    (@{
      @"automatic" : @(RNSSearchBarPlacementAutomatic),
      @"inline" : @(RNSSearchBarPlacementInline),
      @"stacked" : @(RNSSearchBarPlacementStacked),
      @"integrated" : @(RNSSearchBarPlacementIntegrated),
      @"integratedButton" : @(RNSSearchBarPlacementIntegratedButton),
      @"integratedCentered" : @(RNSSearchBarPlacementIntegratedCentered),
    }),
    RNSSearchBarPlacementAutomatic,
    integerValue)

@end
