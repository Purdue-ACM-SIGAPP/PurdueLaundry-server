var cheerio = require('cheerio')

function Machine(name, type, status, time){
	this.name = name;
	this.type = type;
	this.status = status;
	this.time = time;
};

module.exports = function(body){
	var results = [];
	$ = cheerio.load(body);
	$('tr').map(function(i,el){
		if ( $(this).attr('class') === '' ){
			return;
		}
		$(this).map(function(j, child){
			var name = $('.name', this).text();
			var type = $('.type', this).text();
			var status = $('.status', this).text();
			var time = $('.time', this).text();
			if ( type != '' ){
				results.push(new Machine(name, type, status, time));
			}
				
		});
	});
	return results;
}