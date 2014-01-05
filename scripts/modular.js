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
     * box returned by unitBox. Note that due to the overlapping
     * nature of the units, the actual bounding box for the multibox is
     * not an exact multiple of the system's unit. It is however created in
     * a way so that unitBoxes and multiBoxes are fully tileable in all
     * directions.
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
  
  
    this.arbitraryBox = function(shape) {
      // allow inner functions to refer to the enclosing "this" scope,
      // which is the ModuleSystem instance.
      var sys = this;
      
      // TODO: check if there's a better JS idiom to define constants and
      // lookup tables using these constants.
      
      var VERTICES = 4;
      var VERT = { NW : 0, NE : 1, SE : 2, SW : 3 }; // clockwise vertices
      var DIR = { N : 0, E : 1, S : 2, W : 3 }; // clockwise directions

      // when moving from a cell to the next, what is the delta
      // x and y for going to the cell at a specific direction ?
      var distances = [
        {x: 0, y: -1}, // N
        {x: +1, y: 0}, // E
        {x: 0, y: +1}, // S
        {x: -1, y: 0}  // W
      ];

      // if we are on a vertex and need to move to another cell,
      // in which direction shall we go ?
      var checkNext = {};
      checkNext[VERT.NW] = DIR.N;
      checkNext[VERT.NE] = DIR.E;
      checkNext[VERT.SE] = DIR.S;
      checkNext[VERT.SW] = DIR.W;
      
      // when we are coming from a certain vertex on a cell and
      // going towards a certain direction, on what vertex of the
      // target cell will we land ?
      // A number of combinations are impossible since from each
      // vertex we can only go to two neighboring cells in a straight
      // line.
      var nextVertex = [
      //       coming from vertex
      //    NW       NE     SE    SW    // going to direction
        [VERT.SW, VERT.SW, null, null], // N
        [null, VERT.NW, VERT.SW, null], // E
        [null, null, VERT.NE, VERT.NE], // S
        [VERT.NW, null, null, VERT.SE]  // W
      ];
      
      // Given an edge, what is the coordinates of the starting
      // vertex on a square of side length 1 ?
      var vertexPositions = [
        {x: 0, y: 0}, // N
        {x: 1, y: 0}, // E
        {x: 1, y: 1}, // S
        {x: 0, y: 1}  // W
      ];

      // Encapsulate a shape, assuming the following:
      // - at least 1x1 big
      // - all rows have the same length
      function Shape(shape) {
        this.shape = shape;
        this.rows = shape.length;
        this.cols = shape[0].length; // assume all rows have same length

        // Encapsulate a cell.
        // Invalid cells can still be created, and cell.isValid will be false
        function Cell(shape, x, y) {
          this.x = x;
          this.y = y;
          this.shape = shape;
          this.isValid = x >= 0 && x < shape.cols && y >= 0 && y < shape.rows;
          this.isEmpty = !this.isValid || shape.shape[y][x] !== 1;
          
          // When going towards `direction` from `vertex` on the current cell,
          // find the cell and vertex on which we will land.
          // Note that it is possible to land on an invalid cell, in
          // which case the target vertex doesn't really make sense and is null.
          this.next = function(direction, vertex) {
            if (arguments.length == 1) vertex = VERT.NW;
            var distance = distances[direction];
            var cell = new Cell(this.shape, this.x + distance.x, this.y + distance.y);
            var vertex = cell.isValid ? nextVertex[direction][vertex] : null;
            return { cell: cell, vertex: vertex };
          }
          
          // Iterate clockwise around the vertexes in this cell, starting from
          // `vertex`. For each determine, by looking at surrounding cells, if
          // an edge needs to be created, or if we should move to another cell.
          // Also at each step of the way check if we are back to the starting
          // point of the whole perimeter iteration.
          this.iterate = function(vertex, start) {
            var result = { edges: [], next: null };
            for (var i = 0; i < VERTICES; i++, vertex++) {
              vertex = vertex % VERTICES; // loop around from SW to NW vertex
            
              // stricty compare the objects, which are equal only in the first
              // iteration due to the pre-loop assignement.
              if (this !== start.cell) {
                if (this.x == start.cell.x && this.y == start.cell.y
                    && vertex == start.vertex) {
                  return result;
                }
              }
              
              var direction = checkNext[vertex];
              var next = this.next(direction, vertex);
              if (next.cell.isEmpty) {
                result.edges.push(new Edge(this.x, this.y, direction));
              } else {
                result.next = next;
                return result;
              }
            }
            // we shouldn't get here, throw exception
            throw Error("Looped all vertices without closing the shape.");
          }
        }
       
        // Return a wrapper for the cell at the specified `x` and `y` coordinates.
        // This should be the only way to access cells.
        this.cell = function(x, y) {
            return new Cell(this, x, y);
        }
        
        // Search in the shape the top-most left-most non-empty cell.
        this.start = function() {
          for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {
              var cell = this.cell(x, y);
              if (!cell.isEmpty) {
                return cell;
              }
            }
          }
          return null;
        }
        
        // Count how many cells in the shape are not empty
        this.countNonEmptyCells = function() {
          var count = 0;
          for (var x = 0; x < this.cols; x++) {
            for (var y = 0; y < this.rows; y++) {
              if (!this.cell(x, y).isEmpty) count++;
            }
          }
          return count;
        }
        
        // Iterates across the perimeter of the shape collecting each
        // edge that is encountered and return the whole list of them
        // in clockwise order.
        this.findEdges = function() {
          var edges = [];
          var start = {
            cell: this.start(),
            vertex: VERT.NW
          };
          
          if (start.cell == null) {
            console.log("Cound not find any starting cell");
            return edges;
          }
                
          // Prevent blocking the browser in case of errors by iterating only
          // a maximum number of iterations, guaranteed to be always more than
          // that necessary to find a solution in the worse case.
          var iteration = 0; 
          var halt_condition = 4 * this.countNonEmptyCells();

          // Traverse the entire perimeter of the shape in the
          // clockwise direction, collecting edges as needed,
          // until coming back to the starting vertex.
          try {
            var next = start;
            do {
              result = next.cell.iterate(next.vertex, start);
              edges = edges.concat(result.edges);
              next = result.next;
              iteration++;
            } while (next != null && iteration < halt_condition);
          } catch (e) {
            console.log("Exception while searching for perimeter", e.stack);
            throw e;
          }
          
          return edges;
        }
      }
      
      // Encapsulate an edge of the shape, surrounding the cell at
      // `x` and `y` and facing the specified `direction`
      function Edge(x, y, direction) {
        this.x = x;
        this.y = y;
        this.direction = direction;
        this.start = vertexPositions[direction];
        this.start = { 
          x: this.x + this.start.x,
          y: this.y + this.start.y
        };
        
        var vertex = (this.direction + 1) % VERTICES;
        this.end = distances[vertex];
        this.end = { 
          x: this.start.x + this.end.x,
          y: this.start.y + this.end.y
        }
      }
           
      shape = new Shape(shape);
      var edges = shape.findEdges();
      var points = [edges[0].start];
     
      edges.forEach(function(edge) {
        points.push(edge.end);
        console.log("E", edge.x, edge.y, edge.direction);
      });
      
      points.forEach(function(point) {
        console.log("P", point.x, point.y);
      });
      
      return points.map(function(point) {
        return [[point.x * sys.unit, point.y * sys.unit]];
      });
    }
    
  }
  
  return {
    moduleSystem: ModuleSystem
  }
})
