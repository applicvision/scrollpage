module.exports = window.requestAnimationFrame ||
	window.webkitRequestAnimationFrame ||
	window.mozRequestAnimationFrame ||
	window.msRequestAnimationFrame ||
	function (cb) { setTimeout(cb, 1000 / 60); };
