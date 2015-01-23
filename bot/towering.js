module.exports = function (io, mongoose) {

	var config		= require('./cfg.js');
	var Bot 		= require('./bot');
	var bot = new Bot(config.rate, config.depth, io, mongoose);
	bot.init();

}
