define(["./primitives", "./joints", "./modular"], 
       function(primitives, joints, modular) {
  Array.prototype.formatPath = function() {
    return this.map(function(point) {
      return point[0] + "," + point[1];
    }).join(" ");
  }
  Array.prototype.offsetPath = function(dx, dy) {
    return this.map(function(point) {
      return [point[0] + dx, point[1] + dy];
    });
  }

  Array.prototype.last = function() { return this[this.length - 1]; }

  var mmInInch = 25.4;
  var inkscapeDPI = 90;
  //mm = px * mmInInch / inkscapeDPI;

  var bedWidth = 600;
  var bedHeight = 300;
  var s = null;
  var grid, xruler, yruler;
  var cutWidth = 0.025;

  // TODO: Refactor ruler and grid
  function ruler(s, upTo, vertical) {
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

  function grid(s, color, weight) {
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

  return {
    prepare: function(id, useRulers, useGrid) {
      $("#output").width(bedWidth + "mm").height(bedHeight + "mm");
                
      this.s = Snap(id);
      
      // Get the SVG DOM object so we can manipulate it directly.
      // JQuery will choke on it because there are some differences.
      // For example jQuery turns all property names to lowercase, but
      // SVG is case sensitive.
      var svg = $(id)[0]

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
          return this.fill().stroke(cutWidth);
        };
        Element.prototype.stroke = function (width, color) {
          return this.attr({ strokeWidth: width, stroke: (color) ? color : "black" });
        };
        Element.prototype.fill = function (color) {
          return this.attr({ fill: (color) ? color : "none" });
        };
        Element.prototype.translate = function (x, y) {
          var m = new Snap.Matrix().translate(x, y);
          if (this.matrix) this.transform(this.matrix.add(m));
          else this.transform(m);
          return this;
        }
        Element.prototype.rotate = function (a, x, y) {
          if (arguments.length == 1) {
            var box = this.getBBox();
            x = box.width / 2;
            y = box.height / 2;
          }
          var m = new Snap.Matrix().rotate(a, x, y);
          if (this.matrix) this.transform(this.matrix.add(m));
          else this.transform(m);
          return this;
        }
      });
      
      this.ui = this.s.g();
      if (useGrid) grid = this.ui.add(grid(this.s, "lightgrey", 0.1));
      if (useRulers) {
        xruler = this.ui.add(ruler(this.s, bedWidth, false));
        yruler = this.ui.add(ruler(this.s, bedHeight, true));
      }
      
      return this;
    },
    
    box: function(width, height) { return new primitives.box(this.s, width, height) },
    polyline: function(points) { return new primitives.polyline(this.s, points) },
    boxJoint: function(tabWidth, thickness, kerf) { return new joints.boxJoint(this.s, tabWidth, thickness, kerf) },
    moduleSystem: function(step, thickness, kerf) { return new modular.moduleSystem(step, thickness, kerf) }
  }
  
});
