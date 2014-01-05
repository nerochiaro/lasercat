requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'scripts'
});

requirejs(
  ["libs/jquery-1.10.2.min", "libs/snap.svg", "jointhelper"],
  function(jquery, snap, jointhelper) {
    $(document).ready(function() {
      var REFLECTOR_URL = "http://localhost:7777/";
      
      var je = jointhelper.prepare("#output", false, false);

      $("#save").on("click", function() {
        je.ui.remove();
        $("#content").val($("#output").prop("outerHTML"));
        $("#reflectform").prop("action", REFLECTOR_URL + $("#filename").prop("value"))
                        .submit();                       
        // TODO: re-enable UI
      });
          
      var sys = je.moduleSystem(10, 3, 0.14);
      
      function gridOf1x1(width, height, exploded, holes) {
        var g = je.s.g();
        var distance = (exploded) ? sys.unit + (2 * sys.kerf) : sys.unit - sys.thickness;
        for (var k = 0; k < height; k++) {
          for (var i = 0; i < width; i++) {
            var partGroup = je.s.g();
            if (holes) {
              partGroup.add(je.s.rect(sys.step, sys.step, sys.step * 2, sys.step * 2));
            }
            var rotated = (i + (k % 2)) % 2 != 0;
            partGroup.add(je.s.polyline(sys.unitBox(null, rotated)));
            
            partGroup = partGroup.translate(distance * i, distance * k)
            g.add(partGroup);
          }
        }
        return g;
      }
      
      //gridOf1x1(6, 1, true, false).translate(0.01, 0.01).cut();
      
      function gridOf2x1(width, height, options) {       
        var space = (options.exploded) ? sys.step : 2 * sys.kerf;
        var elementWidth = sys.unit * 2 - sys.thickness;
        var elementHeight = sys.unit;
        var g = je.s.g();
        for (var k = 0; k < height; k++) {
          for (var i = 0; i < width; i++) {
            var unitGroup = je.s.g();
            unitGroup.add(
              je.s.polyline(sys.multiBox(2, 1))
            );
            if (options.holes) {
//               unitGroup.add(
//                 je.s.polyline([sys.step + sys.thickness + sys.kerf, sys.step],
//                               [sys.step + sys.thickness + sys.kerf, elementHeight - sys.step])
//               );
//               unitGroup.add(
//                 je.s.polyline([sys.step + elementWidth - 2 * sys.step - sys.thickness - sys.kerf, sys.step],
//                               [sys.step + elementWidth - 2 * sys.step - sys.thickness - sys.kerf, elementHeight - sys.step])
//               );
// 
//               unitGroup.add(
//                 je.s.rect(sys.step + sys.thickness * 2 + sys.kerf * 2, sys.step * 1.5 + sys.kerf,
//                           sys.thickness - sys.kerf, sys.step - sys.kerf)
//               );
//               unitGroup.add(
//                 je.s.rect(sys.step + elementWidth - 2 * sys.step - sys.thickness * 3 - sys.kerf * 2,
//                           sys.step * 1.5 + sys.kerf,
//                           sys.thickness - sys.kerf, sys.step - sys.kerf)
//               );
              
              unitGroup.add(
                je.s.polyline([
                  [sys.step, sys.step],
                  [sys.step + elementWidth - 2 * sys.step, sys.step],
                  [sys.step + elementWidth - 2 * sys.step, sys.step * 1.5],
                  [sys.step + elementWidth - 2 * sys.step - sys.thickness, sys.step * 1.5],
                  [sys.step + elementWidth - 2 * sys.step - sys.thickness, sys.step * 2.5],
                  [sys.step + elementWidth - 2 * sys.step, sys.step * 2.5],
                  [sys.step + elementWidth - 2 * sys.step, sys.step * 3],
                  [sys.step, sys.step * 3],
                  [sys.step, sys.step * 2.5],
                  [sys.step + sys.thickness, sys.step * 2.5],
                  [sys.step + sys.thickness, sys.step * 1.5],
                  [sys.step, sys.step * 1.5],
                  [sys.step, sys.step],
                ])
              );

            }
            
            var xpos, ypos;
            if (options.rotated) {
              unitGroup = unitGroup.rotate(90, 0, 0).translate(elementHeight, 0);
              xpos = elementHeight * i + space * i;
              ypos = elementWidth * k + space * k;
            } else {
              xpos = elementWidth * i + space * i;
              ypos = elementHeight * k + space * k;
            }
            unitGroup = unitGroup.translate(xpos, ypos);
            
            g.add(unitGroup);
          }
        }
        return g;
      }
      
      //gr = gridOf2x1(5, 1, { rotated: true, holes: false }).translate(0.01, 0.01)
      //gr.cut()
      
      var shape = [[0, 1, 0],
                   [1, 1, 1],
                   [0, 1, 0]];
      je.s.polyline(sys.arbitraryBox(shape)).cut();
    });
  }
);

//TODO:
/*  
NEAR TERM
- print raster marks around the bounding box of all the pieces to easily check alignement 
  when using scrap

NEED CUTTER
- slide-in and twist cross braces
- half holes in 2x or larger pieces with notches, and holes in the offcuts
- triangular units
  
WISHLIST
- output the exploded box/structure preview in openjscad

*/