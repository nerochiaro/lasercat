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
          
      var sys = je.moduleSystem(10, 3, 0.17);
      
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
      
      gridOf1x1(3, 3, true, true).translate(0.01, 0.01).cut();
      
      
      function num4of2x1withHole() {       
        var space = 2 * sys.kerf
        var g = je.s.g();
        for (var i = 0; i < 4; i++) {
          g.add(
            je.s.polyline(sys.multiBox(2, 1)).rotate(90, 0, 0)
                          .translate(0, - sys.unit - (i * (sys.unit + space)))
          );
          g.add(
            je.s.rect(sys.step, sys.step, sys.step * 2, (sys.unit * 2) - sys.thickness - sys.step * 2)
            .translate(i * (sys.unit + space), 0)
          )
        }
        g.translate(sys.kerf, sys.kerf).cut();
      }
      
      //num4of2x1withHole();
    });
  }
);

//TODO:
/*  
- output the exploded box/structure preview in openjscad
- print raster marks around the bounding box of all the pieces to easily check alignement 
  when using scrap
*/