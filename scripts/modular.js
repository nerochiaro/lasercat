define(function() {      
  function ModuleSystem(step, thickness, kerf) {
    this.step = step;
    this.unit = this.step * 4;
    this.thickness = thickness;
    this.kerf = kerf;        
    
    /* Creates a box which represents the smallest unit in the system.
     * Six of these units can join together to create a stable cube.
     * If rotated is true the unit will be generated rotated 90 degrees
     * around its center. 
     * Sides, if passed, is an object with 4 properties (left, right, top
     * and bottom). Those that are assigned true will cause the corresponding
     * side to be drawn. By default if anything other than this object is passed
     * all sides will be generated.     
     */
    this.unitBox = function(sides, rotated) {
        sides = sides || { left: true, right: true, top: true, bottom: true};
        var points = [];
        if (rotated !== true) {
          if (sides.top) {
              points = points.concat([
                [0, this.thickness],
                [this.step - this.kerf, this.thickness],
                [this.step - this.kerf, 0],
                [this.step * 1.5 + this.kerf, 0],
                [this.step * 1.5 + this.kerf, this.thickness],
                [this.step * 2.5 - this.kerf, this.thickness],
                [this.step * 2.5 - this.kerf, 0],
                [this.step * 3 + this.kerf, 0],
                [this.step * 3 + this.kerf, this.thickness],
                [this.unit, this.thickness]
              ]);
          }
          if (sides.right) {
              if (sides.top !== true) 
                points.push([this.unit, this.thickness])
              points = points.concat([
                [this.unit, this.step],
                [this.unit - this.thickness, this.step],
                [this.unit - this.thickness, this.step * 1.5],
                [this.unit, this.step * 1.5],
                [this.unit, this.step * 2.5],
                [this.unit - this.thickness, this.step * 2.5],
                [this.unit - this.thickness, this.step * 3],
                [this.unit, this.step * 3],
                [this.unit, this.unit - this.thickness],
                [this.unit - this.thickness, this.unit - this.thickness]
              ]);
          }
          if (sides.bottom) {
              
              if (sides.right !== true) 
                points.push([this.unit - this.thickness, this.unit - this.thickness])
              points = points.concat([
                [this.step * 3 + this.kerf, this.unit - this.thickness],
                [this.step * 3 + this.kerf, this.unit],
                [this.step * 2.5 - this.kerf, this.unit],
                [this.step * 2.5 - this.kerf, this.unit - this.thickness],
                [this.step * 1.5 + this.kerf, this.unit - this.thickness],
                [this.step * 1.5 + this.kerf, this.unit],
                [this.step - this.kerf, this.unit],
                [this.step - this.kerf, this.unit - this.thickness],
                [0, this.unit - this.thickness]
              ]);
          }
          if (sides.left) {
              if (sides.bottom !== true) 
                points.push([0, this.unit - this.thickness])
              points = points.concat([
                [0, this.step * 3],
                [this.thickness, this.step * 3],
                [this.thickness, this.step * 2.5],
                [0, this.step  * 2.5],
                [0, this.step  * 1.5],
                [this.thickness, this.step * 1.5],
                [this.thickness, this.step],
                [0, this.step],
                [0, this.thickness],
                [this.thickness, this.thickness]
              ]);
          }
        } else {
          if (sides.top) {
              points = points.concat([
                [this.thickness, this.thickness],
                [this.thickness, 0],
                [this.step, 0],
                [this.step, this.thickness],
                [this.step * 1.5, this.thickness],
                [this.step * 1.5, 0],
                [this.step * 2.5, 0],
                [this.step * 2.5, this.thickness],              
                [this.step * 3, this.thickness],
                [this.step * 3, 0],
                [this.unit - this.thickness, 0],
                [this.unit - this.thickness, this.thickness]
              ]);
          }
          if (sides.right) {
              if (sides.top !== true)
                points.push([this.unit - this.thickness, this.thickness])
              points = points.concat([
                [this.unit - this.thickness, this.step - this.kerf],
                [this.unit, this.step - this.kerf],
                [this.unit, this.step * 1.5 + this.kerf],
                [this.unit - this.thickness, this.step * 1.5 + this.kerf],
                [this.unit - this.thickness, this.step * 2.5 - this.kerf],
                [this.unit, this.step * 2.5 - this.kerf],
                [this.unit, this.step * 3 + this.kerf],
                [this.unit - this.thickness, this.step * 3 + this.kerf],
                [this.unit - this.thickness, this.unit]
              ]);
          }
          if (sides.bottom) {
              if (sides.right !== true)
                points.push([this.unit - this.thickness, this.unit])
              points = points.concat([
                [this.step * 3, this.unit],
                [this.step * 3, this.unit - this.thickness],
                [this.step * 2.5, this.unit - this.thickness],
                [this.step * 2.5, this.unit],
                [this.step * 1.5, this.unit],
                [this.step * 1.5, this.unit - this.thickness],
                [this.step, this.unit - this.thickness],
                [this.step, this.unit],
                [this.thickness, this.unit],
                [this.thickness, this.unit - this.thickness]
              ]);
          }
          if (sides.left) {
            if (sides.bottom !== true)
              points.push([this.thickness, this.unit - this.thickness])
            points = points.concat([
              [this.thickness, this.step * 3 + this.kerf],
              [0, this.step * 3 + this.kerf],
              [0, this.step * 2.5 - this.kerf],
              [this.thickness, this.step * 2.5 - this.kerf],
              [this.thickness, this.step * 1.5 + this.kerf],
              [0, this.step * 1.5 + this.kerf],
              [0, this.step],
              [this.thickness, this.step],
              [this.thickness, 0]
            ]);
          }
        }
        return points;
    }
    
    /* Returns a box that is a multiple in width or height of these
     * box returned by unitBox. Please also note that due to the overlapping
     * nature of the units, the actual bounding box for the multibox is
     * not an exact multiple of the system's unit. It is however created in
     * a way so that single unitBox will be able to join all sides of the 
     * multiBox successfully, as well as other multiBoxes
     */
    this.multiBox = function(width, height, sides) {
      sides = sides || { left: true, right: true, top: true, bottom: true};
      var unitOffset = this.unit - this.thickness;
      var points = [];
      if (sides.top == true) {
        for (var i = 0; i < width; i++) {
          var side;
          if (i % 2 != 0) {
            side = this.unitBox({top: true}, true);
          } else {
            side = this.unitBox({top: true});
          }
          points = points.concat(side.offsetPath(unitOffset * i, 0));
        }
      }
      if (sides.right == true) {
        for (var i = 0; i < height; i++) {
          var side;
          if ((i + (width % 2)) % 2 == 0) {
            side = this.unitBox({right: true}, true);
          } else {
            side = this.unitBox({right: true});
          }
          points = points.concat(side.offsetPath(unitOffset * (width - 1), unitOffset * i));
        }
      }
      if (sides.bottom == true) {
        for (var i = width - 1; i >= 0; i--) {
          var side;
          if ((i + (height % 2)) % 2 == 0) {
            side = this.unitBox({bottom: true}, true);
          } else {
            side = this.unitBox({bottom: true});
          }
          points = points.concat(side.offsetPath(unitOffset * i, unitOffset * (height - 1)));
        }
      }
      if (sides.left == true) {
        for (var i = height - 1; i >= 0; i--) {
          var side;
          if (i % 2 != 0) {
            side = this.unitBox({left: true}, true);
          } else {
            side = this.unitBox({left: true});
          }
          points = points.concat(side.offsetPath(0, unitOffset * i));
        }
      }
      return points;
    }
  }
  
  return {
    moduleSystem: ModuleSystem
  }
})
