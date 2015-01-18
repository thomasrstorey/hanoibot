#ifndef STACK_H
#define STACK_H

#include <vector>

template <typename T>
class Stack{
private:
	struct Node{
		T item;
		Node* next;
		Node(T x){
			item = x;
			next = 0;
		}
	};
	typedef Node* Link;
	Link head;
	int size;

public:
	Stack(){
		head = 0;
		size = 0;
	}

	Stack(Stack* src){
		head = 0;
		size = src->size;
		Link srcl = src->head;
		Link l = head;
		while(srcl != 0){
			if(head == 0){
				head = new Node(srcl->item);
				l = head;
				srcl = srcl->next;
			} else {
				l->next = new Node(srcl->item);
				l = l->next;
				srcl = srcl->next;
			}
		}
	}

	void push(T x){
		Link l = new Node(x);
		l->next = head;
		head = l;
		++size;
	}

	T peek(int p){
			Link l = head;
			for(int i = 0; i != p; ++i){
				l = l->next;
			}
			return l->item;
	}

	T pop(){
		if(!is_empty()){
			Link l = head;
			head = head->next;
			T item = l->item;
			delete l;
			--size;
			return item;
		}
	}

	bool is_empty(){
		return size == 0;
	}

	int length(){
		return size;
	}

	std::vector<T> vectorize(){
		std::vector<T> v;
		for(int i = 0; i!=size; ++i){
			v.push_back(peek(i));
		}
		return v;
	}

};
#endif