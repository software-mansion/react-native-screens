cmake_minimum_required(VERSION 3.9.0)

project(rnscreens)

add_library(rnscreens
    SHARED
    ../cpp/RNScreensTurboModule.cpp
    ./src/main/cpp/jni-adapter.cpp
)

include_directories(
    ../cpp
)

set_target_properties(rnscreens PROPERTIES
    CXX_STANDARD 17
    CXX_STANDARD_REQUIRED ON
    CXX_EXTENSIONS OFF
    POSITION_INDEPENDENT_CODE ON
)

find_package(ReactAndroid REQUIRED CONFIG)

target_link_libraries(rnscreens
    ReactAndroid::jsi
    android
)
