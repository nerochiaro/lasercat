define(function() {
  function BoxJoint(s, tabWidth, thickness, kerf) {
    if (typeof(tabWidth) == "object") {
      var p = tabWidth;
      this.width = p.tabWidth;
      this.height = p.thickness;
      this.kerf = p.kerf;
    } else {
      this.width = tabWidth;
      this.height = thickness;
      this.kerf = kerf;
    }
    
    // TODO: if the distance is less than 2*tab+gap
    this.horizontalSegment = function(fromX, toX, applyKerf) {
      var curX = fromX;
      var curY = 0;
      var dx = 0;
      var dy = 0;
      var step = 0;
      var backwards = toX < fromX
      var path = [[curX, 0]];
                                    
      while ((!backwards && curX < toX) ||
              (backwards && curX > toX)) {
        // Steps follow this pattern then repeat periodically
        // It always starts with a quarter period so that the
        // forwards and backwards sections always form an half
        // period when joined.
        //
        // 0--1        4--
        //    |        |
        //    ----------
        //    2        3             

        switch (step) {
        case 0: 
          dx = this.width / 4;
          if (applyKerf) dx -= this.kerf; 
          if (backwards) dx *= -1;
          dy = 0; 
          break;
        case 1: dx = 0; dy = this.height; break;
        case 2: 
          dx = this.width; 
          if (applyKerf) dx += this.kerf * 2;
          if (backwards) dx *= -1;
          dy = 0; 
          break;
        case 3: dx = 0; dy = - this.height; break; 
        case 4:
          dx = this.width / 4;
          if (applyKerf) dx -= this.kerf; 
          if (backwards) dx *= -1;
          dy = 0; 
          break;
        }
        
        if ((!backwards && curX + dx > toX) ||
            (backwards && curX + dx < toX)) {
          curX = toX;
        } else curX += dx;
        curY += dy;
      

        path.push([curX, curY]);
        
        if (++step > 4) step = 0;
      }

      return path;
    }

    // Draw an horizontal joint segment of a certain length
    this.horizontalEdge = function(length, applyKerf) {
      var path;

      // Draw the backwards segment first, then reverse it so that
      // it joins with the forwards segment that we will draw next
      path = this.horizontalSegment(length / 2, 0, applyKerf).reverse();
      path = path.concat(this.horizontalSegment(length / 2, length, applyKerf));

      return path;
    }

    // Return the two joint edges
    this.horizontal = function(length) {
      return [
        this.horizontalEdge(length, false),
        this.horizontalEdge(length, true)
      ];
    }
  }
  
  return {
    boxJoint: BoxJoint    
  }
});