var ace = window.ace
var editor = ace.edit("editor");
editor.setTheme("ace/theme/chrome");
editor.session.setMode("ace/mode/javascript");
var app = document.getElementById('app')
window.addEventListener('load',function(){
    app.innerHTML = `
    <div id="menu"></div>
    <div id="editor">function foo(items) {
    var x = "All this is syntax highlighted";
    return x;
    }</div>
    `
});
