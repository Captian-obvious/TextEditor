const ace = window.ace;
window.addEventListener('load', function() {
    var container = document.getElementById('app');
    container.innerHTML = `
    <div id="menu"><div id="settings"></div></div>
    <div id="editor">function foo(items) {
    var x = "All this is syntax highlighted";
    return x;
    };</div>
    `
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/chrome");
    editor.session.setMode("ace/mode/javascript");
});
