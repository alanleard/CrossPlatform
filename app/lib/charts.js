module.exports = open;

function open(){

	var win = Titanium.UI.createWindow({
	    backgroundColor : '#fff'
	});
	 
	var chartView = Ti.UI.createWebView({
	    height : 250,
	    width : "100%",
	    left : 0,
	    top : 20,
	    showScrollbars : false,
	    touchEnabled : false,
	    url : '/charts/chart.html',
	    backgroundColor : "gray"
	 
	});
	win.add(chartView);
	 
	var button = Ti.UI.createButton({
	    title : 'Generate New Chart',
	    top : 270,
	});
	win.add(button);
	
	var done = Ti.UI.createButton({
	    title : 'Done',
	    top : 310
	});
	win.add(done);
	 
	button.addEventListener('click', doChart);
	
	function doChart() {
	    var options = {};
	    options.data = new Array(Math.floor(Math.random() * 1001), Math.floor(Math.random() * 1001),Math.floor(Math.random() * 1001),Math.floor(Math.random() * 1001),Math.floor(Math.random() * 1001));
	    setTimeout(function() {
	        Ti.App.fireEvent('renderChart', options);
	    }, 400);
	 
	};
	 
	done.addEventListener("click", function(){
		win.close();
	});
	
	win.open();
	
	doChart();
}