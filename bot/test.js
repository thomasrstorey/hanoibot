/*var TOH		= require('../build/Release/toh');

var toh = new TOH.Tower(5);
console.log(toh.next());
console.log(toh.next());
console.log(toh.next());
console.log(toh.next());
console.log(toh.next());
console.log(toh.next());
console.log(toh.next());*/

var allPermutations = function (n) {
	var perms = [];
	for(var i = 97; i != 123; i++){
		for(var j = 97; j != 123; j++){
			if(n == 3){
				for(var k = 97; k != 123; k++){
					perms.push(String.fromCharCode(i, j, k));
				}
			} else {
				perms.push(String.fromCharCode(i, j));
			}
		}
	}
	return perms;
}
console.log(allPermutations(3)[552]);
console.log(allPermutations(2)[100]);
