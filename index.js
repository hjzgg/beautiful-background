"use strict";

var MyAnimation =
{
	number: 32,
	box: null,
	height: null,
	width: null,
	canvas: null,
	ctx: null,
	dots: [],
	ballR: null,
	ballMaxSpeed: 5,
	arr: null,

	resize: function() {
		$(this.box).css('height', $(window).height() + 'px');
		this.height = this.box.clientHeight;
		this.width = this.box.clientWidth;
		var w = parseInt(this.width / this.number);
		this.ballR = parseInt(1.5 * w);
		this.canvas.height = this.height;
		this.canvas.width = this.width;
	},

	visualizer: function() {
		var self = this;
		function animate() {
			self.draw(self.arr);
			requestAnimationFrame(animate);
		}

		requestAnimationFrame(animate);
	},

	draw: function (arr) {
		this.ctx.clearRect(0, 0, this.width, this.height);
		this.drawBallMode(this.arr);
	},

	drawBallMode: function (arr) {
		for (var i = this.number - 1; i >= 0; i--) {
			this.ctx.beginPath();
			var o = this.dots[i];
			var realx = o.x - this.ballR;
			var r = parseInt(arr[i].radius / 256 * this.ballR);
			this.ctx.arc(realx, o.y, r, 0, Math.PI * 2, true);
			var g = this.ctx.createRadialGradient(realx, o.y, 0, realx, o.y, r);
			g.addColorStop(0, '#fff');
			g.addColorStop(1, o.color);

			var temp = o.x;
			o.speed = parseInt((o.speed * 2 + (arr[i].radius / 256 * this.ballMaxSpeed) * 2 / 3) / 3 + 0.5);
			o.x = (o.x + o.speed) % (this.width + 2 * this.ballR);
			if (o.x < temp) {
				o.y = this.randomInt(0, this.height);
			}

			this.ctx.fillStyle = g;
			this.ctx.fill();
		}
	},

	createBalllDots: function () {
		var dotsH = (this.width / this.number / 2) * 0.8;
		for (var i = 0; i < this.number; i++) {
			this.dots[i] = {
				h: dotsH
			}
			this.arr[i] = {
				radius: this.randomInt(0, 255),
				change: this.randomInt(0, this.number) <= this.number/2 ? true : false,
				count: this.randomInt(3, 10),
				step: this.randomInt(20, 30),
				cntIndex: 0
			};
		}
		this.randomDots();
	},

	randomInt: function (s, e) {
		return parseInt(Math.random() * (e - s + 1) + s);
	},

	randomDots: function () {
		var self = this;
		//随机球模式下球的状态
		this.dots.forEach(function (item) {
			item.x = self.randomInt(-self.ballR, self.width + self.ballR);
			item.y = self.randomInt(0, self.height);
			item.color = 'rgba(' + self.randomInt(0, 255) + ',' + self.randomInt(0, 255) + ',' + self.randomInt(0, 255) + ', 0)';
			item.speed = self.randomInt(0, self.ballMaxSpeed);
		});
		//随机球的半径
		setInterval(function () {
			self.arr.forEach(function (value, index, array) {
				if (value.cntIndex >= value.count) {
					value.cntIndex = 0;
					value.change = !value.change;
				}
				if (value.change === true) {//半徑增加
					value.radius += value.step;
				} else {//半徑減小
					value.radius -= value.radius - value.step <= 0 ? 0 : value.step;
				}
				++value.cntIndex;
			})
		}, 250);
	},

	init: function () {
		this.arr = [this.number];
		this.box = document.getElementById('box');
		this.canvas = document.createElement('canvas');
		this.box.appendChild(this.canvas);
		this.ctx = this.canvas.getContext('2d');
		this.resize();
		this.createBalllDots();
		this.visualizer();
	}
}

$(window).bind('resize', MyAnimation.resize.bind(MyAnimation));
$(document).ready(MyAnimation.init.bind(MyAnimation));