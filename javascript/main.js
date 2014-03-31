// engine namespace
var engine = engine || {};

const TARGET_FRAMES_PER_SEC = 1.0 / 60.0;
const BRIGHT_BLUE           = {r: 0, g: 162, b: 232};

////// entry point //////
window.onload = function() {
  var modelName = document.getElementById("select").value;

  document.getElementById("select").addEventListener('change', function() {
    modelName = document.getElementById("select").value;
    engine.reset(modelName);
  }, 
  false);

  // start your engines
  engine.init(modelName);
}