var args = arguments[0] || {};

function chart(){
	if(OS_IOS || OS_ANDROID){
		require("/charts/chart")();
	}	
}