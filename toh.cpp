#include <node.h>
#include <v8.h>
#include "tower.h"

using namespace v8;

void InitAll (Handle<Object> exports) {
	Tower::Init(exports);
}

NODE_MODULE(toh, InitAll)
