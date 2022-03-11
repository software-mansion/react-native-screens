#include <fbjni/fbjni.h>

#include "RNScreensComponentsRegistry.h"

JNIEXPORT jint JNICALL JNI_OnLoad(JavaVM *vm, void *) {
  return facebook::jni::initialize(vm, [] {
    facebook::react::RNScreensComponentsRegistry::registerNatives();
  });
}
