window.onload = function() {
  document.getElementById("start-button").onclick = function() {
    startGame();
  };

  function startGame() {
    myGameArea.start();
    background.draw();
    player.update();
  }

  const myGameArea = {
    canvas: document.querySelector('#my-canvas'),
    myObstacles: [],
    frames: 0,
    start: function() {
      this.context = this.canvas.getContext('2d');
      this.canvas.width = 900;
      this.canvas.height = 500;
      this.interval = setInterval(updateGameArea, 20);
    },
    clear: function () {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
      clearInterval(this.interval);
      setTimeout(this.gameOver, 1000);
    },
    score: function () {
      this.points = Math.floor(this.frames / 50);
      this.context.fillStyle = '#FFFFFF';
      this.context.font = '18px serif';
      this.context.fillText(`SCORE: ${this.points}`, 20, 50);
    },
    gameOver: function () {
      myGameArea.clear();
      myGameArea.context.textAlign = 'center'
      myGameArea.context.fillStyle = 'black';
      myGameArea.context.fillRect(0, 0, myGameArea.canvas.width, myGameArea.canvas.height);
      myGameArea.context.fillStyle = 'red';
      myGameArea.context.font = '38px serif';
      myGameArea.context.fillText('GAME OVER', myGameArea.canvas.width/2, myGameArea.canvas.height/2);
      myGameArea.context.fillText(`FINAL SCORE: ${myGameArea.points}`, myGameArea.canvas.width / 2, myGameArea.canvas.height * 2/3);
    }
  }

  function updateGameArea() {
    myGameArea.clear();
    background.move();
    background.draw();
    player.newPos();
    player.update();
    updateObstacles();
    myGameArea.frames += 1;
    myGameArea.score();
    checkGameOver();
  }

  function updateObstacles() {
    for (let i = 0; i < myGameArea.myObstacles.length ; i += 1){
      myGameArea.myObstacles[i].newPos();
      myGameArea.myObstacles[i].update();
    }
    if (myGameArea.frames % 160 === 0) {
      const minGap = 70;
      const maxGap = 140;
      const gap = Math.floor(Math.random() * (maxGap - minGap) + minGap);
      const minHeight = 100;
      const maxHeight = 300;
      const height = Math.floor(Math.random() * (maxHeight - minHeight) + minHeight);
      const canvasW = myGameArea.canvas.width;
      const canvasH = myGameArea.canvas.height;
      myGameArea.myObstacles.push(new Obstacle(canvasW, 0, 80, height, 'top'));
      myGameArea.myObstacles.push(new Obstacle(canvasW, height + gap, 80, canvasH - height - gap, 'bottom'));
    }
  }

  function checkGameOver() {
    for (let i = 0; i < myGameArea.myObstacles.length; i += 1) {
      if (player.crashWith(myGameArea.myObstacles[i]) || player.outOfBonds()){
        myGameArea.stop();
      }
    }
  }

  class Background {
    constructor(source){
      this.img = new Image();
      this.img.src = source;
      this.x = 0;
      this.y = 0;
    }
    draw() {
      myGameArea.context.drawImage(this.img, this.x, this.y)
    }
  }

  class ScrollingBackground {
    constructor (source) {
      this.img = new Image();
      this.img.src = source;
      this.x = 0;
      this.y = 0;
      this.speed = -1;
    }
    move () {
      this.x += this.speed;
      this.x %= myGameArea.canvas.width;
    }
    draw () {
      myGameArea.context.drawImage(this.img, this.x, this.y);
      if (this.speed < 0) {
        myGameArea.context.drawImage(this.img, this.x + this.img.width, 0);
      } else {
        myGameArea.context.drawImage(this.img, this.x - this.img.width, 0);
      }
    }
  }
  const background = new ScrollingBackground('../images/bg.png');

  class Faby {
    constructor(source, x, y, width, height) {
      this.img = new Image();
      this.img.src = source;
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.speedY = 0;
      this.gravity = 0.1;
      this.pull = 0;
    }
    update() {
      this.ctx = myGameArea.context;
      this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    newPos() {
      this.speedY += (this.gravity - this.pull);
      this.y += this.speedY;
    }
    top() {
      return this.y;
    }
    bottom() {
      return this.y + this.height;
    }
    left() {
      return this.x;
    }
    right() {
      return this.x + this.width;
    }
    crashWith(obst) {
      return !(this.top() > obst.bottom() ||
          this.bottom() < obst.top() ||
          this.left() > obst.right() ||
          this.right() < obst.left())
    }
    outOfBonds() {
      return (this.top() < 0 || this.bottom() > myGameArea.canvas.height)
    }
  }
  const player = new Faby('../images/flappy.png', 50, 200, 50, 35);

  class Obstacle {
    constructor (x, y, width, height, side) {
      this.x = x;
      this.y = y;
      this.width = width;
      this.height = height;
      this.side = side;
    }
    update() {
      this.img = new Image();
      if (this.side === 'top') {
        this.img.src = '../images/obstacle_top.png';
      } else {
        this.img.src = '../images/obstacle_bottom.png';
      }
      this.ctx = myGameArea.context;
      this.ctx.drawImage(this.img, this.x, this.y, this.width, this.height);
    }
    newPos() {
      this.x -= 2;
    }
    top() {
      return this.y;
    }
    bottom() {
      return this.y + this.height;
    }
    left() {
      return this.x;
    }
    right() {
      return this.x + this.width;
    }
  }


  document.addEventListener('keydown', (e) => {
    if (e.keyCode === 32 || e.keyCode === 38) {
      player.pull = 0.3;
    }
  })
  document.addEventListener('keyup', (e) => {
    if (e.keyCode === 32 || e.keyCode === 38) {
      player.pull = 0;
    }
  })
};
