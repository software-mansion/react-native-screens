cmake_minimum_required(VERSION 3.13)
set(CMAKE_VERBOSE_MAKEFILE on)

set(RNS_GENERATED_DIR "/Users/kacperkafara/workspace/swm/kkafar@screens/android/build/generated")
set(RNS_GENERATED_JNI_DIR ${RNS_GENERATED_DIR}/source/codegen/jni)
set(RNS_GENERATED_REACT_DIR ${RNS_GENERATED_JNI_DIR}/react/renderer/components/rnscreens)

message(DEBUG "VARIABLES SET")
message(DEBUG "RNS_GENERATED_DIR ${RNS_GENERATED_DIR}")
message(DEBUG "RNS_GENERATED_JNI_DIR ${RNS_GENERATED_JNI_DIR}")
message(DEBUG "RNS_GENERATED_REACT_DIR ${RNS_GENERATED_REACT_DIR}")
message(DEBUG "PROJECT_SOURCE_DIR ${PROJECT_SOURCE_DIR}")

add_compile_options(
  -fexceptions
  -frtti
  -std=c++17
  -Wall
  -Wpedantic
  -Wno-gnu-zero-variadic-macro-arguments
)

file(GLOB rnscreens_SRCS CONFIGURE_DEPENDS *.cpp react/renderer/components/rnscreens/*.cpp)
file(GLOB rnscreens_codegen_SRCS CONFIGURE_DEPENDS ${RNS_GENERATED_JNI_DIR}/*.cpp ${RNS_GENERATED_REACT_DIR}/*cpp)

message(DEBUG "SOURCES ${rnscreens_SRCS} ${rnscreens_codegen_SRCS}")

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
  react/renderer/components/rnscreens
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