cmake_minimum_required(VERSION 3.9.0)

project(rnscreens)
set(CMAKE_CXX_STANDARD 20)

if(${IS_NEW_ARCHITECTURE_ENABLED})
    string(APPEND CMAKE_CXX_FLAGS " -DRCT_NEW_ARCH_ENABLED")
endif()

add_library(rnscreens
    SHARED
    ../cpp/RNScreensTurboModule.cpp
        ./src/main/cpp/jni-adapter.cpp
        ./src/main/cpp/listener.cpp
        ./src/main/cpp/NativeProxy.cpp
        ./src/main/cpp/OnLoad.cpp
)

include_directories(
    ../cpp
)

target_compile_definitions(
        rnscreens
        PRIVATE
        -DFOLLY_NO_CONFIG=1
)

target_include_directories(
        rnscreens
        PRIVATE
        "${REACT_NATIVE_DIR}/ReactAndroid/src/main/jni/react/turbomodule"
        "${REACT_NATIVE_DIR}/ReactCommon"
        "${REACT_NATIVE_DIR}/ReactCommon/callinvoker"
        "${REACT_NATIVE_DIR}/ReactCommon/react/renderer/graphics/platform/cxx"
        "${REACT_NATIVE_DIR}/ReactCommon/runtimeexecutor"
        "${REACT_NATIVE_DIR}/ReactCommon/yoga"
)

find_package(ReactAndroid REQUIRED CONFIG)
find_package(fbjni REQUIRED CONFIG)

if(${IS_NEW_ARCHITECTURE_ENABLED})
    target_link_libraries(
        rnscreens
            ReactAndroid::folly_runtime
            ReactAndroid::react_nativemodule_core
            ReactAndroid::react_render_uimanager
            ReactAndroid::react_render_scheduler
            ReactAndroid::react_utils
            ReactAndroid::reactnativejni
            ReactAndroid::fabricjni
            ReactAndroid::react_debug
            ReactAndroid::react_render_core
            ReactAndroid::react_render_mounting
            ReactAndroid::runtimeexecutor
            ReactAndroid::react_render_graphics
            ReactAndroid::rrc_view
            ReactAndroid::yoga
            ReactAndroid::rrc_text
            ReactAndroid::rrc_textinput
            ReactAndroid::react_render_textlayoutmanager
            ReactAndroid::glog
            ReactAndroid::react_render_componentregistry
            fbjni::fbjni
    )
endif()

target_link_libraries(rnscreens
    ReactAndroid::jsi
    fbjni::fbjni
    android
)
