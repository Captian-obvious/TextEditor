const ace = window.ace
window.te = {};
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
});
