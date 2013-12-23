requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'scripts'
});
requirejs(["libs/jquery-1.10.2.min", "libs/snap.svg-min"], function(s) {
  $(document).ready(function() {
    var s = prepare("#output", true, false);
    
    je = new BoxJoint({ tabWidth: 10, thickness: 3, kerf: 0.17 });
    b = new Box(36, 40);
    
    b.splitWith(je, 20, 2).translate(10, 10).cut(); 
    
    function crossJoint() {
      return s.g(
        s.g(
          s.rect(5 - 3 / 2, 0, 3, 5).cut(),
          s.rect(0, 0, 10, 10).cut()
        ),
        s.g(
          s.rect(5 - 3 / 2, 0, 3, 5).cut(),
          s.rect(0, 0, 10, 10).cut()
        ).translate(11, 0)
      ).translate(2, 2);
    }
  });
});