
var Game = new function() {

	// Game initialization
	this.initialize = function(canvasElementId, sprite_data, callback) {

		this.canvas = document.getElementById(canvasElementId);
		this.width = this.canvas.width;
		this.height = this.canvas.height;
		
		// Set up rendering context
		this.ctx = this.canvas.getContext && this.canvas.getContext('2d');
		
		if(!this.ctx) { return alert("Please upgrade your browser to play"); }
		
		// Set up input
		this.setupInput();
		
		// Start the game loop
		this.loop();
		
		// Load the sprite sheet and pass forward the callback.
		SpriteSheet.load(sprite_data, callback);
};

// Handle input
var KEY_CODES = { 37:'left', 39:'right', 32:'fire' };
this.keys = {};
this.setupInput = function () {
	window.addEventListener('keydown', function(e) {
		if(KEY_CODES[e.keyCode]) {
			Game.keys[KEY_CODES[e.keyCode]] = true;
			e.preventDefault();
		}
	},false);
	window.addEventListener('keyup', function(e) {
		if(KEY_CODES[e.keyCode]) {
			Game.keys[KEY_CODES[e.keyCode]] = false;
			e.preventDefault();
		}
	},false);
}

// Game loop
var boards = [];
this.loop = function() {
	var dt = 30/1000;
	for(var i = 0, len = boards.length; i < len; i++) {
		if(boards[i]) {
			boards[i].step(dt);
			boards[i] && boards[i].draw(Game.ctx);
		}
	}
	setTimeout(Game.loop, 30);
	};
	// Change an active game board
	this.setBoard = function(num, board) { boards[num] = board; };
	
};

// The SpriteSheet class
var SpriteSheet = new function() {
 this.map = { };
 this.load = function(spriteData, callback) {
	 this.map = spriteData;
	 this.image = new Image();
	 this.image.onload = callback;
	 this.image.src = 'images/sprites.png';
 };
 
 this.draw = function(ctx, sprite, x, y, frame) {
	 var s = this.map[sprite];
	 if(!frame) frame = 0;
	 ctx.drawImage(this.image,
					s.sx + frame * s.w,
					s.sy,
					s.w, s.h,
					x,	 y,
					s.w, s.h);
	};
 }
 
 // Title screen
var TitleScreen = function TitleScreen(title, subtitle, callback) {
	this.step = function(dt) {
		if(Game.keys['fire'] && callback) callback();
	};
	
	this.draw = function(ctx) {
		ctx.fillStyle = "#FFFFFF";
		ctx.textAlign = "center";
		
		ctx.font = "bold 40px bangers";
		ctx.fillText(title, Game.width/2, Game.height/2);
		
		ctx.font = "bold 20px bangers";
		ctx.fillText(subtitle, Game.width/2, Game.height/2 + 40);
	};
}

// GameBoard
var GameBoard = function() {
	var board = this;
	// The current list of objects
	this.objects = [];
	this.cnt = [];
	
	// Add a new object to the object list
	this.add = function(obj) {
		// Gives access to the board
		obj.board = this;
		// Adds the object
		this.objects.push(obj);
		// Keep count of objects types
		this.cnt[obj.type] = (this.cnt[obj.type] || 0) + 1;
		return obj;
	};
	
	// Mark an object for removal
	this.remove = function(obj) {
		var wasStillAlive = this.removed.indexOf(obj) != -1;
		if(wasStillAlive) { this.removed.push(obj); }
		return wasStillAlive;
	};
	
	// Reset the list of removed objects
	this.resetRemoved = function() {this.removed = []; }
	
	// Remove objects marked for removal from th elist
	this.finalizeRemoved = function() {
		for(var i = 0, len = this.removed.legnth; i < len; i ++) {
			// Check for removed objects
			var idx = this.objects.indexOf(this.removed[i]);
			if(idx != -1) {
				this.cnt[this.removed[i].type]--;
				// Cut the removed objects off the list
				this.objects.splice(idx,1);
			}
		}
	}
}