const SharedHandler = new function() {
	this.init = function() {
		document.addEventListener("contextmenu", this.pipContextMenu, true);
	};
	this.pipContextMenu = function(event) {
		// console.log('---> pipContextMenu:');
		// console.log(event);

		var facebook = facebookInit(event, 1000);
		facebook();
	};

	function facebookInit(event, maxCallCount) {
		var callCount = 0;
		var f = function() {
			if (FacebookHandler.validate(event)) {
				FacebookHandler.oncontextmenu(event);
			} else if (callCount < maxCallCount) {
				callCount += 1;
				setTimeout(f, 10);
			}
		}
		return f;
	};
}

SharedHandler.init();

