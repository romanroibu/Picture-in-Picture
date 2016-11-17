const FacebookHandler = new function() {
	this.validate = function(event) {
		return this.hasVideo(event) && this.hasMenuList(event);
	};
	this.oncontextmenu = function(event) {
		var video = this.getVideo(event);

		console.log('---> FacebookHandler.oncontextmenu');
		console.log(event);

		tagVideo(video);
		var ul = this.getMenuList(event);
		var pipClass = 'pip_menu_item';
		var pipPresentationMode = 'picture-in-picture';

		var existingMenuItem = ul.querySelector('li.' + pipClass);

		//If video is already in 'Picture-in-Picture' mode
		if (video.webkitPresentationMode == pipPresentationMode) {
			//Remove existing PiP menu item, if it exists
			if (!!existingMenuItem) existingMenuItem.remove();
			//Nothing more to do
			return;
		}

		//If video not already in 'Picture-in-Picture' mode,
		//But menu item already exists, do nothing
		if (!!existingMenuItem) return;

		//Otherwise, create a new 'Picture-in-Picture' menu item
		var li = createMenuItem(ul, 'Picture-in-Picture');
		li.className = li.className ? (li.className + ' ' + pipClass) : pipClass;
		li.onclick = function(e) {
			var video = getTaggedVideo();
			if (!video) { return; }

			//Simulate 'Play' menu item click
			//To make the menu disapear
			var play = ul.querySelector('li');
			if (!!play) play.click();

			video.muted = false;
			video.volume = 1;
			video.webkitSetPresentationMode(pipPresentationMode);
			video.play().then(function(value) { video.play(); });

			//TODO: when the user scrolls past the video, the image is black, but the sound continues to play.
		};
		ul.appendChild(li);
	};

//Event

	this.hasVideo = function(event) {
		return !!this.getVideo(event);
	}
	this.getVideo = function(event) {
		//TODO: Sometimes doesn't work when there's a 'click for more' overlay
		return this.getOverlayVideo(event) || this.getFeedVideo(event) || this.getPageVideo(event) || null;
	};
	this.getOverlayVideo = function(event) {
		//TODO: Doesn't work for LIVE videos...
		return document.querySelector('.fbPhotoSnowliftContainer video')
	};
	this.getFeedVideo = function(event) {
		var element = document.elementFromPoint(event.x-1, event.y-1);
		if (!element) return null;
		return element.closest('video');
	};
	this.getPageVideo = function(event) {
		var element = document.elementFromPoint(event.x-1, event.y-1);
		if (!element) return null;
		var element = element.parentNode;
		if (!element) return null;
		var element = element.parentNode;
		if (!element) return null;
		return element.querySelector('video');
	}

//Video Tagging

	function tagVideo(video) {
		var taggedVideo = getTaggedVideo();
		if (taggedVideo) {
			taggedVideo.removeAttribute('pip-id');
		};
		video.setAttribute('pip-id', '1');
	};
	function getTaggedVideo() {
		return document.querySelector('video[pip-id="1"]');
	};

//Menu List

	this.hasMenuList = function(event) {
		return !!this.getMenuList(event);
	};
	this.getMenuList = function(event) {
		return document.elementFromPoint(event.x, event.y).querySelector('ul');
	};
	function createMenuItem(ul, title) {
		var old = ul.querySelector('li');
		var li = recursiveCloneNode(old);
		replaceText(li, title);

		return li;
	};

//Helpers

	function recursiveCloneNode(node) {
		var newNode = node.cloneNode();
		array(node.childNodes).forEach(
			function(child) {
				var newChild = recursiveCloneNode(child);
				newNode.appendChild(newChild);
			}
		);
		return newNode;
	};

	function replaceText(li, text) {
		//TODO: This is hardcoded, for now... Also, sometimes doesn't work ¯\_(ツ)_/¯
		li.querySelector('a span span').innerText = text;
	};

	//Create an array of nodes from an node list instance
	function array(nodeList) {
		return Array.prototype.slice.call(nodeList, 0);
	};
};

