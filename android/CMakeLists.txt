cmake_minimum_required(VERSION 3.9.0)

project(rnscreens)

add_library(rnscreens
    SHARED
    ../cpp/legacy/RNScreensTurboModule.cpp
    ../cpp/legacy/RNSScreenRemovalListener.cpp
    ./src/main/cpp/jni-adapter.cpp
    ./src/main/cpp/NativeProxy.cpp
    ./src/main/cpp/OnLoad.cpp
)

include_directories(
    ../cpp
    ../cpp/legacy
)

set_target_properties(rnscreens PROPERTIES
    CXX_STANDARD 20
    CXX_STANDARD_REQUIRED ON
    CXX_EXTENSIONS OFF
    POSITION_INDEPENDENT_CODE ON
)

target_compile_definitions(
    rnscreens
    PRIVATE
    -DFOLLY_NO_CONFIG=1
)

find_package(ReactAndroid REQUIRED CONFIG)
find_package(fbjni REQUIRED CONFIG)

target_link_libraries(rnscreens
    ReactAndroid::reactnative
    ReactAndroid::jsi
    fbjni::fbjni
    android
)
