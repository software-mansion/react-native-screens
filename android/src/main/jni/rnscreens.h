#pragma once

#include <ReactCommon/JavaTurboModule.h>
#include <ReactCommon/TurboModule.h>
#include <jsi/jsi.h>

/**
 * Note this import and that it is not present in autogenerated header file
 * under android/build/generated/source/codegen/jni/rnscreens.h
 * 
 * It is added here to make our custom symbols visible in autogenerated file with 
 * code responsible for registering component descriptor providers. See that rncli.cpp, 
 * located under <App>/android/app/build/generated/rncli/src/main/jni/rncli.cpp,
 * includes autogenerated rnscreens.h header by default. We change this behaviour
 * by appropriate include path configuration so that this header file gets included.
 * 
 * See: https://github.com/software-mansion/react-native-screens/pull/1585
 */
#include <react/renderer/components/rnscreens/RNSScreenComponentDescriptor.h>
#include <react/renderer/components/rnscreens/RNSModalScreenComponentDescriptor.h>
#include <react/renderer/components/rnscreens/RNSScreenStackHeaderConfigComponentDescriptor.h>

namespace facebook {
namespace react {

JSI_EXPORT
std::shared_ptr<TurboModule> rnscreens_ModuleProvider(const std::string &moduleName, const JavaTurboModule::InitParams &params);

} // namespace react
} // namespace facebook
