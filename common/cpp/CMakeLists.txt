cmake_minimum_required(VERSION 3.13)

project(rnscreens_common)

set(CMAKE_VERBOSE_MAKEFILE ON)
set(CMAKE_CXX_STANDARD 17)

file(GLOB SOURCES "rnscreens/*.cpp")

message(WARNING "DETECTED SOURCE FILES: ${SOURCES}")

add_library(
  rnscreens_common
  STATIC
  ${SOURCES}
)

target_link_libraries(
  rnscreens_common
  fbjni
  folly_runtime
  glog
  jsi
  fabricjni
  react_codegen_rncore
  react_debug
  react_nativemodule_core
  react_render_core
  react_render_debug
  react_render_componentregistry
  react_render_graphics
  runtimeexecutor
  rrc_view
  turbomodulejsijni
  react_codegen_rnscreens
  yoga
)

target_compile_options(
  rnscreens_common
  PRIVATE
  -DLOG_TAG=\"ReactNative\"
  -fexceptions
  -frtti
  -std=c++17
  -Wall
)

# LOCAL_CFLAGS := \
#     -DLOG_TAG=\"ReactNative\"
# LOCAL_CFLAGS += -fexceptions -frtti -std=c++17 -Wall

# LOCAL_SHARED_LIBRARIES := libjsi \
    # libfbjni \
    # libglog \
    # libfolly_runtime \
    # libyoga \
    # libreact_nativemodule_core \
    # libturbomodulejsijni \
    # librrc_view \
    # libreact_render_core \
    # libreact_render_graphics \
    # libfabricjni \
    # libreact_debug \
    # libreact_render_componentregistry \
    # libreact_render_debug \
    # libruntimeexecutor \
    # libreact_codegen_rncore \
    # libreact_codegen_rnscreens
