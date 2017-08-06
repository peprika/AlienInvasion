
var canvas = document.getElementById('game');

var ctx = canvas.getContext && canvas.getContext('2d');

if(!ctx) {
	// No 2d context available, let the user know
	alert('Please upgrade your browser');
	} else {
		startGame();
	}
	
	function startGame() {
		
		var img = new Image();
		img.onload = function() {
			ctx.drawImage(img,0,0,37,42,100,100,50,50);
		}
		img.src = 'images/sprites.png';
	}