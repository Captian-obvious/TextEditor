const ace = window.ace
window.te = {};
window.te.require = function(src) {
    var head = document.getElementsByTagName ("head")[0];
    var script = document.createElement ("script");
    script.type="text/javascript";
    script.src = src;
    head.appendChild (script);
};
window.addEventListener('load', function() {
    var container = document.getElementById('app');
    container.innerHTML = `
    <div id="menu"></div>
    <div id="editor">function foo(items) {
    var x = "All this is syntax highlighted";
    return x;
    }</div>
    `
    window.te.theme = "ace/theme/chrome";
    window.te.mode = "ace/mode/text";
    window.te.require('../js/core.js');
});
