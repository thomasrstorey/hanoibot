#define BUILDING_NODE_EXTENSION

#include <node.h>
#include "tower.h"
#include "stack.h"
#include <iostream>
#include <thread>         // std::thread, std::this_thread::yield
#include <atomic> 
#include <string> 

using namespace v8;

Persistent<Function> Tower::constructor;

Tower::Tower(double depth_) : depth(depth_), ready(false) {
	for(int i = 0; i != 3; ++i){
		pegs[i] = new Stack<int>;
	}
	for(int i = depth_; i != 0; --i){
		pegs[0].push(i);
	}
	thread = std::thread(&Tower::hanoi, this, depth, -1, pegs);
}

Tower::~Tower(){}

void Tower::pretty_print(Stack<int>* t){
	for(int i = 5, q = 0; i > 0, q < 5; --i, ++q){//loop through each level
		for(int j = 0; j != 3; ++j){//loop through each peg
			std::cout << "     ";
			//is there a peg with size >= level? if so, pop off the top and print it at the appropriate spot for this peg
			if(t[j].length() >= i){
				int e = t[j].length() - i;
				int disk = t[j].peek(e);
				std::cout << disk;
			} else {
				std::cout << "|";
			}
		}
		std::cout << std::endl;
	}
	std::cout << std::endl;
}

std::string Tower::stringify(Stack<int>* t){

	std::vector<int> msgArray(depth, 0);
	for(int i = 0; i != 3; ++i) {
		std::vector<int> v = pegs[i].vectorize();
		for(int j = 0; j != v.size(); ++j) {
			msgArray[v[j]] = i;
		}
	}
	std::string msg;
	for(int k = 1; k <= (int)depth; ++k) {
		if(msgArray[k] == 0){
			const char f = 'a';
			msg+='a';
		} else if(msgArray[k] == 1) {
			const char f = 'b';
			msg+='b';
		} else if(msgArray[k] == 2) {
			const char f = 'c';
			msg+='c';
		} else {
			const char f = 'z';
			msg+='z';
		}
	}
	return msg;
}


void Tower::shift(int N, int d, Stack<int>* t){
	for(int i = 0; i != 3; ++i){
		if(!t[i].is_empty() && t[i].peek(0) == N){
			int disk = t[i].pop();
			if(d > 0){
				t[(i+1)%3].push(disk);
			} else if (d < 0){
				t[(i+2)%3].push(disk);
			}
			//pretty_print(t);
			break;
		}
	}
}

void Tower::hanoi(int N, int d, Stack<int>* t){
	while (!ready) {
		std::this_thread::yield();
	}
	if(N == 0) return;
	hanoi(N-1, -d, t);
	shift(N, d, t);
	ready = false;
	hanoi(N-1, -d, t);
}

void Tower::Init(Handle<Object> exports) {
	// prepare constructor template

	Local<FunctionTemplate> ft = FunctionTemplate::New(New);
	ft->SetClassName(String::NewSymbol("Tower"));
	ft->InstanceTemplate()->SetInternalFieldCount(1);

	// prototype

	ft->PrototypeTemplate()->Set(String::NewSymbol("next"),
		FunctionTemplate::New(Next)->GetFunction());
	constructor = Persistent<Function>::New(ft->GetFunction());
	exports->Set(String::NewSymbol("Tower"), constructor);
}

Handle<Value> Tower::New(const Arguments& args) {
	HandleScope scope;

	if(args.IsConstructCall()) {
		// if invoked as constructor ( 'new Tower(depth);' )
		double depth_ = args[0]->IsUndefined() ? 0 : args[0]->NumberValue();
		Tower* tow = new Tower(depth_);
		tow->Wrap(args.This());
		return args.This();
	} else {
		// otherwise invoked as a plain function ( 'Tower(depth);' )
		// turn into a construct call
		const int argc = 1;
		Local<Value> argv[argc] = { args[0] };
		return scope.Close(constructor->NewInstance(argc, argv));
	}
}
// next implementation - get next tower state
Handle<Value> Tower::Next(const Arguments& args) {
	HandleScope scope;
	Tower* tow = ObjectWrap::Unwrap<Tower>(args.This());

	tow->ready = true;
	while(tow->ready){
		std::this_thread::yield();
	}

	std::string str_rep = tow->stringify(tow->pegs);

	return scope.Close(String::New(str_rep.c_str()));
}

