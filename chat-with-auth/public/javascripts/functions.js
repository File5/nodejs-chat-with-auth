function lorem(counts) {
  var str = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum";
  var retstr = "";
  if (counts != undefined && counts < 1000) {
    var mas = str.split(" ");
    var k = 0;
    for (var i = 0; i < counts; i++, k++) {
      if (k > (mas.length - 2)) {
        k = 0;
      }
      retstr = retstr + " " + mas[k];
    }
  } else {
    retstr = str;
  }
  return retstr;
}