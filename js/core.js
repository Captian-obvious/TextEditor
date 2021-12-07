const ace = window.ace;
var te = window.te;
window.addEventListener('load', function() {
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/chrome");
    te.theme = "ace/theme/chrome";
    editor.session.setMode("ace/mode/javascript");
    te.mode = "ace/mode/javascript";
    te.mainMenu.status = "inactive";
});
