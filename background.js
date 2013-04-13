//sendRequestsendRequestCopyright (c) 2011 Theis Mackeprang (http://www.5p.dk/)
//
//Permission is hereby granted, free of charge, to any person obtaining a copy
//of this software and associated documentation files (the "Software"), to deal
//in the Software without restriction, including without limitation the rights
//to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//copies of the Software, and to permit persons to whom the Software is
//furnished to do so, subject to the following conditions:
//
//The above copyright notice and this permission notice shall be included in
//all copies or substantial portions of the Software.
//
//THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//THE SOFTWARE.
function switchtab(tab, offset) {
    var winid = tab.windowId;
    var tabid = tab.id;
    chrome.tabs.getAllInWindow(winid, function(tabs) {
        for (var j = 0; j < tabs.length; ++j) {
            if (tabs[j].id == tabid) {
                chrome.tabs.update(tabs[(j + tabs.length + offset) % tabs.length].id, {
                    'selected': true
                });
                break;
            }
        }
    });
}
function parseIntDefault (str, defaultValue) {
    var n = parseInt(str, 10);
    if (isNaN(n)) {
        return defaultValue;
    } else {
        return n;
    }
};
var clipBoardCache;
function onMessage(request, sender, callback) {
    switch (request.action) {
        case "CLOSE_WINDOW":
            chrome.windows.remove(sender.tab.windowId);
            break;
        case "CLOSE_ALL_WINDOWS":
            chrome.windows.getAll({}, function(ws) { for (i in ws) chrome.windows.remove(ws[i].id); });
            break;
        case "NEW_WINDOW":
            chrome.windows.create({}, function(){});
            break;
        case "CLOSE_TAB":
            chrome.tabs.remove(sender.tab.id);
            break;
        case "NEW_TAB":
            chrome.tabs.create({'windowId':sender.tab.windowId}, function(){});
            break;
        case "DISABLE":
            chrome.browserAction.setIcon({'path':"emacs_disabled.png",'tabId':sender.tab.id});
            break;
        case "ENABLE":
            chrome.browserAction.setIcon({'path':"emacs.png",'tabId':sender.tab.id});
            break;
            // Add by Jet, for switch tab to left/right.
        case "SWITCHTAB":
            console.log('Receive request', request);
            var offset = parseIntDefault(request['offset'], 1);
            switchtab(sender.tab, offset);
            break;
        case "COPY":
            if (request.type == "reformat"){
                //var cbc = document.getElementById('clipBoardCache');
                //cbc.value = request.text;
                clipBoardCache = request.ext
                //cbc.select();
                //
                var rv = document.execCommand("copy", false, null);
            }
            break;
        case "PASTE":
            if (!request.textObjId) break;
            var cbc = document.getElementById('clipBoardCache');
            cbc.value = "";
            cbc.focus();

            /*execCommand paste and executePaste need permission of chrome.experimental.clipboard
              please open experimental api permission in about:flags and in manifest.json
              if those apis become non-experimental apis, delete it's permission declaration in 
              manifest.json please, otherwise this extension couldn't be distributed.*/
            rv = document.execCommand("paste", false,null);
            console.log("returen value = " + rv);
            //callback({'textObjId': request.textObjId, 'text': cbc.value});
            /*chrome.experimental.clipboard.executePaste(sender.tab.id);*/
            callback({'textObjId': request.textObjId, 'text': cbc.value});
            return;
    }
    if (callback instanceof Function) callback({});
};
// Listen for the content script to send a message to the background page.
chrome.runtime.onMessage.addListener(onMessage);
// Show help, when click on logo
chrome.browserAction.onClicked.addListener(function(t) { chrome.tabs.sendMessage(t.id, {'action': 'showHelp'}) });
