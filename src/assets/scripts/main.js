(function() {
'use strict';

var hamburgerButtons = document.getElementsByClassName('hamburger-button');

for (var i=0; i<hamburgerButtons.length; i++) {
  hamburgerButtons[i].onclick = function() {
    var activeClass = 'active',
        classString = this.className,
        nameIndex = classString.indexOf(activeClass);
    if (nameIndex === -1) {
        classString += ' ' + activeClass;
    } else {
      classString = classString.substr(0, nameIndex) + classString.substr(nameIndex + activeClass.length, classString.length);
    }
    this.className = classString.trim();
  };
}
})();
