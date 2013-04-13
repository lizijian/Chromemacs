/*
        Copyright (c) 2011 Theis Mackeprang (http://www.5p.dk/)
        Copyright (c) 2011 FLorian Mounier (http://paradoxxxzero.tk/)
        Copyright (c) 2011 Jet Lee

        Permission is hereby granted, free of charge, to any person obtaining a copy
        of this software and associated documentation files (the "Software"), to deal
        in the Software without restriction, including without limitation the rights
        to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
        copies of the Software, and to permit persons to whom the Software is
        furnished to do so, subject to the following conditions:

        The above copyright notice and this permission notice shall be included in
        all copies or substantial portions of the Software.

        THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
        IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
        AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
        LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
        OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
        THE SOFTWARE.
*/

/*
        Cannot override:
        CTRL-W - Close window
        CTRL-T - New tab
        CTRL-N - New window
        Everything else seems to be overrideable!
*/

/* TODO:
        - separate console into protocol and message,
                where message can be used for typing aswell
*/

// Key bindings:
// Must be ordered: SHIFT, then CTRL, then ALT, then CHARACTER
var shortcuts = {
        'CTRL-Q': {'h': 'Toggle Emacs-mode', 'f': function(e) { log("Hmm.. How did you get here?") } },
        'CTRL-G': {'h': 'Cancel', 'f': function(e) { log("Hmm.. How did you get here?") } },
        'CTRL-S': {'h': 'I-search links', 'f': function(e) { searchLinks(e, 0) } },
        'CTRL-ALT-S': {'h': 'Regexp I-search links', 'f': function(e) { searchLinks(e, 1) } },
        'CTRL-R': {'h': 'Reverse I-search links', 'f': function(e) { searchLinks(e, 0) } },
        'CTRL-ALT-R': {'h': 'Reverse regexp I-search links', 'f': function(e) { searchLinks(e, 1) } },
        'CTRL-J': {'h': 'Jump to link or form control', 'f': function(e) { jumpTo(e) } },
        // native functions
        'BACKSPACE': {'h': 'Previous page in history', 'f': function(e) { log("Hmm.. How did you get here?") } },
        //'CTRL-T': {'h': 'New tab', 'f': function(e) { chrome.extension.sendMessage({'action':'NEW_TAB'}) } },
        'ESC': {'h': 'Remove focus from link or form control', 'f': function(e) { log("Hmm.. How did you get here?") } },
        'CTRL-X': {
                'CTRL-C': {'h': 'Close all windows', 'f': function(e) { chrome.extension.sendMessage({'action':'CLOSE_ALL_WINDOWS'}) } },
                'K': { 'h': 'Close current tab', 'f': function(e) { chrome.extension.sendMessage({'action':'CLOSE_TAB'}) } },
                '5': {
                        '0': { 'h': 'Close current window', 'f': function(e) { chrome.extension.sendMessage({'action':'CLOSE_WINDOW'}, function(r){}) } },
                        '2': {'h': 'New window', 'f': function(e) { chrome.extension.sendMessage({'action':'NEW_WINDOW'}, function(r){}) } }
                }
        },
        /*switch tab to left/right*/
        //add by Jet , move to left/right tab just like firemacs
        'CTRL-B': {'h': 'Switch to left tab.', 'f': function(e) { chrome.extension.sendRequest({'action':'SWITCHTAB', 'offset': '-1'}); } },
        'CTRL-F': {'h': 'Switch to right tab.', 'f': function(e) { chrome.extension.sendRequest({'action':'SWITCHTAB', 'offset': '1'}); } },
        //add by Jet , move to left/right tab just like firemacs
        'H': {'h': 'Switch to left tab.', 'f': function(e) { chrome.extension.sendRequest({'action':'SWITCHTAB', 'offset': '-1'}); } },
        'L': {'h': 'Switch to right tab.', 'f': function(e) { chrome.extension.sendRequest({'action':'SWITCHTAB', 'offset': '1'}); } },
        /* Scrolling in X */
        // small scrolling
        'N': {'h': 'Scroll down 10%', 'f': function(e) { scroll(10, 0) } },
        'P': {'h': 'Scroll up 10%', 'f': function(e) { scroll(-10, 0) } },
        /*'CTRL-M': {'f': function(e) { scroll(10, 0) } },
        'CTRL-P': {'f': function(e) { scroll(-10, 0) } },*/
        'J': {'h': 'Scroll down 10%', 'f': function(e) { scroll(10, 0) } },
        'K': {'h': 'Scroll up 10%', 'f': function(e) { scroll(-10, 0) } },
        //add by Jet , scroll up/down, just like firemacs
        'CTRL-M': {'h': 'Scroll down 10%', 'f': function(e) { scroll(10, 0) } },
        'CTRL-P': {'h': 'Scroll up 10%', 'f': function(e) { scroll(-10, 0) } },
        // medium scrolling
        'ALT-E': {'h': 'Scroll down 50%', 'f': function(e) { scroll(50, 0) } },
        'ALT-A': {'h': 'Scroll up 50%', 'f': function(e) { scroll(-50, 0) } },
        // page scrolling
        'CTRL-V': {'h': 'Scroll down 90%', 'f': function(e) { scroll(90, 0) } },
        'ALT-V': {'h': 'Scroll up 90%', 'f': function(e) { scroll(-90, 0) } },
        //add by Jet, page scrolling bindings in ediff mode
        'V': {'h': 'Scroll down 90%','f': function(e) { scroll(90, 0) } },
        'SHIFT-V': {'h': 'Scroll up 90%','f': function(e) { scroll(-90, 0) } },
        //add by Jet, home and end on Meta-< and Meta->
        'ALT-SHIFT-.': {'h': 'Scroll to end', 'f': function(e) { document.body.scrollTop = document.body.offsetHeight } },
        'ALT-SHIFT-,': {'h': 'Scroll to home', 'f': function(e) { document.body.scrollTop = 0 } },
        'SHIFT-.': {'h': 'Scroll to end', 'f': function(e) { document.body.scrollTop = document.body.offsetHeight } },
        'SHIFT-,': {'h': 'Scroll to home', 'f': function(e) { document.body.scrollTop = 0 } },
        /* Scrolling in Y */
        //add by Jet, scroll left/right just like firemacs
        'SHIFT-L': {'h': 'Scroll right 10%', 'f': function(e) { scroll(10, 1) } },
        'SHIFT-H': {'h': 'Scroll left 10%', 'f': function(e) { scroll(-10, 1) } },
        //
        // small scrolling
        'F': {'h': 'Scroll right 10%', 'f': function(e) { scroll(10, 1) } },
        'B': {'h': 'Scroll left 10%', 'f': function(e) { scroll(-10, 1) } },
        // large scrolling
        'ALT-F': {'h': 'Scroll right 50%', 'f': function(e) { scroll(50, 1) } },
        'ALT-B': {'h': 'Scroll left 50%', 'f': function(e) { scroll(-50, 1) } },
        // page scrolling
        'E': {'h': 'Scroll right 90%', 'f': function(e) { scroll(90, 1) } },
        'A': {'h': 'Scroll left 90%', 'f': function(e) { scroll(-90, 1) } },
        'CTRL-E': {'h': 'Scroll right 90%', 'f': function(e) { scroll(90, 1) } },
        'CTRL-A': {'h': 'Scroll left 90%','f': function(e) { scroll(-90, 1) } },
        //add by Jet, history option.
        'SHIFT-F': {'h': 'moves to the next page.', 'f': function(e) { historyMove(1); } },
        'SHIFT-B': {'h': 'moves to the previous page.', 'f': function(e) { historyMove(-1); } },
        //
        // help function
        'SHIFT-=': {'h': 'Show help', 'f': function(e) { showHelp() } },
        'CTRL-H': {
            'M': {'h': 'Show help', 'f': function(e) { showHelp() } }
        },
        // eval javascript
        'ALT-SHIFT-1': {'h': 'Evaluate JavaScript', 'f': function(e) { evalJS(e) } },
        //move to next item in input area
        /*'CTRL-M(INPUT)': {'f': function(e) { moveItem(e, 1) } },
        'CTRL-P(INPUT)': {'f': function(e) { moveItem(e, -1) } },*/
        //copy/paste trail code
        //'ALT-W': {'h': 'Copy selection.', 'f': function(e) { cmdCopy(e, editing = 0) } },
        //
        // link to the god damn GPL
        'CTRL-6': {'h': 'Show license for EMACS icon', 'f': function(e) { log("The EMACS icon is distributed under the <a href='http://www.gnu.org/licenses/gpl-3.0.html'>GPv3 license</a>.") } }
};

//copy paste does not work on version 2, annoying permissions
var editShortcuts = {
        'CTRL-Y(EDIT)': {'f': function(e) { cmdPaste(e) } },
        'ALT-W(EDIT)': {'f': function(e) { cmdCopy(e, editing = 1) } },
        'CTRL-D(EDIT)': {'h': 'Delete selection or next character.', 'f': function(e) { cmdCut(e) } },
        'CTRL-A(EDIT)': {'h': 'Move to the beginning of line.', 'f': function(e) { editMove(e, '-n') } },
        'CTRL-E(EDIT)': {'h': 'Move to the end of line.', 'f': function(e) { editMove(e, 'n') } },
        'CTRL-F(EDIT)': {'h': 'Move forward.', 'f': function(e) { editMove(e, '1') } },
        'CTRL-B(EDIT)': {'h': 'Move backward.', 'f': function(e) { editMove(e, '-1') } },
        'CTRL-M(EDIT)': {'h': 'Move to next line.(because CTRL-M cannot be overloading)', 'f': function(e) { editMove(e, 'd') } },
        'CTRL-P(EDIT)': {'h': 'Move to previous line.', 'f': function(e) { editMove(e, 'u') } },
};

var inSeq = [];
var enabled = 1;
var readInput = 0;
var readPress = 0;
var readQuit = 0;

// add emacs status/input bar and dummy fill-element, to make page longer
var term = 0;
var termfill = 0;
// define log-func
var log = function(msg) {
        if (!document.body) return;
        if (!term) {
                termfill = document.createElement('DIV');
                termfill.className = 'styleReset emacsFill';
                document.body.appendChild(termfill);
                term = document.createElement('DIV');
                term.className = "styleReset emacsConsole";
                document.body.appendChild(term);
        }
        while (term.firstChild) term.removeChild(term.firstChild);
        term.style.display = 'block';
        var m = document.createElement("SPAN");
        m.innerHTML = msg;
        term.appendChild(m);
}

var resetConsole = function(keeplog) {
        if (!keeplog) {
                if (termfill) document.body.removeChild(termfill);
                if (term) document.body.removeChild(term);
                termfill = 0;
                term = 0;
        }
        readInput = 0;
        readPress = 0;
        readQuit = 0;
        inSeq = [];
}
resetConsole();

//clean weak bindings of Chrome
/*function cleanWeakBindings(){
    [>for (str in weakBindingObj)<]
    var e = document.createEvent('UIEvents');
    e.initEvent('keydown', true, true);
    e.ctrlKey = true;
    e.keyCode = 70;
    e.preventDefault();
}*/

//cleanWeakBindings();

document.addEventListener("keyup", function(e) {
        if (enabled) {
                e.preventDefault();
                e.stopPropagation();
        }
});
document.addEventListener("keypress", function(e) {
        if (enabled) {
                e.stopPropagation();
                if (readPress instanceof Function) {
                        e.preventDefault();
                        readPress(e, String.fromCharCode(e.keyCode).toUpperCase());
                }
        }
}, false);

// listen on keyboard events
//XXX: "all_frames": true nust be set in menifest.json, otherwise this function couldn't 
//be triggered in multi-frame page when keydown.
var keydownevent = function(e) {
        if (e.stopPropagation) e.stopPropagation();
        
        //if single Ctrl Shift or Alt , return
        switch (e.keyCode) {
            case 17:
            case 18:
            case 16:
                return;
        }
        // read input
        var input = '';
        if (e.ctrlKey)  input += 'CTRL-';
        if (e.altKey)   input += 'ALT-';
        if (e.shiftKey) input += 'SHIFT-';
        var key;
        switch (e.keyCode) {
                //case 226:
                case 37:
                case 38:
                case 39:
                case 40:
                    saveOffset = 0;
                    break;
                case 188: // ','
                    key = ',';
                    break;
                case 190: 
                    key = '.';
                    break; // '.'
                //case 187: // '='
                //case 191: key = '+'; break; // '/'
                case 187: key = '='; break; // '='
                default: key = String.fromCharCode(e.keyCode).toUpperCase(); break;
        }
        input += key;
        //console.log("Input: "+input+" ("+e.keyCode+")");

        if (e.keyCode == 70)
            if (e.ctrlKey)
                ;
        
        if (enabled) {
                // cancel? esc if no elm has focus
                if ((e.target == document.body && e.keyCode == 27) || input == "CTRL-G") {
                        if (e.preventDefault) e.preventDefault();
                        if (readQuit instanceof Function) readQuit();
                        resetConsole();
                        if (input == "CTRL-G") return;
                }
                // Do nothing when using form controls
                if (e.target != document.body) {
                        if (e.keyCode == 27) {
                                // escape pressed, remove focus
                                e.target.blur();
                                return;
                        }
                }
                // did a function request the input?
                if (readInput instanceof Function) {
                        if (!(readPress instanceof Function) && e.preventDefault) e.preventDefault();
                        readInput(e, input, key);
                        return;
                }

                // TODO: emacs bindings in text area.
                if (e.target != document.body) {
                        switch (e.target.tagName) {
                                case "SELECT":
                                // case "BUTTON":
                                return;
                                case "INPUT":
                                    /*input += '(INPUT)';
                                    break;*/
                                case "TEXTAREA":
                                    input += '(EDIT)';
                                    break;
                        }
                }
        }
        
        // native keybindings
        if (!inSeq.length) {
                if (input == 'CTRL-Q') {
                        enabled = !enabled;
                        if (enabled) {
                                chrome.extension.sendMessage({'action':'ENABLE'});
                                log("Emacs-mode enabled!");
                        } else {
                                if (e.preventDefault) e.preventDefault();
                                chrome.extension.sendMessage({'action':'DISABLE'});
                                if (readQuit instanceof Function) readQuit();
                                resetConsole();
                        }
                        return;
                }
                if (!enabled) return;
                // backspace: page back
                /*use explorer default backspace*/
                /*if (e.keyCode == 8) {
                        if (e.preventDefault) e.preventDefault();
                        history.go(-1);
                        return;
                }*/
                // if no shortcut exist in first press,
                // do default action
                if (!shortcuts[input] && !editShortcuts[input]) return;
        }
        
        // is the plugin disabled? then do nothing
        if (!enabled) return;
        
        /*// stop events
        if (e.preventDefault) e.preventDefault();*/
        
        // find shortcut
        var shortcut;
        if (input.indexOf("(EDIT)") < 0)
            shortcut = shortcuts;
        else
            shortcut = editShortcuts;

        //check return code to decide whether prevent default or not
        //skip prevent default when rc = 1
        var rc = 0;
        inSeq.push(input);
        log(inSeq.join(" "));
        for (var i = 0; i < inSeq.length; ++i) 
            if (shortcut[inSeq[i]]) {
                shortcut = shortcut[inSeq[i]];
                if (shortcut['f']) {
                        // sequence match
                        resetConsole();
                        rc = shortcut['f'](e);
                }
            } else {
                // invalid sequence
                log(inSeq.join(" ")+" is undefined in common bindings.");
                resetConsole(1);
            }
        // stop events
        if (!rc && e.preventDefault) e.preventDefault();
}
window.addEventListener('keydown', keydownevent, true);
/*document.addEventListener("keydown", keydownevent, false);*/


chrome.runtime.onMessage.addListener(function(req, sender, r) {
        switch (req.action) {
        case "keydown":
                keydownevent(req.event);
                break;
        case "showHelp":
                showHelp();
                break;
        }
});

/* Jump to - label-scheme */
var jumpTo = function(e) {
        // allocate data struct
        log("Jump to label: ");
        var data = {'elms': [], 'labels': []};

        // eventlistener:
        var _gs = function(e) { return document.defaultView.getComputedStyle(e); }
        var _gi = function(i) { try { return i.parseInt() } catch (e) { return 0 }; }
        // lets bind those items
        data.elms = [];
        var types = ['A','INPUT','TEXTAREA','SELECT','BUTTON'];
        for (var i = 0; i < types.length; i++) {
                var elms = document.getElementsByTagName(types[i]);
                for (var j = 0; j < elms.length; j++) if ((elms[j].type || elms[j].childNodes.length) && elms[j].type != 'hidden' && _gs(elms[j]).display != 'none' && _gs(elms[j]).visibility != 'hidden')  data.elms.push(elms[j]);
        }
        if (data.elms.length < 1) return;

        // assign each element a label
        var letters = ['A','B','C','D','E','F','G','H','I','J','K','L','O','M','N','P','Q','R','S','T','U','V','W','X','Y','Z'];
        data.seqlen = Math.ceil(Math.log(data.elms.length)/Math.log(letters.length));
        var key = [];
        for (var i = 0; i < data.seqlen; ++i) key.push(0);
        for (var i = 0; i < data.elms.length; i++) {
                // assign letter
                var e = data.elms[i];
                var gs = _gs(e);
                e.dataset.aakext = ""
                for (var j = data.seqlen-1; j >= 0; --j) e.dataset.aakext += letters[key[j]]+(j > 0 ? "-" : "");
                key[0]++;
                var index = 0;
                while (key[index] >= letters.length) {
                        key[index] = 0;
                        key[++index]++;
                }

                // display the shortcuts
                var d = document.createElement('SPAN');
                var p = e.parentNode;
                d.innerText = e.dataset.aakext;
                d.className = 'styleReset aakextlabel';
                
                if (e.tagName == "A" || e.tagName == "BUTTON") {
                        // yay, we can put the label inside the element
                        var dd = document.createElement('SPAN');
                        dd.className = 'styleReset aakextparent';
                        dd.appendChild(d);
                        if (e.childNodes.length) e.insertBefore(dd, e.childNodes[0]);
                        else e.appendChild(dd);
                        data.labels.push(dd);
                } else if (gs.position == "absolute" || gs.position == "fixed") {
                        // fix this since we cannot inject into inputs, i.e. searchfield on wiki, lets put the label on same coordinates
                        if (gs.left != "auto") d.style.left = _gi(gs.marginLeft)+_gi(gs.left)+"px";
                        else if (gs.right != "auto") d.style.right = _gi(gs.marginRight)+_gi(gs.right)+"px";
                        else d.style.marginLeft = _gi(gs.marginLeft)+"px";
                        if (gs.top != "auto") d.style.top = _gi(gs.marginTop)+_gi(gs.top)+"px";
                        else if (gs.bottom != "auto") d.style.bottom = Math.max(0,_gi(gs.marginBottom)+_gi(gs.bottom)+e.offsetHeight-10)+"px";
                        else d.style.marginTop = _gi(gs.marginTop)+"px";
                        if (_gi(gs.zIndex) >= 1100) d.style.zIndex = _gi(gs.zIndex)+1;
                        p.appendChild(d);
                        data.labels.push(d);
                } else if (gs.display == "block") {
                        // these are block elements.. crap
                        p = e.offsetParent || e.parentNode || document.body;
                        var l = e.offsetLeft+_gi(gs.marginLeft);
                        var t = e.offsetTop+_gi(gs.offsetTop);
                        while (p.tagName == "TABLE" || p.tagName == "TH" || p.tagName == "TD") {
                                l += p.offsetLeft;
                                t += p.offsetTop;
                                p = p.offsetParent || p.parentNode || document.body;
                        }
                        d.style.left = l+"px";
                        d.style.top = t+"px";
                        p.appendChild(d);
                        data.labels.push(d);
                } else {
                        var dd = document.createElement('SPAN');
                        dd.className = 'styleReset aakextparent';
                        dd.appendChild(d);
                        p.insertBefore(dd, e);
                        data.labels.push(dd);
                }
        }
        data.seq = [];
        readQuit = function() {
                // delete all injected labels
                for (var i = 0; i < data.elms.length; i++) if (data.elms[i]) delete data.elms[i].dataset.aakext;
                while (data.labels.length) {
                        var e = data.labels.pop();
                        e.parentNode.removeChild(e);
                }
                resetConsole(1);
        }
        readInput = function (e) {
                // links are activated, lets continue
                if (e.keyCode == 8) {
                        if (data.seq.length) data.seq.pop();
                        log("Jump to label: "+data.seq.join("-"));
                        return;
                }
                if ((e.keyCode >= 65 && e.keyCode <= 90) || (e.keyCode >= 97 && e.keyCode <= 122)) {
                        data.seq.push(String.fromCharCode(e.keyCode).toUpperCase());
                        log("Jump to label: "+data.seq.join("-"));
                        if (data.seq.length < data.seqlen) return;
                        var seq = data.seq.join("-");
                        for (var i = 0; i < data.elms.length; i++) if (data.elms[i] && data.elms[i].dataset.aakext == seq) {
                                // found label
                                data.elms[i].focus();
                                readQuit();
                                resetConsole();
                                return;
                        }
                        // label not found
                        readQuit();
                        log("Label "+data.seq.join("-")+" is undefined");
                        return;
                }
                return;
        }
}

var searchLinks = function(e, reg) {
        document.body.classList.add("emacsHighlightLinks");
        var links = document.getElementsByTagName("A");
        var sstr = "";
        var marked = 0;
        var name = reg ? "Regexp I-search: " : "I-search: ";
        log(name+sstr+" ("+links.length+" matches)");
        readQuit = function() {
                document.body.classList.remove("emacsHighlightLinks");
                if (links.length > marked) links[marked].classList.remove("emacsHighlightLinksSelected");
                for (var i = 0; i < links.length; i++) links[i].classList.remove("emacsHighlightLinks");
                resetConsole();
        }
        readInput = function(e, input, key) {
                if (e.keyCode == 8) { // backspace was pressed
                        if (e.stopPropagation) e.stopPropagation();
                        if (e.preventDefault) e.preventDefault();
                        if (sstr.length) {
                                sstr = sstr.substring(0, sstr.length-1);
                                if (links.length > marked) links[marked].classList.remove("emacsHighlightLinksSelected");
                                links = document.getElementsByTagName("A");
                                marked = links.length ? marked % links.length : 0;
                        }
                        return readPress(e, 0);
                }
                if (e.keyCode == 13) { // enter was pressed
                        if (e.stopPropagation) e.stopPropagation();
                        if (e.preventDefault) e.preventDefault();
                        if (links.length > marked) links[marked].focus();
                        return readQuit();
                }
                if (input == "CTRL-S" || input == "CTRL-ALT-S") {
                        if (e.stopPropagation) e.stopPropagation();
                        if (e.preventDefault) e.preventDefault();
                        if (links.length > marked) {
                                links[marked].classList.remove("emacsHighlightLinksSelected");
                                marked = (marked+1) % links.length;
                                links[marked].classList.add("emacsHighlightLinksSelected");
                        }
                }
                if (input == "CTRL-R" || input == "CTRL-ALT-R") {
                        if (e.stopPropagation) e.stopPropagation();
                        if (e.preventDefault) e.preventDefault();
                        if (links.length > marked) {
                                links[marked].classList.remove("emacsHighlightLinksSelected");
                                marked = (marked-1) % links.length;
                                if (marked < 0) marked += links.length;
                                links[marked].classList.add("emacsHighlightLinksSelected");
                        }
                }
        }
        readPress = function(e, key) {
                document.body.classList.remove("emacsHighlightLinks");
                if (links.length > marked) links[marked].classList.remove("emacsHighlightLinksSelected");
                if (key) sstr += String.fromCharCode(e.keyCode);
                var nlinks = [];
                if (reg) {
                        try {
                                var pat = new RegExp(sstr, "i");
                                for (var i = 0; i < links.length; i++) if (pat.test(links[i].innerText)) {
                                        links[i].classList.add("emacsHighlightLinks");
                                        nlinks.push(links[i]);
                                } else links[i].classList.remove("emacsHighlightLinks");
                        } catch (e) {
                                log(name+sstr+" (Error: "+e.message+")");
                                return;
                        }
                } else {
                        var csstr = sstr.toUpperCase();
                        for (var i = 0; i < links.length; i++) if (links[i].innerText.toUpperCase().indexOf(csstr) > -1) {
                                links[i].classList.add("emacsHighlightLinks");
                                nlinks.push(links[i]);
                        } else links[i].classList.remove("emacsHighlightLinks");
                }
                links = nlinks;
                marked = links.length ? marked % links.length : 0;
                if (links.length > marked) links[marked].classList.add("emacsHighlightLinksSelected");
                log(name+sstr+" ("+links.length+" matches)");
        }
}


/* Page scrolling functions */
var toolbarHeight = 150;// estimation value
var scrollbarWidth = 20;// estimation value
var scroll = function(p, d, e) {
    /*if (d) document.body.scrollLeft = document.body.scrollLeft+(p/100)*document.body.parentNode.clientWidth;
    else   document.body.scrollTop  = document.body.scrollTop +(p/100)*document.body.parentNode.clientHeight;*/

    var script = document.createElement('script');
    if (d){
        /*script.textContent = "window.scrollBy(" + (p/100)*window.innerWidth + ", 0)";*/
        script.textContent = "window.scrollBy(" + (p/100)*(window.outerWidth - scrollbarWidth) + ", 0)";
    }
    else
        {
            /*script.textContent = "window.scrollBy(0 ," + (p/100)*(window.innerHeight + window.outerHeight)/2 + ")";*/
            //use window.outerHeight because value of innerHeight is not correct.
            script.textContent = "window.scrollBy(0 ," + (p/100)*(window.outerHeight - toolbarHeight) + ")";
            /*script.textContent = "document.body.scrollTop =document.body.scrollTop + (" + p + "/100)* document.body.clientWidth;";*/
        }
    document.body.appendChild(script);
    document.body.removeChild(script);
};

var scrollTo = function(e) {
    var margin = 50;
    if(e.offsetTop > window.innerHeight - margin + document.body.scrollTop) {
        document.body.scrollTop = e.offsetTop - screen.height / 2;
    }
    if(e.offsetTop < document.body.scrollTop) {
        document.body.scrollTop = e.offsetTop - screen.height / 2;
    }
};

var readHelp = function(s, pre) {
        var h = "";
        for (var i in s) if (s[i]['f']) {
                if (s[i]['h']) h += pre+i+"\t"+s[i]['h']+"\n";
        } else h += readHelp(s[i], pre+i+" ");
        return h;
}

var helpOn = false;
var showHelp = function() {
        if (document.body) {
                if (helpOn) {
                        // quit self
                        helpOn = false;
                        if (readQuit instanceof Function) readQuit();
                        return;
                }
                //if frame is too small to display help message, return
                if (document.body.offsetHeight < 200 || document.body.offsetWidth < 200)
                    return;

                if (readQuit instanceof Function) readQuit(); // quit other process?
                resetConsole();
                helpOn = true;
                var helpdiv = document.createElement('DIV');
                helpdiv.className = 'styleReset emacsHelp';
                helpdiv.innerHTML = "<h1>Emacs-mode for Google Chrome</h1>";
                var tablediv = document.createElement('DIV');
                tablediv.className = 'tableholder';
                tablediv.innerHTML = "<table cellspacing='5' align='center'><tr><td valign='top' nowrap='nowrap'>"+(readHelp(shortcuts, "") + readHelp(editShortcuts, "")).replace(/\t/g, "</td><td valign='top'>: ").replace(/\n/g, "</td></tr><tr><td valign='top' nowrap='nowrap'>")+"</td></tr></table>";
                helpdiv.appendChild(tablediv);
                document.body.appendChild(helpdiv);
                readQuit = function() {
                        helpOn = false;
                        if (helpdiv) document.body.removeChild(helpdiv);
                        resetConsole();
                }
                readInput = function() {
                        readQuit();
                }
        }
}

var evalJS = function(e) {
        log("Eval JavaScript: ");
        var input = [];
        readQuit = function() {
                resetConsole(1);
        }
        readInput = function(e) {
                switch (e.keyCode) {
                case 8: // backspace
                        if (e.stopPropagation) e.stopPropagation();
                        if (e.preventDefault) e.preventDefault();
                        if (input.length) {
                                input.pop();
                                log("Eval JavaScript: "+input.join(""));
                        }
                        break;
                case 13: // enter
                        if (e.stopPropagation) e.stopPropagation();
                        if (e.preventDefault) e.preventDefault();
                        try {
                                log(eval(input.join("")));
                                readQuit();
                        } catch(e) {
                                log("Eval JavaScript: "+input.join("")+" (Error: "+e.message+")");
                        }
                        break;
                }
        }
        readPress = function(e) {
                input.push(String.fromCharCode(e.keyCode));
                log("Eval JavaScript: "+input.join(""));
        }
}

var getElement = function(e) {
    var element = document.getElementById(e.target.id);
    if (!element){
        element = document.getElementsByName(e.target.name);
        for (var i = 0; i < element.length; ++i)
            if (element[i] == document.activeElement)
                return element[i];
    }
    return element;
}

var cmdCopy = function(e, editing) {
    var s = window.getSelection();
    var text = s.toString();
    if (text.length >0){
        chrome.extension.sendMessage(
            {
                'action': "COPY",
                'type': "reformat",
                'text': text,
            }
        );
    }
}

var cmdPaste = function(e) {
    /*var tBox = document.getElementById(e.target.name);
    console.log("paste event log: " + e);*/
    /*document.execCommand('paste', false, null);*/
    chrome.extension.sendMessage(
        {
            'action': "PASTE",
            'textObjId': e.target.id,
        }, 
        function (res){
            var tBox = document.getElementById(res.textObjId);
            var text = tBox.value.substring(0, tBox.selectionStart);
            text += res.text;
            var pos = text.length;
            text += tBox.value.substring(tBox.selectionEnd, tBox.value.length);
            tBox.value = text;
            tBox.selectionStart = pos;
            tBox.selectionEnd = pos;
        }
    );

    /*var s = window.getSelection();
    document.execCommand("Paste", false, null);*/
}

var cmdCut = function(e) {
    cmdCopy(e);
    var tBox = getElement(e);
    var text = tBox.value.substring(0, tBox.selectionStart);
    var pos = text.length;
    text += tBox.value.substring(tBox.selectionEnd>tBox.selectionStart?tBox.selectionEnd:tBox.selectionEnd + 1, tBox.value.length);
    tBox.value = text;
    tBox.selectionStart = pos;
    tBox.selectionEnd = pos;
}

var findLineOffset = function(tb){
    res = 0;
    for (i = tb.selectionStart - 1 ; i >=0; --i){
        if (tb.value[i].charCodeAt() == 10)
            return {charoffset: res, indexoffset: tb.selectionStart - i -1};
        else
            if (tb.value[i].charCodeAt() <128)
                res += 1;
            else
                res += 2;
    }
    return {charoffset: tb.selectionStart, indexoffset: 0};
}

var saveOffset = 0;
var editMove = function(e, offset) {
    var tBox = getElement(e);

    var start = tBox.selectionStart;
    var end = tBox.selectionEnd;
    switch (offset) {
        case "-1":
            start -=1;
            end =start;
            break;
        case "1":
            start +=1;
            end =start;
            break;
        case "-n":
            for (var i = start - 1; i > 0; --i)
                if (tBox.value[i].charCodeAt() == 10){
                    start = i+1;
                    end = i+1;
                    break;
                }
            if (!i){
                start = 0;
                end = 0;
            }
            break;
        case "n":
            for (var i = start; i < tBox.value.length; ++i)
                if (tBox.value[i].charCodeAt() == 10){
                    start = i;
                    end = i;
                    break;
                }
            if (i == tBox.value.length){
                start = tBox.value.length;
                end = tBox.value.length;
            }
            break;
        case "u":
            var off = findLineOffset(tBox)
            var lineOffset = off.charoffset;
            if (saveOffset > lineOffset)
                lineOffset = saveOffset;
            var i;
            //find head of previous line
            for (i = start - off.indexoffset - 2 ; i >= 0; --i){
                if (tBox.value[i].charCodeAt() == 10)
                    break;
            }
            if (i < 0) i = -1;
            //calculate offset
            ++i;
            var code = tBox.value[i].charCodeAt();
            for (; lineOffset > 0 && code != 10;){
                if (code < 128)
                    lineOffset -=1;
                else
                    lineOffset -=2;
                ++i;
                code = tBox.value[i].charCodeAt();
            }

            start = lineOffset<0? i-1: i;
            end = start;
            //if target line is not long enough to move to current offset,
            //remember current charoffset, so that you can move to this offset
            //after next line move action.
            if (lineOffset && off.charoffset > saveOffset)
                saveOffset = off.charoffset;
            break;
        case "d":
            if (e.target.tagName == "INPUT")
                return moveItem(e, 1);
            var off = findLineOffset(tBox)
            var lineOffset = off.charoffset;
            if (saveOffset > lineOffset)
                lineOffset = saveOffset;
            var i
            //find head of next line
            for (i = start; i < tBox.value.length; ++i){
                if (tBox.value[i].charCodeAt() == 10)
                    break;
            }
            //calculate offset
            if ( i < tBox.value.length)
                ++i;
            var code = tBox.value[i].charCodeAt();
            for ( ; lineOffset > 0 && code != 10 && i < tBox.value.length;){
                if (code < 128)
                    lineOffset -=1;
                else
                    lineOffset -=2;
                ++i;
                code = tBox.value[i].charCodeAt();
            }

            start = lineOffset<0? i - 1: i;
            end = start;
            if (lineOffset && off.charoffset > saveOffset)
                saveOffset = off.charoffset;
            break;
    };
    tBox.selectionStart = start;
    tBox.selectionEnd = end;
    //clear saveOffset when horizontal move action occur
    switch(offset){
        case "-1":
        case "1":
        case "-n":
        case "n":
            saveOffset = 0;
    }
}

var historyMove = function(d){
    history.go(d);
}

//unfinished function, just a todo frame
var moveItem = function(e, offset){
    var inBox = getElement(e);
    switch(offset){
        case 1:
            /*var evt = document.createEvent("MouseEvents");  */
            var ev =document.createEvent("KeyboardEvent");

            /*ev.initKeyboardEvent("keydown", true, true, null, false, false, false, false, 40, 40);*/
            /*ev.initKeyboardEvent("keydown",true,true,null,false,false,false,false,0,40); */
            /*ev.initKeyboardEvent("keydown",true,true,window, "Down", 0, null); */
            /*ev.initKeyboardEvent("keydown",true,true,null, "U+0053", 0, null); */
            ev.initKeyboardEvent( 
                                 "keydown",        //  in DOMString typeArg,                                                           
                                 true,             //  in boolean canBubbleArg,                                                        
                                 true,             //  in boolean cancelableArg,                                                       
                                 null,             //  in nsIDOMAbstractView viewArg,  Specifies UIEvent.view. This value may be null.     
                                 "Down",
                                 false,            //  in boolean ctrlKeyArg,                                                               
                                 false,            //  in boolean altKeyArg,                                                        
                                 false,            //  in boolean shiftKeyArg,                                                      
                                 false,            //  in boolean metaKeyArg,                                                       
                                 false,
                                 40,              //  in unsigned long keyCodeArg,                                                      
                                 40);              // in unsigned long charCodeArg); */
            
            ev.keyCode = 40;
			inBox.dispatchEvent(ev);
            e.keyCode = 40;// key Down
            break;
        case -1:
            e.keyCode = 38// key Up
            break;
    }
}
