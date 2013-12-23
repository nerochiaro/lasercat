var mmInInch = 25.4;
var inkscapeDPI = 90;
//mm = px * mmInInch / inkscapeDPI;

var bedWidth = 600;
var bedHeight = 300;
var s = null;
var grid, xruler, yruler;
var cutWidth = 0.025;
var REFLECTOR_URL = "http://localhost:7777/";

Array.prototype.formatPath = function() {
    return this.map(function(point) {
      return point[0] + "," + point[1];
    }).join(" ");
}
Array.prototype.last = function() { return this[this.length - 1]; }

function prepare(id, rulers, grid) {
  $("#output").width(bedWidth + "mm").height(bedHeight + "mm");
            
  s = Snap("#output");
  
  // Get the SVG DOM object so we can manipulate it directly.
  // JQuery will choke on it because there are some differences.
  // For example jQuery turns all property names to lowercase, but
  // SVG is case sensitive.
  var svg = $("#output")[0]

  // Setup the svg to have a size specified in mm, then adjust the 
  // viewBox to have a 1:1 scale (i.e. go from 0,0 to the same size
  // of the canvas). This will essentially tell the the SVG that any
  // number that doesn't have an unit of measure is in the same unit
  // as the height and width (in this case millimeters).
  svg.setAttribute("width", bedWidth + "mm");
  svg.setAttribute("height", bedHeight + "mm");
  svg.setAttribute("viewBox", "0 0 " + bedWidth + " " + bedHeight);
              
  Snap.plugin(function (Snap, Element, Paper, global) {
    // Simplify stroking things that need to be cut by the laser
    Element.prototype.cut = function () {
      return this.attr({ stroke: "grey", strokeWidth: cutWidth, fill: "none" });
    };
    Element.prototype.translate = function (x, y) {
      return this.transform(new Snap.Matrix().translate(x, y));
    }
    Element.prototype.hide = function () {
      this._oldStroke = this.attr("stroke");
      return this.attr({ stroke: "none" });
    };
    Element.prototype.show = function () {
      this.attr({ stroke: this._oldStroke });
      delete this._oldStroke
      return this;
    };
  });
  
  ui = s.g();
  if (grid) grid = ui.add(grid("lightgrey", 0.05));
  if (rulers) {
    xruler = ui.add(ruler(bedWidth, false));
    yruler = ui.add(ruler(bedHeight, true));
  }
  
  $("#save").on("click", function() {
    ui.remove();
    $("#content").val($("#output").prop("outerHTML"));
    $("#reflectform").prop("action", REFLECTOR_URL + $("#filename").prop("value"))
                     .submit();
                     
    // TODO: re-enable UI
  });

  return s;
}

// TODO: Refactor ruler and grid
function ruler(upTo, vertical) {
  var h = 5;
  var stroke = { stroke: "black", strokeWidth: 1 };
  var mh = 2.5;
  var mstroke = { stroke: "grey", strokeWidth: 1 }; 
  var g = s.g();
  for (var i = 0; i <= upTo; i++) {
    if (i == 0 || i % 10 == 0) {
      if (vertical) {
        g.add(s.line(0, i, h, i).attr(stroke));
        g.add(s.text(h - 2, i + 5, i).attr("font", "1mm Arial"));
      } else {
        g.add(s.line(i, 0, i, h).attr(stroke));
        g.add(s.text(i + 1, h + 1, i).attr("font", "1mm Arial"));
      }
    } else if (i % 10 != 0 && i % 5 == 0) {
      if (vertical) {
        g.add(s.line(0, i, mh, i).attr(mstroke));
      } else {
        g.add(s.line(i, 0, i, mh).attr(mstroke));                
      }
    }
  }
  return g;
}

function grid(color, weight) {
  var stroke = { stroke: color, strokeWidth: weight };
  var g = s.g();
  for (var i = 0; i < bedWidth; i += 5) {
    g.add(s.line(i, 0, i, bedHeight).attr(stroke));
  }
  for (var k = 0; k < bedHeight; k += 5) {
    g.add(s.line(0, k, bedWidth, k).attr(stroke));    
  }
  return g;
}