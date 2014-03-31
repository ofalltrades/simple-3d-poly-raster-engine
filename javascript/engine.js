// engine namespace
var engine = engine || {};

engine.init = function(modelName) {
  this.canvas        = document.getElementById("canvas");
  this.context       = this.canvas.getContext("2d");
  this.screenWidth   = this.context.canvas.clientWidth;
  this.screenHeight  = this.context.canvas.clientHeight;
  this.screenCenterX = this.screenWidth / 2;
  this.screenCenterY = this.screenHeight / 2;

  this.backbufferCanvas  = document.createElement("canvas");
  this.backbufferContext = this.backbufferCanvas.getContext("2d");

  this.targetFrameTime    = 1.0 / 60.0;
  this.startTime          = null;
  this.endTime            = null;
  this.elapsedTime        = 0.0;
  this.frameRateTime      = 0;
  this.frameRateCount     = 0;
  this.frameRefreshRate   = 1;
  this.sleepTime          = null;
  this.cycleTime          = null;
  this.fps                = 0;
  this.elapsedTimeInFrame = 0.0;

  this.imageData = null;

  alert(modelName);

  this.loadModel(modelName);
  this.animate(modelName);
};

engine.animate = function (modelName) {   // why must all calls to engine data be prefixed with engine instead of this
  engine.startTime = new Date();

  //clear backbuffer
  engine.backbufferContext.clearRect(0, 0, engine.screenWidth, engine.screenHeight);
  engine.backbufferContext.save();

  engine.renderScene(engine.backbufferContext);

  engine.backbufferContext.restore();
  engine.imageData = engine.backbufferContext.getImageData(0, 0, engine.screenWidth, engine.screenHeight);
  engine.context.putImageData(engine.imageData, 0, 0);

  engine.endTime            = new Date();
  engine.elapsedTimeInFrame = (engine.endTime.valueOf() - engine.startTime.valueOf()) / 1000;
  engine.sleepTime          = engine.targetFrameTime - engine.elapsedTimeInFrame;

  if (engine.sleepTime < 0) engine.sleepTime = 0;

  engine.cycleTime      = engine.elapsedTimeInFrame + engine.sleepTime;
  engine.frameRateTime += engine.cycleTime;

  if (engine.frameRateTime >= engine.frameRefreshRate) {
    engine.fps = engine.frameRateCount / engine.frameRefreshRate;

    document.getElementById("fps").value = engine.fps + "";

    engine.frameRateTime  = 0;
    engine.frameRateCount = 0;
  }

  engine.frameRateCount++;

  engine.elapsedTime += engine.cycleTime;
  setTimeout(engine.animate, engine.sleepTime * 1000); // somehow clearing data referenced with 'this'
};

engine.renderScene = function () {
  this.drawTriangle(20, 100, 100, 50, 150, 110, BRIGHT_BLUE);
};

engine.loadModel = function () {
  alert("loadModel");
};

engine.reset = function (modelName) {
  alert(modelName);
  this.model = null;
  this.loadModel(this.model);
  this.animate(this.model);
};


// drawing functions
engine.drawPixel = function (x, y, color) {
  this.backbufferContext.save();
  this.backbufferContext.fillStyle = "rgb(" + color.r + "," + color.g + "," + color.b + ")";
  this.backbufferContext.fillRect(x, y, 1, 1);
  this.backbufferContext.restore();
};

engine.drawLine = function (x1, y1, x2, y2, color) { // review this to understand better
  // Digital Differential Analyzer line algorithm (y = mx + c)
  // referenced from http://www.sunshine2k.de/coding/java/Bresenham/RasterisingLinesCircles.pdf
  var len = (Math.abs(x2 - x1) >= Math.abs(y2 - y1)) ? Math.abs(x2 - x1) : Math.abs(y2 - y1),
      dx  = (x2 - x1) / len,
      dy  = (y2 - y1) / len;

  var x = 0.0 + x1;
  var y = 0.0 + y1;

  for (var i = 0; i < len; i++) {
    this.drawPixel(Math.round(x), Math.round(y), color);
    x += dx;
    y += dy;
  }
  this.drawPixel(x2, y2, color); // draw final pixel
}; 

engine.drawCanvasLine = function (x1, y1, x2, y2, color) {
  // draw line using canvas context
  this.backbufferContext.save();
  
  this.backbufferContext.lineCap = "butt";
  this.backbufferContext.lineJoin = "round";
  
  this.backbufferContext.strokeStyle = "rgb(" + color.r + "," + color.g + "," + color.g + ")";
  
  this.backbufferContext.beginPath();
  this.backbufferContext.moveTo(x1, y1);
  this.backbufferContext.lineTo(x2, y2);
  this.backbufferContext.closePath();
  this.backbufferContext.stroke();
  
  this.backbufferContext.restore();
}

engine.drawBresenhamLine = function (x1, y1, x2, y2, color) { // review this to understand better
  // Bresenham line algorithm using floats (if slow, look at integer verision from same reference)
  // reference: http://www.sunshine2k.de/coding/java/Bresenham/RasterisingLinesCircles.pdf
  var x  = x1,
      y  = y1,
      dx = x2 - x1,
      dy = y2 - y1,
      e  = (dy / dx) - 0.5;

  for (var i = 1; i <= dx; i++) {
    this.drawPixel(x, y, color);
    while (e >= 0) {
      y++;
      e--;
    }
    x++;
    e += dy / dx;
  }
}

engine.drawTriangle = function (x1, y1, x2, y2, x3, y3, color) {
  this.drawBresenhamLine(x1, y1, x2, y2, color);
  this.drawBresenhamLine(x2, y2, x3, y3, color);
  this.drawBresenhamLine(x1, y1, x3, y3, color);
  this.drawBresenhamLine(20, 100, 100, 50, BRIGHT_BLUE); // algorithm incorrect
  // this.drawPixel(x1,y1,color);
  // this.drawPixel(x2,y2,color);
  // this.drawPixel(x3,y3,color);
};

engine.fillTriangle = function (x1, y1, x2, y2, x3, y3, color) {};
engine.drawRectangle = function (x1, y1, x2, y2, x3, y3, x4, y4, color) {};
engine.fillRectangle = function (x1, y1, x2, y2, x3, y3, x4, y4s, color) {};