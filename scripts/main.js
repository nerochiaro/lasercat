requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'scripts'
});

requirejs(
  ["libs/jquery-1.10.2.min", "libs/snap.svg-min", "jointhelper"],
  function(jquery, snap, jointhelper) {
    $(document).ready(function() {
      var REFLECTOR_URL = "http://localhost:7777/";
      
      var je = jointhelper.prepare("#output", true, false);

      $("#save").on("click", function() {
        je.ui.remove();
        $("#content").val($("#output").prop("outerHTML"));
        $("#reflectform").prop("action", REFLECTOR_URL + $("#filename").prop("value"))
                        .submit();                       
        // TODO: re-enable UI
      });
     
      bj = new BoxJoint({ tabWidth: 10, thickness: 3, kerf: 0.17 });
      b = je.box(36, 40);
      
      b.splitWith(bj, 20, 2).translate(10, 10).cut(); 
      
//       function crossJoint() {
//         return s.g(
//           s.g(
//             s.rect(5 - 3 / 2, 0, 3, 5).cut(),
//             s.rect(0, 0, 10, 10).cut()
//           ),
//           s.g(
//             s.rect(5 - 3 / 2, 0, 3, 5).cut(),
//             s.rect(0, 0, 10, 10).cut()
//           ).translate(11, 0)
//         ).translate(2, 2);
//       }
      
    });
  }
);