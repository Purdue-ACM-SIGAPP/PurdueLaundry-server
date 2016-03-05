module.exports = function(req, res){
	var status = ['Available', 'In Use', 'Almost Done', 'End of Cycle', 'Out of Order', 'Offline', 'Ready To Start'];
	res.json(status);
}