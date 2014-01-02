requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'scripts'
});

requirejs(
  ["libs/jquery-1.10.2.min", "libs/snap.svg-min", "jointhelper"],
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
            
            partGroup.translate(distance * i, distance * k)
            g.add(partGroup);
          }
        }
        return g;
      }
      
      //gridOf1x1(6, 1, true, true).translate(0.01, 0.01).cut();
      
      function gridOf2x1(width, height, options) {       
        var space = 2 * sys.kerf;
        var elementWidth = sys.unit * 2 - sys.thickness;
        var elementHeight = sys.unit;
        var g = je.s.g();
        for (var k = 0; k < height; k++) {
          for (var i = 0; i < width; i++) {
            var xpos = elementWidth * i + space * i;
            var ypos = elementHeight * k + space * k;
            var unitGroup = je.s.g();
            unitGroup.add(
              je.s.polyline(sys.multiBox(2, 1))
            );
            if (options.holes) {
              unitGroup.add(
                je.s.rect(sys.step, sys.step,
                          elementWidth - 2 * sys.step, elementHeight - 2  * sys.step)
              )
            }
            unitGroup.translate(xpos, ypos);
            g.add(unitGroup);
          }
        }
        if (options.rotated) {
          g.rotate(90);
          g.translate(elementHeight - sys.thickness, 
                      (elementWidth - sys.thickness) / 2);
        }
        return g;
      }
      
     gridOf2x1(1, 1, { rotate: true, holes: true, exploded: true })
     .translate(0.01, 0.01).cut();
    });
  }
);

//TODO:
/*  
- output the exploded box/structure preview in openjscad
- print raster marks around the bounding box of all the pieces to easily check alignement 
  when using scrap
*/