const ace = window.ace;
/*jslint
    indent: 4,
    maxerr: 50,
    white: true,
    browser: true,
    vars: true
*/
function addFunctionsForSettingsMenu (editor) {
    // when building the settings menu matching get and set functions
    // must be found or the function will be ignored

    editor.getFontSize = function () {
        return window.getComputedStyle(editor.container).getPropertyValue('font-size');
    };

    // this allows the settings menu to supply a wrap limit
    // using a text input field easily
    editor.session.setWrapLimit = function (limit) {
        editor.session.setWrapLimitRange(limit, limit);
    };
}
/**
 * Generates a list of set functions for the settings menu
 * @param {object} editor The editor instance
 * @return {array} Returns an array of objects. Each object contains the 
 *  following properties: functionName, parentObj, and parentName.
 */
function getSetFunctions (editor) {
    var out = [];
    var my = {
        'editor' : editor,
        'session' : editor.session,
        'renderer' : editor.renderer
    };
    var opts = [];

    var skip = [
        'setOption',
        'setUndoManager',
        'setDocument',
        'setValue',
        'setBreakpoints',
        'setScrollTop',
        'setScrollLeft',
        'setSelectionStyle',
        'setWrapLimitRange',
        'setKeyboardHandler'
    ];

    [
        'renderer',
        'session',
        'editor'
    ].forEach(function (esra) {
        var fn;
        var esr = my[esra];
        var clss = esra;
        for(fn in esr) {
            if(skip.indexOf(fn) === -1) {
                if(/^set/.test(fn) && opts.indexOf(fn) === -1) {
                    // found set function
                    opts.push(fn);
                    out.push({
                        'functionName' : fn,
                        'parentObj' : esr,
                        'parentName' : clss
                    });
                }
            }
        }
    });
    return out;
}
/**
 * The menu options property needs to be added to the editor
 *  so that the settings menu can know about options for 
 *  selection elements and track which option is selected.
 */
function addEditorMenuOptions (editor) {
    editor.menuOptions = {
        "setNewLineMode" : [{
                "textContent" : "unix",
                "value" : "unix"
            }, {
                "textContent" : "windows",
                "value" : "windows"
            }, {
                "textContent" : "auto",
                "value" : "auto"
            }
        ],
        "setTheme" : [{
                "innerHTML" : "ambiance",
                "value" : "ace/theme/ambiance"
            }, {
                "innerHTML" : "chaos",
                "value" : "ace/theme/chaos"
            }, {
                "innerHTML" : "chrome",
                "value" : "ace/theme/chrome"
            }, {
                "innerHTML" : "clouds",
                "value" : "ace/theme/clouds"
            }, {
                "innerHTML" : "clouds_midnight",
                "value" : "ace/theme/clouds_midnight"
            }, {
                "innerHTML" : "cobalt",
                "value" : "ace/theme/cobalt"
            }, {
                "innerHTML" : "crimson_editor",
                "value" : "ace/theme/crimson_editor"
            }, {
                "innerHTML" : "dawn",
                "value" : "ace/theme/dawn"
            }, {
                "innerHTML" : "dreamweaver",
                "value" : "ace/theme/dreamweaver"
            }, {
                "innerHTML" : "eclipse",
                "value" : "ace/theme/eclipse"
            }, {
                "innerHTML" : "github",
                "value" : "ace/theme/github"
            }, {
                "innerHTML" : "idle_fingers",
                "value" : "ace/theme/idle_fingers"
            }, {
                "innerHTML" : "kr",
                "value" : "ace/theme/kr"
            }, {
                "innerHTML" : "merbivore",
                "value" : "ace/theme/merbivore"
            }, {
                "innerHTML" : "merbivore_soft",
                "value" : "ace/theme/merbivore_soft"
            }, {
                "innerHTML" : "monokai",
                "value" : "ace/theme/monokai"
            }, {
                "innerHTML" : "mono_industrial",
                "value" : "ace/theme/mono_industrial"
            }, {
                "innerHTML" : "pastel_on_dark",
                "value" : "ace/theme/pastel_on_dark"
            }, {
                "innerHTML" : "solarized_dark",
                "value" : "ace/theme/solarized_dark"
            }, {
                "innerHTML" : "solarized_light",
                "value" : "ace/theme/solarized_light"
            }, {
                "innerHTML" : "textmate",
                "value" : "ace/theme/textmate"
            }, {
                "innerHTML" : "tomorrow",
                "value" : "ace/theme/tomorrow"
            }, {
                "innerHTML" : "tomorrow_night",
                "value" : "ace/theme/tomorrow_night"
            }, {
                "innerHTML" : "tomorrow_night_blue",
                "value" : "ace/theme/tomorrow_night_blue"
            }, {
                "innerHTML" : "tomorrow_night_bright",
                "value" : "ace/theme/tomorrow_night_bright"
            }, {
                "innerHTML" : "tomorrow_night_eighties",
                "value" : "ace/theme/tomorrow_night_eighties"
            }, {
                "innerHTML" : "twilight",
                "value" : "ace/theme/twilight"
            }, {
                "innerHTML" : "vibrant_ink",
                "value" : "ace/theme/vibrant_ink"
            }, {
                "innerHTML" : "xcode",
                "value" : "ace/theme/xcode"
            }
        ],
        "setMode" : [{
                "innerHTML" : "abap",
                "value" : "ace/mode/abap"
            }, {
                "innerHTML" : "asciidoc",
                "value" : "ace/mode/asciidoc"
            }, {
                "innerHTML" : "c9search",
                "value" : "ace/mode/c9search"
            }, {
                "innerHTML" : "clojure",
                "value" : "ace/mode/clojure"
            }, {
                "innerHTML" : "coffee",
                "value" : "ace/mode/coffee"
            }, {
                "innerHTML" : "coldfusion",
                "value" : "ace/mode/coldfusion"
            }, {
                "innerHTML" : "csharp",
                "value" : "ace/mode/csharp"
            }, {
                "innerHTML" : "css",
                "value" : "ace/mode/css"
            }, {
                "innerHTML" : "curly",
                "value" : "ace/mode/curly"
            }, {
                "innerHTML" : "c_cpp",
                "value" : "ace/mode/c_cpp"
            }, {
                "innerHTML" : "dart"
                "value" : "ace/mode/dart"
            }, {
                "innerHTML" : "diff",
                "value" : "ace/mode/diff"
            }, {
                "innerHTML" : "django",
                "value" : "ace/mode/django"
            }, {
                "innerHTML" : "dot",
                "value" : "ace/mode/dot"
            }, {
                "innerHTML" : "ftl",
                "value" : "ace/mode/ftl"
            }, {
                "innerHTML" : "glsl",
                "value" : "ace/mode/glsl"
            }, {
                "innerHTML" : "golang",
                "value" : "ace/mode/golang"
            }, {
                "innerHTML" : "groovy",
                "value" : "ace/mode/groovy"
            }, {
                "innerHTML" : "haml",
                "value" : "ace/mode/haml"
            }, {
                "innerHTML" : "haxe",
                "value" : "ace/mode/haxe"
            }, {
                "innerHTML" : "html",
                "value" : "ace/mode/html"
            }, {
                "innerHTML" : "jade",
                "value" : "ace/mode/jade"
            }, {
                "innerHTML" : "java",
                "value" : "ace/mode/java"
            }, {
                "innerHTML" : "javascript",
                "value" : "ace/mode/javascript"
            }, {
                "innerHTML" : "json",
                "value" : "ace/mode/json"
            }, {
                "innerHTML" : "jsp",
                "value" : "ace/mode/jsp"
            }, {
                "innerHTML" : "jsx",
                "value" : "ace/mode/jsx"
            }, {
                "innerHTML" : "latex",
                "value" : "ace/mode/latex"
            }, {
                "innerHTML" : "less",
                "value" : "ace/mode/less"
            }, {
                "innerHTML" : "liquid",
                "value" : "ace/mode/liquid"
            }, {
                "innerHTML" : "lisp",
                "value" : "ace/mode/lisp"
            }, {
                "innerHTML" : "livescript",
                "value" : "ace/mode/livescript"
            }, {
                "innerHTML" : "logiql",
                "value" : "ace/mode/logiql"
            }, {
                "innerHTML" : "lsl",
                "value" : "ace/mode/lsl"
            }, {
                "innerHTML" : "lua",
                "value" : "ace/mode/lua"
            }, {
                "innerHTML" : "luapage",
                "value" : "ace/mode/luapage"
            }, {
                "innerHTML" : "lucene",
                "value" : "ace/mode/lucene"
            }, {
                "innerHTML" : "makefile",
                "value" : "ace/mode/makefile"
            }, {
                "innerHTML" : "markdown",
                "value" : "ace/mode/markdown"
            }, {
                "innerHTML" : "objectivec",
                "value" : "ace/mode/objectivec"
            }, {
                "innerHTML" : "ocaml",
                "value" : "ace/mode/ocaml"
            }, {
                "innerHTML" : "pascal",
                "value" : "ace/mode/pascal"
            }, {
                "innerHTML" : "perl",
                "value" : "ace/mode/perl"
            }, {
                "innerHTML" : "pgsql",
                "value" : "ace/mode/pgsql"
            }, {
                "innerHTML" : "php",
                "value" : "ace/mode/php"
            }, {
                "innerHTML" : "powershell",
                "value" : "ace/mode/powershell"
            }, {
                "innerHTML" : "python",
                "value" : "ace/mode/python"
            }, {
                "innerHTML" : "r",
                "value" : "ace/mode/r"
            }, {
                "innerHTML" : "rdoc",
                "value" : "ace/mode/rdoc"
            }, {
                "innerHTML" : "rhtml",
                "value" : "ace/mode/rhtml"
            }, {
                "innerHTML" : "ruby",
                "value" : "ace/mode/ruby"
            }, {
                "innerHTML" : "sass",
                "value" : "ace/mode/sass"
            }, {
                "innerHTML" : "scad",
                "value" : "ace/mode/scad"
            }, {
                "innerHTML" : "scala",
                "value" : "ace/mode/scala"
            }, {
                "innerHTML" : "scheme",
                "value" : "ace/mode/scheme"
            }, {
                "innerHTML" : "scss",
                "value" : "ace/mode/scss"
            }, {
                "innerHTML" : "sh",
                "value" : "ace/mode/sh"
            }, {
                "innerHTML" : "sql",
                "value" : "ace/mode/sql"
            }, {
                "innerHTML" : "stylus",
                "value" : "ace/mode/stylus"
            }, {
                "innerHTML" : "svg",
                "value" : "ace/mode/svg"
            }, {
                "innerHTML" : "tcl",
                "value" : "ace/mode/tcl"
            }, {
                "innerHTML" : "tex",
                "value" : "ace/mode/tex"
            }, {
                "innerHTML" : "text",
                "value" : "ace/mode/text"
            }, {
                "innerHTML" : "textile",
                "value" : "ace/mode/textile"
            }, {
                "innerHTML" : "tmsnippet",
                "value" : "ace/mode/tmsnippet"
            }, {
                "innerHTML" : "tm_snippet",
                "value" : "ace/mode/tm_snippet"
            }, {
                "innerHTML" : "toml",
                "value" : "ace/mode/toml"
            }, {
                "innerHTML" : "typescript",
                "value" : "ace/mode/typescript"
            }, {
                "innerHTML" : "vbscript",
                "value" : "ace/mode/vbscript"
            }, {
                "innerHTML" : "xml",
                "value" : "ace/mode/xml"
            }, {
                "innerHTML" : "xquery",
                "value" : "ace/mode/xquery"
            }, {
                "innerHTML" : "yaml",
                "value" : "ace/mode/yaml"
            }
        ]
    };
}
/**
 * This massive thing is comprised mostly of element generation functions
 *  filtering out the 
 */
function generateMenu (editor) {
    var elements = [];

    function createCheckbox (id, checked, clss) {
        var el = document.createElement('input');
        el.setAttribute('type', 'checkbox');
        el.setAttribute('id', id);
        el.setAttribute('name', id);
        el.setAttribute('value', checked);
        el.setAttribute('class', clss);
        if(checked) {
            el.setAttribute('checked', 'checked');
        }
        return el;
    }
    function createInput (id, value, clss) {
        var el = document.createElement('input');
        el.setAttribute('type', 'text');
        el.setAttribute('id', id);
        el.setAttribute('name', id);
        el.setAttribute('value', value);
        el.setAttribute('class', clss);
        return el;
    }
    function createOption (obj) {
        var attribute;
        var el = document.createElement('option');
        for(attribute in obj) {
            if(el.hasOwnProperty(attribute)) {
                if(attribute === 'selected') {
                    el.setAttribute(attribute, obj[attribute]);
                }
                el[attribute] = obj[attribute];
            }
        }
        return el;
    }
    function createSelection (id, values, clss) {
        var el = document.createElement('select');
        el.setAttribute('id', id);
        el.setAttribute('name', id);
        el.setAttribute('class', clss);
        values.forEach(function (item) {
            el.appendChild(createOption(item));
        });
        return el;
    }
    function createLabel (text, labelFor) {
        var el = document.createElement('label');
        el.setAttribute('for', labelFor);
        el.textContent = text;
        return el;
    }
    // require editor
    function createNewEntry(obj, clss, item, val) {
        var el;
        var div = document.createElement('div');
        div.setAttribute('contains', item);
        div.setAttribute('class', 'menuEntry');

        div.appendChild(createLabel(item, item));

        if(Array.isArray(val)) {
            el = createSelection(item, val, clss);
            el.addEventListener('change', function (e) {
                try{
                    editor.menuOptions[e.target.id].forEach(function (x) {
                        if(x.textContent !== e.target.textContent) {
                            delete x.selected;
                        }
                    });
                    obj[e.target.id](e.target.value);
                } catch (err) {
                    throw new Error(err);
                }
            });
        } else if(typeof val === 'boolean') {
            el = createCheckbox(item, val, clss);
            el.addEventListener('change', function (e) {
                try{
                    obj[e.target.id](!!e.target.checked);
                } catch (err) {
                    throw new Error(err);
                }
            });
        } else {
            el = createInput(item, val, clss);
            el.addEventListener('blur', function (e) {
                try {
                    if(e.target.value === 'true') {
                        obj[e.target.id](true);
                    } else if(e.target.value === 'false') {
                        obj[e.target.id](false);
                    } else {
                        obj[e.target.id](e.target.value);
                    }
                } catch (err) {
                    throw new Error(err);
                }
            });
        }
        div.appendChild(el);
        return div;
    }
    function makeDropdown(item, esr, clss, fn) {
        var val = editor.menuOptions[item];
        val = val.map(function (valuex) {
            if(valuex.value === esr[fn]()) {
                valuex.selected = 'selected';
            } else if(valuex.value === esr.$modeId) {
                // is mode
                valuex.selected = 'selected';
            }
            return valuex;
        });
        return createNewEntry(esr, clss, item, val);
    }

    // require editor, elements
    function handleSet (setObj) {
        var item = setObj.functionName;
        var esr = setObj.parentObj;
        var clss = setObj.parentName;
        var val;
        var fn = item.replace(/^set/, 'get');
        if(editor.menuOptions[item] !== undefined) {
            // has options for select element
            elements.push(makeDropdown(item, esr, clss, fn));
        } else if(typeof esr[fn] === 'function') {
            // has get function
            try {
                val = esr[fn]();
                if(typeof val === 'object') {
                    // setMode takes a string, getMode returns an object
                    // the $id property of that object is the string
                    // which may be given to setMode...
                    val = val.$id;
                }
                // the rest of the get functions return strings,
                // booleans, or numbers.
                elements.push(
                    createNewEntry(esr, clss, item, val)
                );
            } catch (e) {
                // if there are errors it is because the element
                // does not belong in the settings menu
            }
        }
    }
    function cleanupElementsList() {
        elements.sort(function (a, b) {
            var x = a.getAttribute('contains');
            var y = b.getAttribute('contains');
            return x.localeCompare(y);
        });
    }
    function showMenu() {
        var topmenu = document.createElement('div');
        elements.forEach(function (element) {
            topmenu.appendChild(element);
        });
        return topmenu;
    }
    getSetFunctions(editor).forEach(function (setObj) {
        handleSet(setObj);
    });
    cleanupElementsList();
    overlayPage(showMenu(), '0', '0', '0', null);
}
/**
 * and here is the ugly overlay code again...
 */
function overlayPage (contentElement, top, right, bottom, left) {
    "use strict";
    var div = document.createElement('div');
    var contentContainer = document.createElement('div');
    contentContainer.style.cssText = 'margin: 0px; padding: 0px; border: 0px;' + 'overflow: auto;';
    contentElement.style.cssText = contentElement.style.cssText + 'overflow: auto;';
    contentContainer.appendChild(contentElement);

    var cl = document.createElement('img');
    if(top) {
        top = 'top: ' + top + ';';
    } else {
        top = '';
    }
    if(right) {
        right = 'right: ' + right + ';';
    } else {
        right = '';
    }
    if(bottom) {
        bottom = 'bottom: ' + bottom + ';';
    } else {
        bottom = '';
    }
    if(left) {
        left = 'left: ' + left + ';';
    } else {
        left = '';
    }

    cl.src = '/famfamfam_silk_icons_v013/icons/cross.svg';
    cl.style.cssText = 'margin: 5px 5px 0 0; padding: 0; ' +
        'float: right; width: 25px;';
    div.style.cssText = 'margin:0; padding:0; position: absolute;' +
         top + right + bottom + left +
        'z-index:9999; background-color:white; color:black; overflow: auto;';

    div.appendChild(cl);
    div.id = "Menu2"
    div.appendChild(contentContainer);
    document.getElementById("menu").appendChild(div);

    cl.addEventListener('click', function (e) {
        div.parentNode.removeChild(div);
        div = null;
    });
}
/**
 * This builds the settings menu and selects
 *  all the options currently in effect.
 */
function aceShowSettingsMenu (editor) {
    addFunctionsForSettingsMenu(editor);
    addEditorMenuOptions(editor);
    generateMenu(editor);
}
window.addEventListener('load', function() {
    var container = document.getElementById('app');
    container.innerHTML = `
    <div id="menu"><div id="settings"></div></div>
    <div id="editor">function foo(items) {
    var x = "All this is syntax highlighted";
    return x;
    };</div>
    `
    var settings = document.getElementById("settings");
    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/chrome");
    editor.session.setMode("ace/mode/javascript");
    settings.onclick = aceShowSettingsMenu(editor)
});
