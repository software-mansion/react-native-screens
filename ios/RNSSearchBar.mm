#import <UIKit/UIKit.h>

#import "RNSDefines.h"
#import "RNSSearchBar.h"

#import <React/RCTComponent.h>

#import <React/RCTConversions.h>
#import <React/RCTFabricComponentsPlugins.h>
#import <react/renderer/components/rnscreens/ComponentDescriptors.h>
#import <react/renderer/components/rnscreens/EventEmitters.h>
#import <react/renderer/components/rnscreens/Props.h>
#import "RNSConvert.h"

namespace react = facebook::react;

@implementation RNSSearchBar {
  UISearchController *_controller;
  UIColor *_textColor;

  // We use those booleans to log a warning if user attempts to restore
  // default behavior after setting explicit value for the prop.
  BOOL _isObscureBackgroundSet;
  BOOL _isHideNavigationBarSet;
}

@synthesize controller = _controller;

- (instancetype)init
{
  if (self = [super init]) {
    static const auto defaultProps = std::make_shared<const react::RNSSearchBarProps>();
    _props = defaultProps;
    [self initCommonProps];
  }
  return self;
}

- (void)initCommonProps
{
#if !TARGET_OS_TV
  _controller = [[UISearchController alloc] initWithSearchResultsController:nil];
#else
  // on TVOS UISearchController must contain searchResultsController.
  _controller = [[UISearchController alloc] initWithSearchResultsController:[UIViewController new]];
#endif

  _controller.searchBar.delegate = self;

  _isObscureBackgroundSet = NO;
  _isHideNavigationBarSet = NO;

  _hideWhenScrolling = YES;
  _placement = RNSSearchBarPlacementAutomatic;

  _allowToolbarIntegration = YES;
}

- (void)emitOnFocusEvent
{
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSSearchBarEventEmitter>(_eventEmitter)
        ->onSearchFocus(react::RNSSearchBarEventEmitter::OnSearchFocus{});
  }
}

- (void)emitOnBlurEvent
{
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSSearchBarEventEmitter>(_eventEmitter)
        ->onSearchBlur(react::RNSSearchBarEventEmitter::OnSearchBlur{});
  }
}

- (void)emitOnSearchButtonPressEventWithText:(NSString *)text
{
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSSearchBarEventEmitter>(_eventEmitter)
        ->onSearchButtonPress(
            react::RNSSearchBarEventEmitter::OnSearchButtonPress{.text = RCTStringFromNSString(text)});
  }
}

- (void)emitOnCancelButtonPressEvent
{
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSSearchBarEventEmitter>(_eventEmitter)
        ->onCancelButtonPress(react::RNSSearchBarEventEmitter::OnCancelButtonPress{});
  }
}

- (void)emitOnChangeTextEventWithText:(NSString *)text
{
  if (_eventEmitter != nullptr) {
    std::dynamic_pointer_cast<const react::RNSSearchBarEventEmitter>(_eventEmitter)
        ->onChangeText(react::RNSSearchBarEventEmitter::OnChangeText{.text = RCTStringFromNSString(text)});
  }
}

- (void)setObscureBackground:(RNSOptionalBoolean)obscureBackground
{
  switch (obscureBackground) {
    case RNSOptionalBooleanTrue:
      [_controller setObscuresBackgroundDuringPresentation:YES];
      _isObscureBackgroundSet = YES;
      break;

    case RNSOptionalBooleanFalse:
      [_controller setObscuresBackgroundDuringPresentation:NO];
      _isObscureBackgroundSet = YES;
      break;

    default:
      if (_isObscureBackgroundSet) {
        RCTLogWarn(@"[RNScreens] Dynamically restoring obscureBackground to default native behavior is unsupported.");
      }
      break;
  }
}

- (void)setHideNavigationBar:(RNSOptionalBoolean)hideNavigationBar
{
  switch (hideNavigationBar) {
    case RNSOptionalBooleanTrue:
      [_controller setHidesNavigationBarDuringPresentation:YES];
      _isHideNavigationBarSet = YES;
      break;

    case RNSOptionalBooleanFalse:
      [_controller setHidesNavigationBarDuringPresentation:NO];
      _isHideNavigationBarSet = YES;
      break;

    default:
      if (_isHideNavigationBarSet) {
        RCTLogWarn(@"[RNScreens] Dynamically restoring hideNavigationBar to default native behavior is unsupported.");
      }
      break;
  }
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
    [self
        setObscureBackground:[RNSConvert
                                 RNSOptionalBooleanFromRNSSearchBarObscureBackground:newScreenProps.obscureBackground]];
  }

  if (oldScreenProps.hideNavigationBar != newScreenProps.hideNavigationBar) {
    [self
        setHideNavigationBar:[RNSConvert
                                 RNSOptionalBooleanFromRNSSearchBarHideNavigationBar:newScreenProps.hideNavigationBar]];
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

#pragma mark - Dynamic frameworks support

// Needed because of this: https://github.com/facebook/react-native/pull/37274
#ifdef RCT_DYNAMIC_FRAMEWORKS
+ (void)load
{
  [super load];
}
#endif // RCT_DYNAMIC_FRAMEWORKS

@end

Class<RCTComponentViewProtocol> RNSSearchBarCls(void)
{
  return RNSSearchBar.class;
}

@implementation RNSSearchBarManager

RCT_EXPORT_MODULE()

@end
