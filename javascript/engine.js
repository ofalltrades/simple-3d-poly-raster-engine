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
  var totalLines = 5;
  for (var i = -totalLines; i <= totalLines; i++) {
    var offsetX = Math.cos(this.elapsedTime * i * (0.250/totalLines)) * 100;
    var offsetY = Math.sin(this.elapsedTime * i * (0.250/totalLines)) * 100;
    // this.drawLine(this.screenCenterX - offsetX, this.screenCenterY - offsetY, this.screenCenterX + offsetX, this.screenCenterY + offsetY, BRIGHT_BLUE);
    this.drawCanvasLine(this.screenCenterX - offsetX, this.screenCenterY - offsetY, this.screenCenterX + offsetX, this.screenCenterY + offsetY, BRIGHT_BLUE);
    // this.drawLine(20, 20, 81, 200, BRIGHT_BLUE);
  }
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

engine.drawLine = function (x1, y1, x2, y2, color) {
  // simple slope formula line drawing algorithm
  dx = x2 - x1;
  dy = y2 - y1;

  for (var x = x1; x <= x2; x++) {
    y = y1 + ((dy * (x - x1)) / dx);
    this.drawPixel(x, y, color);
  }
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

engine.drawBresenhamLine = function (x1, y1, x2, y2, color) {
  // Bresenham line algorithm
  var dX  = Math.abs(x2 - x1),
      dY  = Math.abs(y2 - y1),
      err = ((dX > dY) ? dX : -dY) / 2,
      sX  = (x1 < x2) ? 1 : -1,
      sY  = (y1 < y2) ? 1 : -1;

  for (var x = 0; x < dX; x++) {
    this.drawPixel(x1, y1, color);
    
    if (x1 === x2 && y1 === y2) break;
    
    e2 = err;
    if (e2 > -dX) { err -= dY; x1 += sX; }
    if (e2 <  dY) { err += dX; y1 += sY; }
  }

  unoptimized line drawing algorithm 
  check if x2 - x1 < 61
}

engine.drawTriangle = function (x1, y1, x2, y2, x3, y3, color) {};
engine.fillTriangle = function (x1, y1, x2, y2, x3, y3, color) {};
engine.drawRectangle = function (x1, y1, x2, y2, x3, y3, x4, y4, color) {};
engine.fillRectangle = function (x1, y1, x2, y2, x3, y3, x4, y4s, color) {};