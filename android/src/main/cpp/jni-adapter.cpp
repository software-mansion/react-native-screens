#include <jni.h>
#include <jsi/jsi.h>
#include "test.h"

using namespace facebook;

void install(jsi::Runtime& runtime) {
    // add box2d api
//    auto box2dApi = std::make_shared<Box2d::JSIBox2dApi>(runtime);
//    auto box2dApiHostObject = jsi::Object::createFromHostObject(runtime, box2dApi);
//    runtime.global().setProperty(runtime, "Box2dApi", std::move(box2dApiHostObject));
}

extern "C"
JNIEXPORT void JNICALL
Java_com_swmansion_rnscreens_ScreensModule_nativeInstall(JNIEnv *env, jobject thiz, jlong jsiPtr) {
    auto runtime = reinterpret_cast<jsi::Runtime*>(jsiPtr);
    if (runtime) {
         install(*runtime);
    }
    RNScreens::Test::test();
}