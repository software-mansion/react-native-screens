#pragma once

#import <Foundation/Foundation.h>

/**
 * Where the header of a stack screen is rendered.
 *
 * - `RNSStackHeaderModeFloat`: the screen uses the navigation bar shared by
 *   the whole stack (the navigation controller's bar).
 * - `RNSStackHeaderModeScreen`: the screen renders its own navigation bar,
 *   which is a part of the screen's view and moves together with it.
 */
typedef NS_ENUM(NSInteger, RNSStackHeaderMode) {
  RNSStackHeaderModeFloat,
  RNSStackHeaderModeScreen,
};
