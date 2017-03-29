var cheerio = require('cheerio')

function Machine(name, displayName, type, status, time){
	this.name = name;
	this.displayName = displayName;
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
			var name = $('.name', this);
			let displayName = $('.name', this).text().replace(/0+([1-9]+)/, "$1");
			var type = $('.type', this).text();
			var status = $('.status', this).text();
			var time = $('.time', this).text();
			if ( type != '' ){
				results.push(new Machine(name, displayName, type, status, time));
			}
				
		});
	});
	return results;
}