cmake_minimum_required(VERSION 3.9.0)

project(rnscreens)
set(CMAKE_CXX_STANDARD 20)

if(${IS_NEW_ARCHITECTURE_ENABLED})
    string(APPEND CMAKE_CXX_FLAGS " -DRCT_NEW_ARCH_ENABLED")
endif()

if(${IS_NEW_ARCHITECTURE_ENABLED})
add_library(rnscreens
    SHARED
    ../cpp/RNScreensTurboModule.cpp
    ../cpp/RNSScreenRemovalListener.cpp
    ./src/main/cpp/jni-adapter.cpp
    ./src/main/cpp/NativeProxy.cpp
    ./src/main/cpp/OnLoad.cpp
)
else()
add_library(rnscreens
    SHARED
    ../cpp/RNScreensTurboModule.cpp
    ./src/main/cpp/jni-adapter.cpp
)
endif()

include_directories(
    ../cpp
)

target_compile_definitions(
    rnscreens
    PRIVATE
    -DFOLLY_NO_CONFIG=1
)

find_package(ReactAndroid REQUIRED CONFIG)

if(${IS_NEW_ARCHITECTURE_ENABLED})
    find_package(fbjni REQUIRED CONFIG)
    
    target_link_libraries(
        rnscreens
            ReactAndroid::jsi
            ReactAndroid::react_nativemodule_core
            ReactAndroid::react_utils
            ReactAndroid::reactnativejni
            ReactAndroid::fabricjni
            ReactAndroid::react_debug
            ReactAndroid::react_render_core
            ReactAndroid::runtimeexecutor
            ReactAndroid::react_render_graphics
            ReactAndroid::rrc_view
            ReactAndroid::yoga
            ReactAndroid::rrc_text
            ReactAndroid::glog
            ReactAndroid::react_render_componentregistry
            fbjni::fbjni
            android
    )
else()
    target_link_libraries(rnscreens
        ReactAndroid::jsi
        android
    )
endif()
