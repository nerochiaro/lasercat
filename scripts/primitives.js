define(function() {
  // Wrapper for an array of "points" (each one an [x, y] array),
  // allowing common operations on the path described by the points,
  // as well as conversion from and to SVG polylines.
  function Polyline(points) {
    this.points = points || [];
    
    // WARN: not tested
    this.fromSVG = function (polyline) {
      this.points = [];
      for (var i in polyline.node.points) {
        var point = polyline.node.points[i];
        this.points.push([point.x, point.y]);
      }
      return this;
    }

    this.draw = function() {
      return s.polyline(this.path);
    }

    // translate a generic path by x and y
    function translatePath(path, x, y) {
      return path.map(function(point) {
        return [point[0] + x, point[1] + y];
      });
    }
  
    this.translate = function (x, y) { 
      this.points = translatePath(this.points, x, y);
      return this;
    }
  }

  // Defines a box of width and height in its own coordinate spaces
  function Box(s, width, height) {
    this.width = width;
    this.height = height;
    this.path = [[0, 0], [0, this.height], 
                [this.width, this.height], [this.width, 0]];
    
    this.draw = function() {
      return s.polygon(this.path);
    }
    
    this.translate = function (x, y) { 
      this.path = translatePath(this.path, x, y);
      return this;
    }

    // Split this box with the specified joint atY
    // The two edges of the joint will be drawn edgeSpacing apart.
    this.splitWith = function(joint, atY, edgeSpacing) {
      var y;
      var edges = joint.horizontal(width);
      
      // Move each edge to its final position above or
      // below the cut, respecting the requested edgeSpacing.
      // Then add points to complete the two halves of the box
      // starting from each edge.

      var topEdge = new Polyline(edges[0]);
      y = atY - edgeSpacing / 2 - joint.height;
      topEdge.translate(0, y);
      topEdge.points = topEdge.points.concat([
        [topEdge.points.last()[0], 0], // top-right
        [0, 0], // top-left
        [0, y]  // edge start (mid-left)
      ]);
      
      var bottomEdge = new Polyline(edges[1]);
      y = atY + edgeSpacing / 2;
      bottomEdge.translate(0, y);
      bottomEdge.points = bottomEdge.points.concat([
        [bottomEdge.points.last()[0], this.height], // bottom-right
        [0, this.height], // bottom-left
        [0, y] // edge start (mid-left)
      ]);
                                  
      return s.g(
        s.polyline(topEdge.points),
        s.polyline(bottomEdge.points)
      );
    }
  }
    
  return {
      box: Box,
      polyline: Polyline
  }
});