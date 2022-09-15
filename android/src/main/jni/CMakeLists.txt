cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

set(RNS_ANDROID_DIR ${CMAKE_CURRENT_SOURCE_DIR}/../../..)
set(RNS_COMMON_DIR ${RNS_ANDROID_DIR}/../common/cpp)
set(RNS_GENERATED_DIR ${RNS_ANDROID_DIR}/build/generated)
set(RNS_GENERATED_JNI_DIR ${RNS_GENERATED_DIR}/source/codegen/jni)
set(RNS_GENERATED_REACT_DIR ${RNS_GENERATED_JNI_DIR}/react/renderer/components/rnscreens)

add_compile_options(
  -fexceptions
  -frtti
  -std=c++17
  -Wall
  -Wpedantic
  -Wno-gnu-zero-variadic-macro-arguments
)

file(GLOB rnscreens_SRCS CONFIGURE_DEPENDS *.cpp ${RNS_COMMON_DIR}/react/renderer/components/rnscreens/*.cpp)
file(GLOB rnscreens_codegen_SRCS CONFIGURE_DEPENDS ${RNS_GENERATED_REACT_DIR}/*cpp)

add_library(
  react_codegen_rnscreens
  SHARED 
  ${rnscreens_SRCS}
  ${rnscreens_codegen_SRCS}
)

target_include_directories(
  react_codegen_rnscreens 
  PUBLIC 
  . 
  ${RNS_COMMON_DIR}
  ${RNS_GENERATED_JNI_DIR}
  ${RNS_GENERATED_REACT_DIR}
)

target_link_libraries(
  react_codegen_rnscreens
  fbjni
  folly_runtime
  glog
  jsi
  react_codegen_rncore
  react_debug
  react_nativemodule_core
  react_render_core
  react_render_debug
  react_render_graphics
  react_render_mapbuffer
  rrc_view
  turbomodulejsijni
  yoga
)

target_compile_options(
  react_codegen_rnscreens
  PRIVATE
  -DLOG_TAG=\"ReactNative\"
  -fexceptions
  -frtti
  -std=c++17
  -Wall
)

target_include_directories(
 ${CMAKE_PROJECT_NAME}
 PUBLIC
 ${CMAKE_CURRENT_SOURCE_DIR}
)
