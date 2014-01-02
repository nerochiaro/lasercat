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

  return {
      polyline: Polyline
  }
});