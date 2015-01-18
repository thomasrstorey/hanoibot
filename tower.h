#ifndef TOWER_H
#define TOWER_H

#include <node.h>
#include "stack.h"
#include <atomic>
#include <thread> 
#include <string>

class Tower : public node::ObjectWrap {
	
	private:

		explicit Tower(double depth_ = 8);
		~Tower();

		static v8::Handle<v8::Value> New(const v8::Arguments& args);
		static v8::Handle<v8::Value> Next(const v8::Arguments& args);
		static v8::Persistent<v8::Function> constructor;
		double depth;
		Stack<int> pegs[3];
		std::atomic<bool> ready;
		std::thread thread;
		void shift(int N, int d, Stack<int>* t);
		void hanoi(int N, int d, Stack<int>* t);
		void pretty_print(Stack<int>* t);
		std::string stringify(Stack<int>* t);

	public:

		static void Init(v8::Handle<v8::Object> exports);

};

#endif