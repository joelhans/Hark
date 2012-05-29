// HISTORY.js

window.JSON||(window.JSON={}),function(){function f(a){return a<10?"0"+a:a}function quote(a){return escapable.lastIndex=0,escapable.test(a)?'"'+a.replace(escapable,function(a){var b=meta[a];return typeof b=="string"?b:"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+a+'"'}function str(a,b){var c,d,e,f,g=gap,h,i=b[a];i&&typeof i=="object"&&typeof i.toJSON=="function"&&(i=i.toJSON(a)),typeof rep=="function"&&(i=rep.call(b,a,i));switch(typeof i){case"string":return quote(i);case"number":return isFinite(i)?String(i):"null";case"boolean":case"null":return String(i);case"object":if(!i)return"null";gap+=indent,h=[];if(Object.prototype.toString.apply(i)==="[object Array]"){f=i.length;for(c=0;c<f;c+=1)h[c]=str(c,i)||"null";return e=h.length===0?"[]":gap?"[\n"+gap+h.join(",\n"+gap)+"\n"+g+"]":"["+h.join(",")+"]",gap=g,e}if(rep&&typeof rep=="object"){f=rep.length;for(c=0;c<f;c+=1)d=rep[c],typeof d=="string"&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e))}else for(d in i)Object.hasOwnProperty.call(i,d)&&(e=str(d,i),e&&h.push(quote(d)+(gap?": ":":")+e));return e=h.length===0?"{}":gap?"{\n"+gap+h.join(",\n"+gap)+"\n"+g+"}":"{"+h.join(",")+"}",gap=g,e}}"use strict",typeof Date.prototype.toJSON!="function"&&(Date.prototype.toJSON=function(a){return isFinite(this.valueOf())?this.getUTCFullYear()+"-"+f(this.getUTCMonth()+1)+"-"+f(this.getUTCDate())+"T"+f(this.getUTCHours())+":"+f(this.getUTCMinutes())+":"+f(this.getUTCSeconds())+"Z":null},String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(a){return this.valueOf()});var JSON=window.JSON,cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},rep;typeof JSON.stringify!="function"&&(JSON.stringify=function(a,b,c){var d;gap="",indent="";if(typeof c=="number")for(d=0;d<c;d+=1)indent+=" ";else typeof c=="string"&&(indent=c);rep=b;if(!b||typeof b=="function"||typeof b=="object"&&typeof b.length=="number")return str("",{"":a});throw new Error("JSON.stringify")}),typeof JSON.parse!="function"&&(JSON.parse=function(text,reviver){function walk(a,b){var c,d,e=a[b];if(e&&typeof e=="object")for(c in e)Object.hasOwnProperty.call(e,c)&&(d=walk(e,c),d!==undefined?e[c]=d:delete e[c]);return reviver.call(a,b,e)}var j;text=String(text),cx.lastIndex=0,cx.test(text)&&(text=text.replace(cx,function(a){return"\\u"+("0000"+a.charCodeAt(0).toString(16)).slice(-4)}));if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,"@").replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,"]").replace(/(?:^|:|,)(?:\s*\[)+/g,"")))return j=eval("("+text+")"),typeof reviver=="function"?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}(),function(a,b){"use strict";var c=a.History=a.History||{},d=a.jQuery;if(typeof c.Adapter!="undefined")throw new Error("History.js Adapter has already been loaded...");c.Adapter={bind:function(a,b,c){d(a).bind(b,c)},trigger:function(a,b,c){d(a).trigger(b,c)},extractEventData:function(a,c,d){var e=c&&c.originalEvent&&c.originalEvent[a]||d&&d[a]||b;return e},onDomLoad:function(a){d(a)}},typeof c.init!="undefined"&&c.init()}(window),function(a,b){"use strict";var c=a.document,d=a.setTimeout||d,e=a.clearTimeout||e,f=a.setInterval||f,g=a.History=a.History||{};if(typeof g.initHtml4!="undefined")throw new Error("History.js HTML4 Support has already been loaded...");g.initHtml4=function(){if(typeof g.initHtml4.initialized!="undefined")return!1;g.initHtml4.initialized=!0,g.enabled=!0,g.savedHashes=[],g.isLastHash=function(a){var b=g.getHashByIndex(),c;return c=a===b,c},g.saveHash=function(a){return g.isLastHash(a)?!1:(g.savedHashes.push(a),!0)},g.getHashByIndex=function(a){var b=null;return typeof a=="undefined"?b=g.savedHashes[g.savedHashes.length-1]:a<0?b=g.savedHashes[g.savedHashes.length+a]:b=g.savedHashes[a],b},g.discardedHashes={},g.discardedStates={},g.discardState=function(a,b,c){var d=g.getHashByState(a),e;return e={discardedState:a,backState:c,forwardState:b},g.discardedStates[d]=e,!0},g.discardHash=function(a,b,c){var d={discardedHash:a,backState:c,forwardState:b};return g.discardedHashes[a]=d,!0},g.discardedState=function(a){var b=g.getHashByState(a),c;return c=g.discardedStates[b]||!1,c},g.discardedHash=function(a){var b=g.discardedHashes[a]||!1;return b},g.recycleState=function(a){var b=g.getHashByState(a);return g.discardedState(a)&&delete g.discardedStates[b],!0},g.emulated.hashChange&&(g.hashChangeInit=function(){g.checkerFunction=null;var b="",d,e,h,i;return g.isInternetExplorer()?(d="historyjs-iframe",e=c.createElement("iframe"),e.setAttribute("id",d),e.style.display="none",c.body.appendChild(e),e.contentWindow.document.open(),e.contentWindow.document.close(),h="",i=!1,g.checkerFunction=function(){if(i)return!1;i=!0;var c=g.getHash()||"",d=g.unescapeHash(e.contentWindow.document.location.hash)||"";return c!==b?(b=c,d!==c&&(h=d=c,e.contentWindow.document.open(),e.contentWindow.document.close(),e.contentWindow.document.location.hash=g.escapeHash(c)),g.Adapter.trigger(a,"hashchange")):d!==h&&(h=d,g.setHash(d,!1)),i=!1,!0}):g.checkerFunction=function(){var c=g.getHash();return c!==b&&(b=c,g.Adapter.trigger(a,"hashchange")),!0},g.intervalList.push(f(g.checkerFunction,g.options.hashChangeInterval)),!0},g.Adapter.onDomLoad(g.hashChangeInit)),g.emulated.pushState&&(g.onHashChange=function(b){var d=b&&b.newURL||c.location.href,e=g.getHashByUrl(d),f=null,h=null,i=null,j;return g.isLastHash(e)?(g.busy(!1),!1):(g.doubleCheckComplete(),g.saveHash(e),e&&g.isTraditionalAnchor(e)?(g.Adapter.trigger(a,"anchorchange"),g.busy(!1),!1):(f=g.extractState(g.getFullUrl(e||c.location.href,!1),!0),g.isLastSavedState(f)?(g.busy(!1),!1):(h=g.getHashByState(f),j=g.discardedState(f),j?(g.getHashByIndex(-2)===g.getHashByState(j.forwardState)?g.back(!1):g.forward(!1),!1):(g.pushState(f.data,f.title,f.url,!1),!0))))},g.Adapter.bind(a,"hashchange",g.onHashChange),g.pushState=function(b,d,e,f){if(g.getHashByUrl(e))throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(f!==!1&&g.busy())return g.pushQueue({scope:g,callback:g.pushState,args:arguments,queue:f}),!1;g.busy(!0);var h=g.createStateObject(b,d,e),i=g.getHashByState(h),j=g.getState(!1),k=g.getHashByState(j),l=g.getHash();return g.storeState(h),g.expectedStateId=h.id,g.recycleState(h),g.setTitle(h),i===k?(g.busy(!1),!1):i!==l&&i!==g.getShortUrl(c.location.href)?(g.setHash(i,!1),!1):(g.saveState(h),g.Adapter.trigger(a,"statechange"),g.busy(!1),!0)},g.replaceState=function(a,b,c,d){if(g.getHashByUrl(c))throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(d!==!1&&g.busy())return g.pushQueue({scope:g,callback:g.replaceState,args:arguments,queue:d}),!1;g.busy(!0);var e=g.createStateObject(a,b,c),f=g.getState(!1),h=g.getStateByIndex(-2);return g.discardState(f,e,h),g.pushState(e.data,e.title,e.url,!1),!0}),g.emulated.pushState&&g.getHash()&&!g.emulated.hashChange&&g.Adapter.onDomLoad(function(){g.Adapter.trigger(a,"hashchange")})},typeof g.init!="undefined"&&g.init()}(window),function(a,b){"use strict";var c=a.console||b,d=a.document,e=a.navigator,f=a.sessionStorage||!1,g=a.setTimeout,h=a.clearTimeout,i=a.setInterval,j=a.clearInterval,k=a.JSON,l=a.alert,m=a.History=a.History||{},n=a.history;k.stringify=k.stringify||k.encode,k.parse=k.parse||k.decode;if(typeof m.init!="undefined")throw new Error("History.js Core has already been loaded...");m.init=function(){return typeof m.Adapter=="undefined"?!1:(typeof m.initCore!="undefined"&&m.initCore(),typeof m.initHtml4!="undefined"&&m.initHtml4(),!0)},m.initCore=function(){if(typeof m.initCore.initialized!="undefined")return!1;m.initCore.initialized=!0,m.options=m.options||{},m.options.hashChangeInterval=m.options.hashChangeInterval||100,m.options.safariPollInterval=m.options.safariPollInterval||500,m.options.doubleCheckInterval=m.options.doubleCheckInterval||500,m.options.storeInterval=m.options.storeInterval||1e3,m.options.busyDelay=m.options.busyDelay||250,m.options.debug=m.options.debug||!1,m.options.initialTitle=m.options.initialTitle||d.title,m.intervalList=[],m.clearAllIntervals=function(){var a,b=m.intervalList;if(typeof b!="undefined"&&b!==null){for(a=0;a<b.length;a++)j(b[a]);m.intervalList=null}},m.debug=function(){(m.options.debug||!1)&&m.log.apply(m,arguments)},m.log=function(){var a=typeof c!="undefined"&&typeof c.log!="undefined"&&typeof c.log.apply!="undefined",b=d.getElementById("log"),e,f,g,h,i;a?(h=Array.prototype.slice.call(arguments),e=h.shift(),typeof c.debug!="undefined"?c.debug.apply(c,[e,h]):c.log.apply(c,[e,h])):e="\n"+arguments[0]+"\n";for(f=1,g=arguments.length;f<g;++f){i=arguments[f];if(typeof i=="object"&&typeof k!="undefined")try{i=k.stringify(i)}catch(j){}e+="\n"+i+"\n"}return b?(b.value+=e+"\n-----\n",b.scrollTop=b.scrollHeight-b.clientHeight):a||l(e),!0},m.getInternetExplorerMajorVersion=function(){var a=m.getInternetExplorerMajorVersion.cached=typeof m.getInternetExplorerMajorVersion.cached!="undefined"?m.getInternetExplorerMajorVersion.cached:function(){var a=3,b=d.createElement("div"),c=b.getElementsByTagName("i");while((b.innerHTML="<!--[if gt IE "+ ++a+"]><i></i><![endif]-->")&&c[0]);return a>4?a:!1}();return a},m.isInternetExplorer=function(){var a=m.isInternetExplorer.cached=typeof m.isInternetExplorer.cached!="undefined"?m.isInternetExplorer.cached:Boolean(m.getInternetExplorerMajorVersion());return a},m.emulated={pushState:!Boolean(a.history&&a.history.pushState&&a.history.replaceState&&!/ Mobile\/([1-7][a-z]|(8([abcde]|f(1[0-8]))))/i.test(e.userAgent)&&!/AppleWebKit\/5([0-2]|3[0-2])/i.test(e.userAgent)),hashChange:Boolean(!("onhashchange"in a||"onhashchange"in d)||m.isInternetExplorer()&&m.getInternetExplorerMajorVersion()<8)},m.enabled=!m.emulated.pushState,m.bugs={setHash:Boolean(!m.emulated.pushState&&e.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)),safariPoll:Boolean(!m.emulated.pushState&&e.vendor==="Apple Computer, Inc."&&/AppleWebKit\/5([0-2]|3[0-3])/.test(e.userAgent)),ieDoubleCheck:Boolean(m.isInternetExplorer()&&m.getInternetExplorerMajorVersion()<8),hashEscape:Boolean(m.isInternetExplorer()&&m.getInternetExplorerMajorVersion()<7)},m.isEmptyObject=function(a){for(var b in a)return!1;return!0},m.cloneObject=function(a){var b,c;return a?(b=k.stringify(a),c=k.parse(b)):c={},c},m.getRootUrl=function(){var a=d.location.protocol+"//"+(d.location.hostname||d.location.host);if(d.location.port||!1)a+=":"+d.location.port;return a+="/",a},m.getBaseHref=function(){var a=d.getElementsByTagName("base"),b=null,c="";return a.length===1&&(b=a[0],c=b.href.replace(/[^\/]+$/,"")),c=c.replace(/\/+$/,""),c&&(c+="/"),c},m.getBaseUrl=function(){var a=m.getBaseHref()||m.getBasePageUrl()||m.getRootUrl();return a},m.getPageUrl=function(){var a=m.getState(!1,!1),b=(a||{}).url||d.location.href,c;return c=b.replace(/\/+$/,"").replace(/[^\/]+$/,function(a,b,c){return/\./.test(a)?a:a+"/"}),c},m.getBasePageUrl=function(){var a=d.location.href.replace(/[#\?].*/,"").replace(/[^\/]+$/,function(a,b,c){return/[^\/]$/.test(a)?"":a}).replace(/\/+$/,"")+"/";return a},m.getFullUrl=function(a,b){var c=a,d=a.substring(0,1);return b=typeof b=="undefined"?!0:b,/[a-z]+\:\/\//.test(a)||(d==="/"?c=m.getRootUrl()+a.replace(/^\/+/,""):d==="#"?c=m.getPageUrl().replace(/#.*/,"")+a:d==="?"?c=m.getPageUrl().replace(/[\?#].*/,"")+a:b?c=m.getBaseUrl()+a.replace(/^(\.\/)+/,""):c=m.getBasePageUrl()+a.replace(/^(\.\/)+/,"")),c.replace(/\#$/,"")},m.getShortUrl=function(a){var b=a,c=m.getBaseUrl(),d=m.getRootUrl();return m.emulated.pushState&&(b=b.replace(c,"")),b=b.replace(d,"/"),m.isTraditionalAnchor(b)&&(b="./"+b),b=b.replace(/^(\.\/)+/g,"./").replace(/\#$/,""),b},m.store={},m.idToState=m.idToState||{},m.stateToId=m.stateToId||{},m.urlToId=m.urlToId||{},m.storedStates=m.storedStates||[],m.savedStates=m.savedStates||[],m.normalizeStore=function(){m.store.idToState=m.store.idToState||{},m.store.urlToId=m.store.urlToId||{},m.store.stateToId=m.store.stateToId||{}},m.getState=function(a,b){typeof a=="undefined"&&(a=!0),typeof b=="undefined"&&(b=!0);var c=m.getLastSavedState();return!c&&b&&(c=m.createStateObject()),a&&(c=m.cloneObject(c),c.url=c.cleanUrl||c.url),c},m.getIdByState=function(a){var b=m.extractId(a.url),c;if(!b){c=m.getStateString(a);if(typeof m.stateToId[c]!="undefined")b=m.stateToId[c];else if(typeof m.store.stateToId[c]!="undefined")b=m.store.stateToId[c];else{for(;;){b=(new Date).getTime()+String(Math.random()).replace(/\D/g,"");if(typeof m.idToState[b]=="undefined"&&typeof m.store.idToState[b]=="undefined")break}m.stateToId[c]=b,m.idToState[b]=a}}return b},m.normalizeState=function(a){var b,c;if(!a||typeof a!="object")a={};if(typeof a.normalized!="undefined")return a;if(!a.data||typeof a.data!="object")a.data={};b={},b.normalized=!0,b.title=a.title||"",b.url=m.getFullUrl(m.unescapeString(a.url||d.location.href)),b.hash=m.getShortUrl(b.url),b.data=m.cloneObject(a.data),b.id=m.getIdByState(b),b.cleanUrl=b.url.replace(/\??\&_suid.*/,""),b.url=b.cleanUrl,c=!m.isEmptyObject(b.data);if(b.title||c)b.hash=m.getShortUrl(b.url).replace(/\??\&_suid.*/,""),/\?/.test(b.hash)||(b.hash+="?"),b.hash+="&_suid="+b.id;return b.hashedUrl=m.getFullUrl(b.hash),(m.emulated.pushState||m.bugs.safariPoll)&&m.hasUrlDuplicate(b)&&(b.url=b.hashedUrl),b},m.createStateObject=function(a,b,c){var d={data:a,title:b,url:c};return d=m.normalizeState(d),d},m.getStateById=function(a){a=String(a);var c=m.idToState[a]||m.store.idToState[a]||b;return c},m.getStateString=function(a){var b,c,d;return b=m.normalizeState(a),c={data:b.data,title:a.title,url:a.url},d=k.stringify(c),d},m.getStateId=function(a){var b,c;return b=m.normalizeState(a),c=b.id,c},m.getHashByState=function(a){var b,c;return b=m.normalizeState(a),c=b.hash,c},m.extractId=function(a){var b,c,d;return c=/(.*)\&_suid=([0-9]+)$/.exec(a),d=c?c[1]||a:a,b=c?String(c[2]||""):"",b||!1},m.isTraditionalAnchor=function(a){var b=!/[\/\?\.]/.test(a);return b},m.extractState=function(a,b){var c=null,d,e;return b=b||!1,d=m.extractId(a),d&&(c=m.getStateById(d)),c||(e=m.getFullUrl(a),d=m.getIdByUrl(e)||!1,d&&(c=m.getStateById(d)),!c&&b&&!m.isTraditionalAnchor(a)&&(c=m.createStateObject(null,null,e))),c},m.getIdByUrl=function(a){var c=m.urlToId[a]||m.store.urlToId[a]||b;return c},m.getLastSavedState=function(){return m.savedStates[m.savedStates.length-1]||b},m.getLastStoredState=function(){return m.storedStates[m.storedStates.length-1]||b},m.hasUrlDuplicate=function(a){var b=!1,c;return c=m.extractState(a.url),b=c&&c.id!==a.id,b},m.storeState=function(a){return m.urlToId[a.url]=a.id,m.storedStates.push(m.cloneObject(a)),a},m.isLastSavedState=function(a){var b=!1,c,d,e;return m.savedStates.length&&(c=a.id,d=m.getLastSavedState(),e=d.id,b=c===e),b},m.saveState=function(a){return m.isLastSavedState(a)?!1:(m.savedStates.push(m.cloneObject(a)),!0)},m.getStateByIndex=function(a){var b=null;return typeof a=="undefined"?b=m.savedStates[m.savedStates.length-1]:a<0?b=m.savedStates[m.savedStates.length+a]:b=m.savedStates[a],b},m.getHash=function(){var a=m.unescapeHash(d.location.hash);return a},m.unescapeString=function(b){var c=b,d;for(;;){d=a.unescape(c);if(d===c)break;c=d}return c},m.unescapeHash=function(a){var b=m.normalizeHash(a);return b=m.unescapeString(b),b},m.normalizeHash=function(a){var b=a.replace(/[^#]*#/,"").replace(/#.*/,"");return b},m.setHash=function(a,b){var c,e,f;return b!==!1&&m.busy()?(m.pushQueue({scope:m,callback:m.setHash,args:arguments,queue:b}),!1):(c=m.escapeHash(a),m.busy(!0),e=m.extractState(a,!0),e&&!m.emulated.pushState?m.pushState(e.data,e.title,e.url,!1):d.location.hash!==c&&(m.bugs.setHash?(f=m.getPageUrl(),m.pushState(null,null,f+"#"+c,!1)):d.location.hash=c),m)},m.escapeHash=function(b){var c=m.normalizeHash(b);return c=a.escape(c),m.bugs.hashEscape||(c=c.replace(/\%21/g,"!").replace(/\%26/g,"&").replace(/\%3D/g,"=").replace(/\%3F/g,"?")),c},m.getHashByUrl=function(a){var b=String(a).replace(/([^#]*)#?([^#]*)#?(.*)/,"$2");return b=m.unescapeHash(b),b},m.setTitle=function(a){var b=a.title,c;b||(c=m.getStateByIndex(0),c&&c.url===a.url&&(b=c.title||m.options.initialTitle));try{d.getElementsByTagName("title")[0].innerHTML=b.replace("<","&lt;").replace(">","&gt;").replace(" & "," &amp; ")}catch(e){}return d.title=b,m},m.queues=[],m.busy=function(a){typeof a!="undefined"?m.busy.flag=a:typeof m.busy.flag=="undefined"&&(m.busy.flag=!1);if(!m.busy.flag){h(m.busy.timeout);var b=function(){var a,c,d;if(m.busy.flag)return;for(a=m.queues.length-1;a>=0;--a){c=m.queues[a];if(c.length===0)continue;d=c.shift(),m.fireQueueItem(d),m.busy.timeout=g(b,m.options.busyDelay)}};m.busy.timeout=g(b,m.options.busyDelay)}return m.busy.flag},m.busy.flag=!1,m.fireQueueItem=function(a){return a.callback.apply(a.scope||m,a.args||[])},m.pushQueue=function(a){return m.queues[a.queue||0]=m.queues[a.queue||0]||[],m.queues[a.queue||0].push(a),m},m.queue=function(a,b){return typeof a=="function"&&(a={callback:a}),typeof b!="undefined"&&(a.queue=b),m.busy()?m.pushQueue(a):m.fireQueueItem(a),m},m.clearQueue=function(){return m.busy.flag=!1,m.queues=[],m},m.stateChanged=!1,m.doubleChecker=!1,m.doubleCheckComplete=function(){return m.stateChanged=!0,m.doubleCheckClear(),m},m.doubleCheckClear=function(){return m.doubleChecker&&(h(m.doubleChecker),m.doubleChecker=!1),m},m.doubleCheck=function(a){return m.stateChanged=!1,m.doubleCheckClear(),m.bugs.ieDoubleCheck&&(m.doubleChecker=g(function(){return m.doubleCheckClear(),m.stateChanged||a(),!0},m.options.doubleCheckInterval)),m},m.safariStatePoll=function(){var b=m.extractState(d.location.href),c;if(!m.isLastSavedState(b))c=b;else return;return c||(c=m.createStateObject()),m.Adapter.trigger(a,"popstate"),m},m.back=function(a){return a!==!1&&m.busy()?(m.pushQueue({scope:m,callback:m.back,args:arguments,queue:a}),!1):(m.busy(!0),m.doubleCheck(function(){m.back(!1)}),n.go(-1),!0)},m.forward=function(a){return a!==!1&&m.busy()?(m.pushQueue({scope:m,callback:m.forward,args:arguments,queue:a}),!1):(m.busy(!0),m.doubleCheck(function(){m.forward(!1)}),n.go(1),!0)},m.go=function(a,b){var c;if(a>0)for(c=1;c<=a;++c)m.forward(b);else{if(!(a<0))throw new Error("History.go: History.go requires a positive or negative integer passed.");for(c=-1;c>=a;--c)m.back(b)}return m};if(m.emulated.pushState){var o=function(){};m.pushState=m.pushState||o,m.replaceState=m.replaceState||o}else m.onPopState=function(b,c){var e=!1,f=!1,g,h;return m.doubleCheckComplete(),g=m.getHash(),g?(h=m.extractState(g||d.location.href,!0),h?m.replaceState(h.data,h.title,h.url,!1):(m.Adapter.trigger(a,"anchorchange"),m.busy(!1)),m.expectedStateId=!1,!1):(e=m.Adapter.extractEventData("state",b,c)||!1,e?f=m.getStateById(e):m.expectedStateId?f=m.getStateById(m.expectedStateId):f=m.extractState(d.location.href),f||(f=m.createStateObject(null,null,d.location.href)),m.expectedStateId=!1,m.isLastSavedState(f)?(m.busy(!1),!1):(m.storeState(f),m.saveState(f),m.setTitle(f),m.Adapter.trigger(a,"statechange"),m.busy(!1),!0))},m.Adapter.bind(a,"popstate",m.onPopState),m.pushState=function(b,c,d,e){if(m.getHashByUrl(d)&&m.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(e!==!1&&m.busy())return m.pushQueue({scope:m,callback:m.pushState,args:arguments,queue:e}),!1;m.busy(!0);var f=m.createStateObject(b,c,d);return m.isLastSavedState(f)?m.busy(!1):(m.storeState(f),m.expectedStateId=f.id,n.pushState(f.id,f.title,f.url),m.Adapter.trigger(a,"popstate")),!0},m.replaceState=function(b,c,d,e){if(m.getHashByUrl(d)&&m.emulated.pushState)throw new Error("History.js does not support states with fragement-identifiers (hashes/anchors).");if(e!==!1&&m.busy())return m.pushQueue({scope:m,callback:m.replaceState,args:arguments,queue:e}),!1;m.busy(!0);var f=m.createStateObject(b,c,d);return m.isLastSavedState(f)?m.busy(!1):(m.storeState(f),m.expectedStateId=f.id,n.replaceState(f.id,f.title,f.url),m.Adapter.trigger(a,"popstate")),!0};if(f){try{m.store=k.parse(f.getItem("History.store"))||{}}catch(p){m.store={}}m.normalizeStore()}else m.store={},m.normalizeStore();m.Adapter.bind(a,"beforeunload",m.clearAllIntervals),m.Adapter.bind(a,"unload",m.clearAllIntervals),m.saveState(m.storeState(m.extractState(d.location.href,!0))),f&&(m.onUnload=function(){var a,b;try{a=k.parse(f.getItem("History.store"))||{}}catch(c){a={}}a.idToState=a.idToState||{},a.urlToId=a.urlToId||{},a.stateToId=a.stateToId||{};for(b in m.idToState){if(!m.idToState.hasOwnProperty(b))continue;a.idToState[b]=m.idToState[b]}for(b in m.urlToId){if(!m.urlToId.hasOwnProperty(b))continue;a.urlToId[b]=m.urlToId[b]}for(b in m.stateToId){if(!m.stateToId.hasOwnProperty(b))continue;a.stateToId[b]=m.stateToId[b]}m.store=a,m.normalizeStore(),f.setItem("History.store",k.stringify(a))},m.intervalList.push(i(m.onUnload,m.options.storeInterval)),m.Adapter.bind(a,"beforeunload",m.onUnload),m.Adapter.bind(a,"unload",m.onUnload));if(!m.emulated.pushState){m.bugs.safariPoll&&m.intervalList.push(i(m.safariStatePoll,m.options.safariPollInterval));if(e.vendor==="Apple Computer, Inc."||(e.appCodeName||"")==="Mozilla")m.Adapter.bind(a,"hashchange",function(){m.Adapter.trigger(a,"popstate")}),m.getHash()&&m.Adapter.onDomLoad(function(){m.Adapter.trigger(a,"hashchange")})}},m.init()}(window)

$(document).ready(function() {

  var mediaData,
      progress;

  var State = History.getState();

  //
  //  HTML5 History implementation via History.js: https://github.com/balupton/History.js/
  //

  var siteUrl = "http://" + top.location.host.toString();

  $(document).delegate('a[href="/listen"], a[href="/settings"], a[href^="/listen/podcast/"]', "click", function(e) {
    e.preventDefault();
    History.pushState({}, "", this.pathname);
  });

  History.Adapter.bind(window, 'statechange', function(){
    var State = History.getState();
    History.log(State.data, State.title, State.url);
    if (State.url == siteUrl + '/listen') {
      $.ajax({
        type: 'POST',
        url: '/listen',
        success: function(data) {
          $('#hark-podcasts').html(data);
          columnFixHeight();
          leftFixHeight();
          listenSwitch(State, siteUrl);
        }
      });
    } else if (State.url == siteUrl + '/settings') {
      $.ajax({
        type: 'POST',
        url: '/settings',
        success: function(data) {
          $('#hark-podcasts').html(data);
          columnFixHeight();
          leftFixHeight();
          listenSwitch(State, siteUrl);
        }
      });
    } else if (State.url == siteUrl + '/logout') {
      window.location.href = siteUrl + '/logout';
    } else {
      var data = { feed : State.url.split('/')[5] };
      $.ajax({
        type: 'POST',
        url: '/listen/podcast/' + data.feed,
        data: data,
        success: function(data) {
          $('.listen').html(data);
          columnFixHeight();
          leftFixHeight();
          listenSwitch(State, siteUrl);
        }
      });
    }

  }); 

  columnFixHeight();
  leftFixHeight();
  listenSwitch(State, siteUrl);

  window.onresize = function(event) { 
    columnFixHeight();
    leftFixHeight();
    listenSwitch(State, siteUrl);
  }

  //
  //  jPlayer initialization.
  //

  $('#jquery_jplayer_1').jPlayer({
    swfPath: "/js",
    supplied: 'mp3',
    // solution: 'html, flash',
    solution: 'flash, html',
    errorAlerts: false,
    play: function(d) {
      $('.jp-playing').fadeIn(300);
      updatePlaying = setInterval(function(){
        updateStatus();
      }, 120000);
    },
    timeupdate: function(d) {
      progress = d.jPlayer.status.currentTime;
      playStatus(progress, mediaData);
    },
    pause: function(d) {
      clearInterval(updatePlaying);
    },
    ended: function(d) {
      clearInterval(updatePlaying);
      $('[data-uuid="' + mediaData.podcastID + '"]')
        .animate(
          { opacity: '0' },
          { duration: 600
        })
        .animate(
          { height: '0px', 'margin-bottom': '0px' },
          { duration: 600,
          complete: function() {
            $(this).remove();
            $('.jp-playing').fadeOut(300).html('');
          }
      });
      $.ajax({
        type: 'POST',
        url: '/listen/' + mediaData.feedUUID + '/listened/' + mediaData.podcastID,
        data: mediaData,
        success: function() {},
        error: function() {
          console.log('jPlayer had an error.');
        }
      });
    },
    error:function(d) {
      console.log(d);
    },
    ready:function(d) {
      if (typeof(playing) !== 'undefined') {
        mediaData = playing;
        playStatus(playing.progress, playing);
        $('#jquery_jplayer_1').jPlayer("setMedia", {
          mp3: playing.podcast
        }).jPlayer('pause', Math.round(playing.progress));
      }
    }
  });

  //
  //  Manual synchronization.
  //

  $('.manual-sync').click(function(e) {
    progress = $('#jquery_jplayer_1').data("jPlayer").status.currentTime;
    playStatus(progress, mediaData);
    updateStatus();
  });

  //
  //  Go home.
  //

  $(document).delegate('.home', 'click', function(e) {
    e.preventDefault();
    History.pushState({}, "", this);
    $.ajax({
      type: 'POST',
      url: '/listen',
      success: function(data) {
        $('#hark-podcasts').html(data);
        leftFixHeight();
      }
    });
  });

  //
  //  Add a feed.
  //

  $('.addFeed').live('keypress', function(e){
    if(e.which == 13){
      data = { url : $(this).val() };
      $.ajax({
        type: "POST",
        url: '/listen/add',
        data: data,
        success: function(data) {
          $('#hark-podcasts').html(data);
          $('.addFeed').val('');
          leftFixHeight();
        }
      });
    }
  });

  //
  //  Remove a feed.
  //

  $(document).delegate('.removeFeed', 'click', function(e) {
    e.preventDefault();
    var data = { id : $(this).attr('href').split('/')[3] };
    $.ajax({
      type: 'POST',
      url: '/listen/remove/' + data.id,
      data: data,
      success: function(data) {
        $('#hark-podcasts').html(data);
        leftFixHeight();
      }
    });
  });

  //
  //  Edit a feed.
  //

  $(document).delegate('.editFeed', 'click', function(e) {
    e.preventDefault();
    var data = { id : $(this).attr('href').split('/')[3] };
    $(this).parent().parent().children('.loadFeed').fadeOut(300).promise().done(function() {
      $(this).next().fadeIn(300);
      $(this).next().val($(this).text());
    });
  });

  $('.edit-feed-input').live('keypress', function(e){
    if(e.which == 13){
      data = {
        id     : $(this).prev().attr('href').split('/')[3],
        feedName : $(this).val()
      };
      $.ajax({
        type: "POST",
        url: '/listen/edit/' + data.id,
        data: data,
        success: function(data) {
          $('#hark-podcasts').html(data);
          $('.addFeed').val('');
          leftFixHeight();
        }
      });
    }
  });

  //
  //  Mark a podcast as "listened."
  //

  $(document).delegate('.podcastListened', 'click', function(e) {
    e.preventDefault();
    var split = this.className.split(' ');
    var delegator = split[1];

    if ( delegator === 'all' ) {
      var data = {
        id : $(this).attr('href').split('/')[4],
        feed : $(this).attr('href').split('/')[2]
      };
      $(this).parent().parent().parent()
        // Why .parent('.podcastItem') doesn't work counfounds and annoys me.
        .animate(
          { opacity: '0' },
          { duration: 600
        })
        .animate(
          { height: '0px', 'margin-bottom': '0px' },
          { duration: 600,
          complete: function() {
            $(this).remove();
          }
        });
      $.ajax({
        type: 'POST',
        url: '/listen/' + data.feed + '/listened/' + data.id,
        data: data,
        success: function(data) {
          console.log('Marked as listened!' + data)
        },
        error: function(data) {
          console.log('Hark had an error.' + data);
        }
      });
    } else if ( delegator === 'single' ) {
      var data = {
        id : $(this).attr('href').split('/')[4],
        feed : $(this).attr('href').split('/')[2]
      };
      $('#' + data.id).removeClass('false');
      $.ajax({
        type: 'POST',
        url: '/listen/' + data.feed + '/listened/' + data.id,
        data: data,
        success: function() {  },
        error: function() {
          console.log('Hark had an error.');
        }
      });
    }


  });

  //
  // Listen to a podcast.
  //

  $(document).delegate('.podcastListen', 'click', function(e) {
    e.preventDefault();
    mediaData = {
      podcast: $(this).attr("data-file"),
      podcastTitle: $(this).attr("data-title"),
      podcastID: $(this).attr('href').split('/')[3],
      feedUUID: $(this).attr('href').split('/')[2],
      feedTitle: $(this).attr("data-feed")
    }
    $('#jquery_jplayer_1').jPlayer("setMedia", {
      mp3: mediaData.podcast
    }).jPlayer('play');
    $.ajax({
      type: 'POST',
      url: '/listen/' + mediaData.feedUUID + '/' + mediaData.podcastID,
      data: mediaData,
      success: function(data) {
        $('.jp-playing').html(data);
      }
    });
  });

  //
  // Read a description.
  //

  $(document).delegate('.podcastRead', 'click', function(e) {
    $(this).parent().parent().parent().children('.podcastDescription').toggle(500).promise().done(function() {
      leftFixHeight();
    });
    return false;
  });

  //
  // Load a single feed (or all feeds) for viewing.
  //

  $(document).delegate('.loadFeed, .loadFeedFromItem', 'click', function(e) {
    e.preventDefault();
    var data = { feed : $(this).attr('href').split('/')[3] };
    if ( typeof data.feed == "undefined" ) {
      return;
    } else {
      $.ajax({
        type: 'POST',
        url: '/listen/podcast/' + data.feed,
        data: data,
        success: function(data) {
          $('.listen').html(data);
          leftFixHeight();
        }
      });
    }
  });

  //
  //  Go back to all feeds.
  //

  $(document).delegate('.allFeeds', 'click', function(e) {
    e.preventDefault();
    var data = { feed : $(this).attr('href').split('/')[3] };
    History.pushState({}, "", this);
    $.ajax({
      type: 'POST',
      url: '/listen/',
      data: data,
      success: function(data) {
        $('#hark-podcasts').html(data);
        leftFixHeight();
      }
    });
  });

  //
  //  Update all feeds.
  //

  $(document).delegate('.feedUpdate', 'click', function(e) {
    e.preventDefault();
    $('.updateAction').html('Updating...').fadeIn(300);
    $.ajax({
      type: 'POST',
      url: '/listen/update',
      success: function(data) {
        $('.updateAction').html('Update').fadeOut(300);
        $('#hark-podcasts').html(data);
        leftFixHeight();
      }
    });
  });

  //
  //  Sorting.
  //

  $(document).delegate('.sort-feed', 'click', function(e) {
    e.preventDefault();

    var feedSortMe = new Array();

    $('.podcastItem').each(function() {
      sortData = {
        uuid: $(this).attr('data-uuid'),
        feedTitle: $(this).children('.podcastFeed').children().children().text()
      }
      feedSortMe.push(sortData);
      });

    if ( $('.sort-feed').hasClass('descending') !== true ) {
      feedSortMe.sort(function (a,b) {
        if (a['feedTitle'].toLowerCase() > b['feedTitle'].toLowerCase())
          return 1;
        if (a['feedTitle'].toLowerCase() < b['feedTitle'].toLowerCase())
          return -1;
        return 0;
      });
      $('.sort-feed').addClass('descending');
      $('.sort-title i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-feed i').removeClass('icon-chevron-up').addClass('icon-chevron-down');
    } else {
      feedSortMe.sort(function (a,b) {
        if (a['feedTitle'].toLowerCase() < b['feedTitle'].toLowerCase())
          return 1;
        if (a['feedTitle'].toLowerCase() > b['feedTitle'].toLowerCase())
          return -1;
        return 0;
      });
      $('.sort-feed').removeClass('descending').addClass('ascending');
      $('.sort-title i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-feed i').removeClass('icon-chevron-down').addClass('icon-chevron-up');
    }

    $.each(feedSortMe, function(){
      $('.podcastList').append($('[data-uuid="' + this.uuid + '"]'));
    });
  });

  $(document).delegate('.sort-title', 'click', function(e) {
    e.preventDefault();

    var feedSortMe = new Array();

    $('.podcastItem').each(function() {
      sortData = {
        uuid: $(this).attr('data-uuid'),
        feedTitle: $(this).children('.podcastTitle').children().children().text()
      }
      feedSortMe.push(sortData);
    });

    if ( $('.sort-title').hasClass('descending') !== true ) {
      feedSortMe.sort(function (a,b) {
        if (a['feedTitle'].toLowerCase() > b['feedTitle'].toLowerCase())
          return 1;
        if (a['feedTitle'].toLowerCase() < b['feedTitle'].toLowerCase())
          return -1;
        return 0;
      });
      $('.sort-title').addClass('descending');
      $('.sort-feed i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-title i').removeClass('icon-chevron-up').addClass('icon-chevron-down');
    } else {
      feedSortMe.sort(function (a,b) {
        if (a['feedTitle'].toLowerCase() < b['feedTitle'].toLowerCase())
          return 1;
        if (a['feedTitle'].toLowerCase() > b['feedTitle'].toLowerCase())
          return -1;
        return 0;
      });
      $('.sort-title').removeClass('descending').addClass('ascending');
      $('.sort-feed i, .sort-date i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-title i').removeClass('icon-chevron-down').addClass('icon-chevron-up');
    }

    $.each(feedSortMe, function() {
      $('.podcastList').append($('[data-uuid="' + this.uuid + '"]'));
    });
  });

  $(document).delegate('.sort-date', 'click', function(e) {
    e.preventDefault();

    var feedSortMe = new Array();

    $('.podcastItem').each(function() {
      sortData = {
        uuid: $(this).attr('data-uuid'),
        date: $(this).children('.podcastDate').children('p').attr('data-date')
      }
      feedSortMe.push(sortData);
    });

    if ( $('.sort-date').hasClass('descending') !== true ) {
      feedSortMe.sort(function (a,b) {
        if (moment(a['date']) < moment(b['date']))
          return 1;
        if (moment(a['date']) > moment(b['date']))
          return -1;
        return 0;
      });
      $('.sort-date').addClass('descending');
      $('.sort-title i, .sort-feed i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-date i').removeClass('icon-chevron-up').addClass('icon-chevron-down');
    } else {
      feedSortMe.sort(function (a,b) {
        if (moment(a['date']) > moment(b['date']))
          return 1;
        if (moment(a['date']) < moment(b['date']))
          return -1;
        return 0;
      });
      $('.sort-date').removeClass('descending').addClass('ascending');
      $('.sort-title i, .sort-feed i').removeClass('icon-chevron-down icon-chevron-up');
      $('.sort-date i').removeClass('icon-chevron-down').addClass('icon-chevron-up');
    }

    $.each(feedSortMe, function() {
      $('.podcastList').append($('[data-uuid="' + this.uuid + '"]'));
    });
  });

  //
  //  Settings.
  //

  $(document).delegate('.delete', 'click', function(e) {
    e.preventDefault();
    $('.settings-mask').fadeIn(200);
    $('.settings-modal-error').fadeIn(200);
  });

  $(document).delegate('.delete-confirm', 'click', function(e) {
    e.preventDefault();
    $.ajax({
      type: 'POST',
      url: '/settings/delete',
      success: function(data) {
        console.log('Deleted!');
      }
    });
  });

  //
  //  Errors.
  //

  $(document).delegate('.modal-error-close', 'click', function(e) {
    $('.mask, .settings-mask').fadeOut(200);
    $(this).parent().fadeOut(200);
  });

  //
  //  Radio waves.
  //

  var windowWidth = $(window).width();

  $('#wave').waveify('down');
  $('#about-wave').waveify('up');
  $('#header-wave').waveify('down');

  //
  //  Play status.
  //

  function playStatus(progress, mediaData) {
    sessionStorage.setItem("podcast", mediaData.podcast);
    sessionStorage.setItem("podcastID", mediaData.podcastID);
    sessionStorage.setItem("podcastFeed", mediaData.feedUUID);
    sessionStorage.setItem("feedTitle", mediaData.feedTitle);
    sessionStorage.setItem("podcastTitle", mediaData.podcastTitle);
    sessionStorage.setItem("progress", progress);
  }

  function updateStatus() {
    var playing = {
      "podcast" : sessionStorage.getItem("podcast"),
      "podcastID" : sessionStorage.getItem("podcastID"),
      "podTitle" : sessionStorage.getItem("podcastTitle"),
      "feedTitle" : sessionStorage.getItem("feedTitle"),
      "podcastFeed" : sessionStorage.getItem("podcastFeed"),
      "progress" : sessionStorage.getItem("progress")
    }
    $.ajax({
      type: 'POST',
      url: '/listen/playing',
      data: playing,
      success: function(data) {
        console.log('Sync-ed! ' + data);
      },
      error: function(data) {
        console.log('Error with syncing! ' + data);
        return;
      }
    });
  }

});

jQuery.fn.waveify = function(orientation) {
  var canvas = $(this)[0];
  
  if ( typeof(canvas) !== 'undefined' && canvas.getContext ) { 
    var ctx = canvas.getContext('2d'),
      x,
      y;

      ctx.canvas.width = $(window).width();
      
      ctx.lineWidth = 1;
      ctx.strokeStyle = 'rgba(0, 144, 205, 1)';
      ctx.fillStyle = 'rgba(0, 144, 205, 1)';

      ctx.beginPath();
      ctx.moveTo(0, 20);
      var freq = Math.random() * 0.01 + 0.01;
      for ( var i = 0; i <= $(window).width(); i++ ) {
        x = i;
        y = 10 * Math.sin(freq * x) + 20;
        ctx.lineTo(x, y);
        }
        if ( orientation === 'up' ) {
          ctx.lineTo($(window).width(), 40);
          ctx.lineTo(0, 40);
          ctx.lineTo(0, 20);
        } else if ( orientation === 'down' ) {
          ctx.lineTo($(window).width(), 0);
          ctx.lineTo(0, 0);
          ctx.lineTo(0, 20);
        }
        ctx.closePath();
        ctx.stroke();
        ctx.fill();
        var imageObj = new Image();
        function drawPattern() {
           var pattern = ctx.createPattern(imageObj, "repeat");
           ctx.fillStyle = pattern;
           ctx.fill();
        }
        imageObj.onload = drawPattern;
        imageObj.src = "/img/grainy.png";
    } else {
      return false;
    }
};

function leftFixHeight() {
  if ( $(window).width() > 768 ) {
    $('.subscriptions, .listen, .information, .settings').css('height', '');
    $('.subscriptions, .listen').height(Math.max($('.subscriptions').height(), $('.listen').height()) + 40);
    $('.information, .settings').height(Math.max($('.information').height(), $('.settings').height()) + 40);
  } else {
    $('.subscriptions, .listen, .information, .settings').css('height', '');
  }
}

function columnFixHeight() {
  var current;
  var tallest = $('.podcastList li').first().children('.podcastActions').height();
  $('.podcastDate, .podcastTitle, .podcastFeed').css({'height': tallest}).children('p').css({'padding-top': (tallest - 24) / 2});
}

function listenSwitch(State, siteUrl) {
  // if ( $(window).width() < 768 && State.url === siteUrl + '/listen' ) {
  //  var listen = $('.listen');
  //  var subscriptions = $('.subscriptions');
  //  $('#hark-podcasts').html('').append(listen).append(subscriptions);
  //  $('.sort-date').html('Date&nbsp;<i></i>');
  //  $('.sort-title').html('Podcast&nbsp;<i></i>');
  //  $('.sort-feed').html('Feed&nbsp;<i></i>');
  // } else if ( $(window).width() < 768 && State.url === siteUrl + '/settings' ) {
  //  var about = $('.information');
  //  console.log(about);
  //  var settings = $('.settings');
  //  $('#hark-podcasts').append(settings).append(about);
  // } else if ( $(window).width() >= 768 && State.url === siteUrl + '/listen' ) {
  //  var listen = $('.listen');
  //  var subscriptions = $('.subscriptions');
  //  $('#hark-podcasts').html('').append(subscriptions).append(listen);
  //  $('.sort-date').html('Sort by date&nbsp;<i></i>');
  //  $('.sort-title').html('Sort by podcast&nbsp;<i></i>');
  //  $('.sort-feed').html('Sort by feed title&nbsp;<i></i>');
  // } else if ( $(window).width() >= 768 && State.url === siteUrl + '/settings' ) {
  //  var about = $('.information');
  //  var settings = $('.settings');
  //  $('#hark-podcasts').html('').append(about).append(settings);
  // } else {
  //  console.log('help!');
  // }
}

/*
 * jPlayer Plugin for jQuery JavaScript Library
 * http://www.jplayer.org
 *
 * Copyright (c) 2009 - 2011 Happyworm Ltd
 * Dual licensed under the MIT and GPL licenses.
 *  - http://www.opensource.org/licenses/mit-license.php
 *  - http://www.gnu.org/copyleft/gpl.html
 *
 * Author: Mark J Panaghiston
 * Version: 2.1.0
 * Date: 1st September 2011
 */

(function(b,f){b.fn.jPlayer=function(a){var c=typeof a==="string",d=Array.prototype.slice.call(arguments,1),e=this,a=!c&&d.length?b.extend.apply(null,[!0,a].concat(d)):a;if(c&&a.charAt(0)==="_")return e;c?this.each(function(){var c=b.data(this,"jPlayer"),h=c&&b.isFunction(c[a])?c[a].apply(c,d):c;if(h!==c&&h!==f)return e=h,!1}):this.each(function(){var c=b.data(this,"jPlayer");c?c.option(a||{}):b.data(this,"jPlayer",new b.jPlayer(a,this))});return e};b.jPlayer=function(a,c){if(arguments.length){this.element=
b(c);this.options=b.extend(!0,{},this.options,a);var d=this;this.element.bind("remove.jPlayer",function(){d.destroy()});this._init()}};b.jPlayer.emulateMethods="load play pause";b.jPlayer.emulateStatus="src readyState networkState currentTime duration paused ended playbackRate";b.jPlayer.emulateOptions="muted volume";b.jPlayer.reservedEvent="ready flashreset resize repeat error warning";b.jPlayer.event={ready:"jPlayer_ready",flashreset:"jPlayer_flashreset",resize:"jPlayer_resize",repeat:"jPlayer_repeat",
click:"jPlayer_click",error:"jPlayer_error",warning:"jPlayer_warning",loadstart:"jPlayer_loadstart",progress:"jPlayer_progress",suspend:"jPlayer_suspend",abort:"jPlayer_abort",emptied:"jPlayer_emptied",stalled:"jPlayer_stalled",play:"jPlayer_play",pause:"jPlayer_pause",loadedmetadata:"jPlayer_loadedmetadata",loadeddata:"jPlayer_loadeddata",waiting:"jPlayer_waiting",playing:"jPlayer_playing",canplay:"jPlayer_canplay",canplaythrough:"jPlayer_canplaythrough",seeking:"jPlayer_seeking",seeked:"jPlayer_seeked",
timeupdate:"jPlayer_timeupdate",ended:"jPlayer_ended",ratechange:"jPlayer_ratechange",durationchange:"jPlayer_durationchange",volumechange:"jPlayer_volumechange"};b.jPlayer.htmlEvent="loadstart,abort,emptied,stalled,loadedmetadata,loadeddata,canplay,canplaythrough,ratechange".split(",");b.jPlayer.pause=function(){b.each(b.jPlayer.prototype.instances,function(a,b){b.data("jPlayer").status.srcSet&&b.jPlayer("pause")})};b.jPlayer.timeFormat={showHour:!1,showMin:!0,showSec:!0,padHour:!1,padMin:!0,padSec:!0,
sepHour:":",sepMin:":",sepSec:""};b.jPlayer.convertTime=function(a){var c=new Date(a*1E3),d=c.getUTCHours(),a=c.getUTCMinutes(),c=c.getUTCSeconds(),d=b.jPlayer.timeFormat.padHour&&d<10?"0"+d:d,a=b.jPlayer.timeFormat.padMin&&a<10?"0"+a:a,c=b.jPlayer.timeFormat.padSec&&c<10?"0"+c:c;return(b.jPlayer.timeFormat.showHour?d+b.jPlayer.timeFormat.sepHour:"")+(b.jPlayer.timeFormat.showMin?a+b.jPlayer.timeFormat.sepMin:"")+(b.jPlayer.timeFormat.showSec?c+b.jPlayer.timeFormat.sepSec:"")};b.jPlayer.uaBrowser=
function(a){var a=a.toLowerCase(),b=/(opera)(?:.*version)?[ \/]([\w.]+)/,d=/(msie) ([\w.]+)/,e=/(mozilla)(?:.*? rv:([\w.]+))?/,a=/(webkit)[ \/]([\w.]+)/.exec(a)||b.exec(a)||d.exec(a)||a.indexOf("compatible")<0&&e.exec(a)||[];return{browser:a[1]||"",version:a[2]||"0"}};b.jPlayer.uaPlatform=function(a){var b=a.toLowerCase(),d=/(android)/,e=/(mobile)/,a=/(ipad|iphone|ipod|android|blackberry|playbook|windows ce|webos)/.exec(b)||[],b=/(ipad|playbook)/.exec(b)||!e.exec(b)&&d.exec(b)||[];a[1]&&(a[1]=a[1].replace(/\s/g,
"_"));return{platform:a[1]||"",tablet:b[1]||""}};b.jPlayer.browser={};b.jPlayer.platform={};var i=b.jPlayer.uaBrowser(navigator.userAgent);if(i.browser)b.jPlayer.browser[i.browser]=!0,b.jPlayer.browser.version=i.version;i=b.jPlayer.uaPlatform(navigator.userAgent);if(i.platform)b.jPlayer.platform[i.platform]=!0,b.jPlayer.platform.mobile=!i.tablet,b.jPlayer.platform.tablet=!!i.tablet;b.jPlayer.prototype={count:0,version:{script:"2.1.0",needFlash:"2.1.0",flash:"unknown"},options:{swfPath:"js",solution:"html, flash",
supplied:"mp3",preload:"metadata",volume:0.8,muted:!1,wmode:"opaque",backgroundColor:"#000000",cssSelectorAncestor:"#jp_container_1",cssSelector:{videoPlay:".jp-video-play",play:".jp-play",pause:".jp-pause",stop:".jp-stop",seekBar:".jp-seek-bar",playBar:".jp-play-bar",mute:".jp-mute",unmute:".jp-unmute",volumeBar:".jp-volume-bar",volumeBarValue:".jp-volume-bar-value",volumeMax:".jp-volume-max",currentTime:".jp-current-time",duration:".jp-duration",fullScreen:".jp-full-screen",restoreScreen:".jp-restore-screen",
repeat:".jp-repeat",repeatOff:".jp-repeat-off",gui:".jp-gui",noSolution:".jp-no-solution"},fullScreen:!1,autohide:{restored:!1,full:!0,fadeIn:200,fadeOut:600,hold:1E3},loop:!1,repeat:function(a){a.jPlayer.options.loop?b(this).unbind(".jPlayerRepeat").bind(b.jPlayer.event.ended+".jPlayer.jPlayerRepeat",function(){b(this).jPlayer("play")}):b(this).unbind(".jPlayerRepeat")},nativeVideoControls:{},noFullScreen:{msie:/msie [0-6]/,ipad:/ipad.*?os [0-4]/,iphone:/iphone/,ipod:/ipod/,android_pad:/android [0-3](?!.*?mobile)/,
android_phone:/android.*?mobile/,blackberry:/blackberry/,windows_ce:/windows ce/,webos:/webos/},noVolume:{ipad:/ipad/,iphone:/iphone/,ipod:/ipod/,android_pad:/android(?!.*?mobile)/,android_phone:/android.*?mobile/,blackberry:/blackberry/,windows_ce:/windows ce/,webos:/webos/,playbook:/playbook/},verticalVolume:!1,idPrefix:"jp",noConflict:"jQuery",emulateHtml:!1,errorAlerts:!1,warningAlerts:!1},optionsAudio:{size:{width:"0px",height:"0px",cssClass:""},sizeFull:{width:"0px",height:"0px",cssClass:""}},
optionsVideo:{size:{width:"480px",height:"270px",cssClass:"jp-video-270p"},sizeFull:{width:"100%",height:"100%",cssClass:"jp-video-full"}},instances:{},status:{src:"",media:{},paused:!0,format:{},formatType:"",waitForPlay:!0,waitForLoad:!0,srcSet:!1,video:!1,seekPercent:0,currentPercentRelative:0,currentPercentAbsolute:0,currentTime:0,duration:0,readyState:0,networkState:0,playbackRate:1,ended:0},internal:{ready:!1},solution:{html:!0,flash:!0},format:{mp3:{codec:'audio/mpeg; codecs="mp3"',flashCanPlay:!0,
media:"audio"},m4a:{codec:'audio/mp4; codecs="mp4a.40.2"',flashCanPlay:!0,media:"audio"},oga:{codec:'audio/ogg; codecs="vorbis"',flashCanPlay:!1,media:"audio"},wav:{codec:'audio/wav; codecs="1"',flashCanPlay:!1,media:"audio"},webma:{codec:'audio/webm; codecs="vorbis"',flashCanPlay:!1,media:"audio"},fla:{codec:"audio/x-flv",flashCanPlay:!0,media:"audio"},m4v:{codec:'video/mp4; codecs="avc1.42E01E, mp4a.40.2"',flashCanPlay:!0,media:"video"},ogv:{codec:'video/ogg; codecs="theora, vorbis"',flashCanPlay:!1,
media:"video"},webmv:{codec:'video/webm; codecs="vorbis, vp8"',flashCanPlay:!1,media:"video"},flv:{codec:"video/x-flv",flashCanPlay:!0,media:"video"}},_init:function(){var a=this;this.element.empty();this.status=b.extend({},this.status);this.internal=b.extend({},this.internal);this.internal.domNode=this.element.get(0);this.formats=[];this.solutions=[];this.require={};this.htmlElement={};this.html={};this.html.audio={};this.html.video={};this.flash={};this.css={};this.css.cs={};this.css.jq={};this.ancestorJq=
[];this.options.volume=this._limitValue(this.options.volume,0,1);b.each(this.options.supplied.toLowerCase().split(","),function(c,d){var e=d.replace(/^\s+|\s+$/g,"");if(a.format[e]){var f=!1;b.each(a.formats,function(a,b){if(e===b)return f=!0,!1});f||a.formats.push(e)}});b.each(this.options.solution.toLowerCase().split(","),function(c,d){var e=d.replace(/^\s+|\s+$/g,"");if(a.solution[e]){var f=!1;b.each(a.solutions,function(a,b){if(e===b)return f=!0,!1});f||a.solutions.push(e)}});this.internal.instance=
"jp_"+this.count;this.instances[this.internal.instance]=this.element;this.element.attr("id")||this.element.attr("id",this.options.idPrefix+"_jplayer_"+this.count);this.internal.self=b.extend({},{id:this.element.attr("id"),jq:this.element});this.internal.audio=b.extend({},{id:this.options.idPrefix+"_audio_"+this.count,jq:f});this.internal.video=b.extend({},{id:this.options.idPrefix+"_video_"+this.count,jq:f});this.internal.flash=b.extend({},{id:this.options.idPrefix+"_flash_"+this.count,jq:f,swf:this.options.swfPath+
(this.options.swfPath.toLowerCase().slice(-4)!==".swf"?(this.options.swfPath&&this.options.swfPath.slice(-1)!=="/"?"/":"")+"Jplayer.swf":"")});this.internal.poster=b.extend({},{id:this.options.idPrefix+"_poster_"+this.count,jq:f});b.each(b.jPlayer.event,function(b,c){a.options[b]!==f&&(a.element.bind(c+".jPlayer",a.options[b]),a.options[b]=f)});this.require.audio=!1;this.require.video=!1;b.each(this.formats,function(b,c){a.require[a.format[c].media]=!0});this.options=this.require.video?b.extend(!0,
{},this.optionsVideo,this.options):b.extend(!0,{},this.optionsAudio,this.options);this._setSize();this.status.nativeVideoControls=this._uaBlocklist(this.options.nativeVideoControls);this.status.noFullScreen=this._uaBlocklist(this.options.noFullScreen);this.status.noVolume=this._uaBlocklist(this.options.noVolume);this._restrictNativeVideoControls();this.htmlElement.poster=document.createElement("img");this.htmlElement.poster.id=this.internal.poster.id;this.htmlElement.poster.onload=function(){(!a.status.video||
a.status.waitForPlay)&&a.internal.poster.jq.show()};this.element.append(this.htmlElement.poster);this.internal.poster.jq=b("#"+this.internal.poster.id);this.internal.poster.jq.css({width:this.status.width,height:this.status.height});this.internal.poster.jq.hide();this.internal.poster.jq.bind("click.jPlayer",function(){a._trigger(b.jPlayer.event.click)});this.html.audio.available=!1;if(this.require.audio)this.htmlElement.audio=document.createElement("audio"),this.htmlElement.audio.id=this.internal.audio.id,
this.html.audio.available=!!this.htmlElement.audio.canPlayType&&this._testCanPlayType(this.htmlElement.audio);this.html.video.available=!1;if(this.require.video)this.htmlElement.video=document.createElement("video"),this.htmlElement.video.id=this.internal.video.id,this.html.video.available=!!this.htmlElement.video.canPlayType&&this._testCanPlayType(this.htmlElement.video);this.flash.available=this._checkForFlash(10);this.html.canPlay={};this.flash.canPlay={};b.each(this.formats,function(b,c){a.html.canPlay[c]=
a.html[a.format[c].media].available&&""!==a.htmlElement[a.format[c].media].canPlayType(a.format[c].codec);a.flash.canPlay[c]=a.format[c].flashCanPlay&&a.flash.available});this.html.desired=!1;this.flash.desired=!1;b.each(this.solutions,function(c,d){if(c===0)a[d].desired=!0;else{var e=!1,f=!1;b.each(a.formats,function(b,c){a[a.solutions[0]].canPlay[c]&&(a.format[c].media==="video"?f=!0:e=!0)});a[d].desired=a.require.audio&&!e||a.require.video&&!f}});this.html.support={};this.flash.support={};b.each(this.formats,
function(b,c){a.html.support[c]=a.html.canPlay[c]&&a.html.desired;a.flash.support[c]=a.flash.canPlay[c]&&a.flash.desired});this.html.used=!1;this.flash.used=!1;b.each(this.solutions,function(c,d){b.each(a.formats,function(b,c){if(a[d].support[c])return a[d].used=!0,!1})});this._resetActive();this._resetGate();this._cssSelectorAncestor(this.options.cssSelectorAncestor);!this.html.used&&!this.flash.used?(this._error({type:b.jPlayer.error.NO_SOLUTION,context:"{solution:'"+this.options.solution+"', supplied:'"+
this.options.supplied+"'}",message:b.jPlayer.errorMsg.NO_SOLUTION,hint:b.jPlayer.errorHint.NO_SOLUTION}),this.css.jq.noSolution.length&&this.css.jq.noSolution.show()):this.css.jq.noSolution.length&&this.css.jq.noSolution.hide();if(this.flash.used){var c,d="jQuery="+encodeURI(this.options.noConflict)+"&id="+encodeURI(this.internal.self.id)+"&vol="+this.options.volume+"&muted="+this.options.muted;if(b.browser.msie&&Number(b.browser.version)<=8){d=['<param name="movie" value="'+this.internal.flash.swf+
'" />','<param name="FlashVars" value="'+d+'" />','<param name="allowScriptAccess" value="always" />','<param name="bgcolor" value="'+this.options.backgroundColor+'" />','<param name="wmode" value="'+this.options.wmode+'" />'];c=document.createElement('<object id="'+this.internal.flash.id+'" classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" width="0" height="0"></object>');for(var e=0;e<d.length;e++)c.appendChild(document.createElement(d[e]))}else e=function(a,b,c){var d=document.createElement("param");
d.setAttribute("name",b);d.setAttribute("value",c);a.appendChild(d)},c=document.createElement("object"),c.setAttribute("id",this.internal.flash.id),c.setAttribute("data",this.internal.flash.swf),c.setAttribute("type","application/x-shockwave-flash"),c.setAttribute("width","1"),c.setAttribute("height","1"),e(c,"flashvars",d),e(c,"allowscriptaccess","always"),e(c,"bgcolor",this.options.backgroundColor),e(c,"wmode",this.options.wmode);this.element.append(c);this.internal.flash.jq=b(c)}if(this.html.used){if(this.html.audio.available)this._addHtmlEventListeners(this.htmlElement.audio,
this.html.audio),this.element.append(this.htmlElement.audio),this.internal.audio.jq=b("#"+this.internal.audio.id);if(this.html.video.available)this._addHtmlEventListeners(this.htmlElement.video,this.html.video),this.element.append(this.htmlElement.video),this.internal.video.jq=b("#"+this.internal.video.id),this.status.nativeVideoControls?this.internal.video.jq.css({width:this.status.width,height:this.status.height}):this.internal.video.jq.css({width:"0px",height:"0px"}),this.internal.video.jq.bind("click.jPlayer",
function(){a._trigger(b.jPlayer.event.click)})}this.options.emulateHtml&&this._emulateHtmlBridge();this.html.used&&!this.flash.used&&setTimeout(function(){a.internal.ready=!0;a.version.flash="n/a";a._trigger(b.jPlayer.event.repeat);a._trigger(b.jPlayer.event.ready)},100);this._updateNativeVideoControls();this._updateInterface();this._updateButtons(!1);this._updateAutohide();this._updateVolume(this.options.volume);this._updateMute(this.options.muted);this.css.jq.videoPlay.length&&this.css.jq.videoPlay.hide();
b.jPlayer.prototype.count++},destroy:function(){this.clearMedia();this._removeUiClass();this.css.jq.currentTime.length&&this.css.jq.currentTime.text("");this.css.jq.duration.length&&this.css.jq.duration.text("");b.each(this.css.jq,function(a,b){b.length&&b.unbind(".jPlayer")});this.internal.poster.jq.unbind(".jPlayer");this.internal.video.jq&&this.internal.video.jq.unbind(".jPlayer");this.options.emulateHtml&&this._destroyHtmlBridge();this.element.removeData("jPlayer");this.element.unbind(".jPlayer");
this.element.empty();delete this.instances[this.internal.instance]},enable:function(){},disable:function(){},_testCanPlayType:function(a){try{return a.canPlayType(this.format.mp3.codec),!0}catch(b){return!1}},_uaBlocklist:function(a){var c=navigator.userAgent.toLowerCase(),d=!1;b.each(a,function(a,b){if(b&&b.test(c))return d=!0,!1});return d},_restrictNativeVideoControls:function(){if(this.require.audio&&this.status.nativeVideoControls)this.status.nativeVideoControls=!1,this.status.noFullScreen=!0},
_updateNativeVideoControls:function(){if(this.html.video.available&&this.html.used)this.htmlElement.video.controls=this.status.nativeVideoControls,this._updateAutohide(),this.status.nativeVideoControls&&this.require.video?(this.internal.poster.jq.hide(),this.internal.video.jq.css({width:this.status.width,height:this.status.height})):this.status.waitForPlay&&this.status.video&&(this.internal.poster.jq.show(),this.internal.video.jq.css({width:"0px",height:"0px"}))},_addHtmlEventListeners:function(a,
c){var d=this;a.preload=this.options.preload;a.muted=this.options.muted;a.volume=this.options.volume;a.addEventListener("progress",function(){c.gate&&(d._getHtmlStatus(a),d._updateInterface(),d._trigger(b.jPlayer.event.progress))},!1);a.addEventListener("timeupdate",function(){c.gate&&(d._getHtmlStatus(a),d._updateInterface(),d._trigger(b.jPlayer.event.timeupdate))},!1);a.addEventListener("durationchange",function(){if(c.gate)d.status.duration=this.duration,d._getHtmlStatus(a),d._updateInterface(),
d._trigger(b.jPlayer.event.durationchange)},!1);a.addEventListener("play",function(){c.gate&&(d._updateButtons(!0),d._html_checkWaitForPlay(),d._trigger(b.jPlayer.event.play))},!1);a.addEventListener("playing",function(){c.gate&&(d._updateButtons(!0),d._seeked(),d._trigger(b.jPlayer.event.playing))},!1);a.addEventListener("pause",function(){c.gate&&(d._updateButtons(!1),d._trigger(b.jPlayer.event.pause))},!1);a.addEventListener("waiting",function(){c.gate&&(d._seeking(),d._trigger(b.jPlayer.event.waiting))},
!1);a.addEventListener("seeking",function(){c.gate&&(d._seeking(),d._trigger(b.jPlayer.event.seeking))},!1);a.addEventListener("seeked",function(){c.gate&&(d._seeked(),d._trigger(b.jPlayer.event.seeked))},!1);a.addEventListener("volumechange",function(){if(c.gate)d.options.volume=a.volume,d.options.muted=a.muted,d._updateMute(),d._updateVolume(),d._trigger(b.jPlayer.event.volumechange)},!1);a.addEventListener("suspend",function(){c.gate&&(d._seeked(),d._trigger(b.jPlayer.event.suspend))},!1);a.addEventListener("ended",
function(){if(c.gate){if(!b.jPlayer.browser.webkit)d.htmlElement.media.currentTime=0;d.htmlElement.media.pause();d._updateButtons(!1);d._getHtmlStatus(a,!0);d._updateInterface();d._trigger(b.jPlayer.event.ended)}},!1);a.addEventListener("error",function(){if(c.gate&&(d._updateButtons(!1),d._seeked(),d.status.srcSet))clearTimeout(d.internal.htmlDlyCmdId),d.status.waitForLoad=!0,d.status.waitForPlay=!0,d.status.video&&!d.status.nativeVideoControls&&d.internal.video.jq.css({width:"0px",height:"0px"}),
d._validString(d.status.media.poster)&&!d.status.nativeVideoControls&&d.internal.poster.jq.show(),d.css.jq.videoPlay.length&&d.css.jq.videoPlay.show(),d._error({type:b.jPlayer.error.URL,context:d.status.src,message:b.jPlayer.errorMsg.URL,hint:b.jPlayer.errorHint.URL})},!1);b.each(b.jPlayer.htmlEvent,function(e,g){a.addEventListener(this,function(){c.gate&&d._trigger(b.jPlayer.event[g])},!1)})},_getHtmlStatus:function(a,b){var d=0,e=0,g=0,f=0;if(a.duration)this.status.duration=a.duration;d=a.currentTime;
e=this.status.duration>0?100*d/this.status.duration:0;typeof a.seekable==="object"&&a.seekable.length>0?(g=this.status.duration>0?100*a.seekable.end(a.seekable.length-1)/this.status.duration:100,f=100*a.currentTime/a.seekable.end(a.seekable.length-1)):(g=100,f=e);b&&(e=f=d=0);this.status.seekPercent=g;this.status.currentPercentRelative=f;this.status.currentPercentAbsolute=e;this.status.currentTime=d;this.status.readyState=a.readyState;this.status.networkState=a.networkState;this.status.playbackRate=
a.playbackRate;this.status.ended=a.ended},_resetStatus:function(){this.status=b.extend({},this.status,b.jPlayer.prototype.status)},_trigger:function(a,c,d){a=b.Event(a);a.jPlayer={};a.jPlayer.version=b.extend({},this.version);a.jPlayer.options=b.extend(!0,{},this.options);a.jPlayer.status=b.extend(!0,{},this.status);a.jPlayer.html=b.extend(!0,{},this.html);a.jPlayer.flash=b.extend(!0,{},this.flash);if(c)a.jPlayer.error=b.extend({},c);if(d)a.jPlayer.warning=b.extend({},d);this.element.trigger(a)},
jPlayerFlashEvent:function(a,c){if(a===b.jPlayer.event.ready)if(this.internal.ready){if(this.flash.gate){if(this.status.srcSet){var d=this.status.currentTime,e=this.status.paused;this.setMedia(this.status.media);d>0&&(e?this.pause(d):this.play(d))}this._trigger(b.jPlayer.event.flashreset)}}else this.internal.ready=!0,this.internal.flash.jq.css({width:"0px",height:"0px"}),this.version.flash=c.version,this.version.needFlash!==this.version.flash&&this._error({type:b.jPlayer.error.VERSION,context:this.version.flash,
message:b.jPlayer.errorMsg.VERSION+this.version.flash,hint:b.jPlayer.errorHint.VERSION}),this._trigger(b.jPlayer.event.repeat),this._trigger(a);if(this.flash.gate)switch(a){case b.jPlayer.event.progress:this._getFlashStatus(c);this._updateInterface();this._trigger(a);break;case b.jPlayer.event.timeupdate:this._getFlashStatus(c);this._updateInterface();this._trigger(a);break;case b.jPlayer.event.play:this._seeked();this._updateButtons(!0);this._trigger(a);break;case b.jPlayer.event.pause:this._updateButtons(!1);
this._trigger(a);break;case b.jPlayer.event.ended:this._updateButtons(!1);this._trigger(a);break;case b.jPlayer.event.click:this._trigger(a);break;case b.jPlayer.event.error:this.status.waitForLoad=!0;this.status.waitForPlay=!0;this.status.video&&this.internal.flash.jq.css({width:"0px",height:"0px"});this._validString(this.status.media.poster)&&this.internal.poster.jq.show();this.css.jq.videoPlay.length&&this.status.video&&this.css.jq.videoPlay.show();this.status.video?this._flash_setVideo(this.status.media):
this._flash_setAudio(this.status.media);this._updateButtons(!1);this._error({type:b.jPlayer.error.URL,context:c.src,message:b.jPlayer.errorMsg.URL,hint:b.jPlayer.errorHint.URL});break;case b.jPlayer.event.seeking:this._seeking();this._trigger(a);break;case b.jPlayer.event.seeked:this._seeked();this._trigger(a);break;case b.jPlayer.event.ready:break;default:this._trigger(a)}return!1},_getFlashStatus:function(a){this.status.seekPercent=a.seekPercent;this.status.currentPercentRelative=a.currentPercentRelative;
this.status.currentPercentAbsolute=a.currentPercentAbsolute;this.status.currentTime=a.currentTime;this.status.duration=a.duration;this.status.readyState=4;this.status.networkState=0;this.status.playbackRate=1;this.status.ended=!1},_updateButtons:function(a){if(a!==f)this.status.paused=!a,this.css.jq.play.length&&this.css.jq.pause.length&&(a?(this.css.jq.play.hide(),this.css.jq.pause.show()):(this.css.jq.play.show(),this.css.jq.pause.hide()));this.css.jq.restoreScreen.length&&this.css.jq.fullScreen.length&&
(this.status.noFullScreen?(this.css.jq.fullScreen.hide(),this.css.jq.restoreScreen.hide()):this.options.fullScreen?(this.css.jq.fullScreen.hide(),this.css.jq.restoreScreen.show()):(this.css.jq.fullScreen.show(),this.css.jq.restoreScreen.hide()));this.css.jq.repeat.length&&this.css.jq.repeatOff.length&&(this.options.loop?(this.css.jq.repeat.hide(),this.css.jq.repeatOff.show()):(this.css.jq.repeat.show(),this.css.jq.repeatOff.hide()))},_updateInterface:function(){this.css.jq.seekBar.length&&this.css.jq.seekBar.width(this.status.seekPercent+
"%");this.css.jq.playBar.length&&this.css.jq.playBar.width(this.status.currentPercentRelative+"%");this.css.jq.currentTime.length&&this.css.jq.currentTime.text(b.jPlayer.convertTime(this.status.currentTime));this.css.jq.duration.length&&this.css.jq.duration.text(b.jPlayer.convertTime(this.status.duration))},_seeking:function(){this.css.jq.seekBar.length&&this.css.jq.seekBar.addClass("jp-seeking-bg")},_seeked:function(){this.css.jq.seekBar.length&&this.css.jq.seekBar.removeClass("jp-seeking-bg")},
_resetGate:function(){this.html.audio.gate=!1;this.html.video.gate=!1;this.flash.gate=!1},_resetActive:function(){this.html.active=!1;this.flash.active=!1},setMedia:function(a){var c=this,d=!1,e=this.status.media.poster!==a.poster;this._resetMedia();this._resetGate();this._resetActive();b.each(this.formats,function(e,f){var i=c.format[f].media==="video";b.each(c.solutions,function(b,e){if(c[e].support[f]&&c._validString(a[f])){var g=e==="html";i?(g?(c.html.video.gate=!0,c._html_setVideo(a),c.html.active=
!0):(c.flash.gate=!0,c._flash_setVideo(a),c.flash.active=!0),c.css.jq.videoPlay.length&&c.css.jq.videoPlay.show(),c.status.video=!0):(g?(c.html.audio.gate=!0,c._html_setAudio(a),c.html.active=!0):(c.flash.gate=!0,c._flash_setAudio(a),c.flash.active=!0),c.css.jq.videoPlay.length&&c.css.jq.videoPlay.hide(),c.status.video=!1);d=!0;return!1}});if(d)return!1});if(d){if((!this.status.nativeVideoControls||!this.html.video.gate)&&this._validString(a.poster))e?this.htmlElement.poster.src=a.poster:this.internal.poster.jq.show();
this.status.srcSet=!0;this.status.media=b.extend({},a);this._updateButtons(!1);this._updateInterface()}else this._error({type:b.jPlayer.error.NO_SUPPORT,context:"{supplied:'"+this.options.supplied+"'}",message:b.jPlayer.errorMsg.NO_SUPPORT,hint:b.jPlayer.errorHint.NO_SUPPORT})},_resetMedia:function(){this._resetStatus();this._updateButtons(!1);this._updateInterface();this._seeked();this.internal.poster.jq.hide();clearTimeout(this.internal.htmlDlyCmdId);this.html.active?this._html_resetMedia():this.flash.active&&
this._flash_resetMedia()},clearMedia:function(){this._resetMedia();this.html.active?this._html_clearMedia():this.flash.active&&this._flash_clearMedia();this._resetGate();this._resetActive()},load:function(){this.status.srcSet?this.html.active?this._html_load():this.flash.active&&this._flash_load():this._urlNotSetError("load")},play:function(a){a=typeof a==="number"?a:NaN;this.status.srcSet?this.html.active?this._html_play(a):this.flash.active&&this._flash_play(a):this._urlNotSetError("play")},videoPlay:function(){this.play()},
pause:function(a){a=typeof a==="number"?a:NaN;this.status.srcSet?this.html.active?this._html_pause(a):this.flash.active&&this._flash_pause(a):this._urlNotSetError("pause")},pauseOthers:function(){var a=this;b.each(this.instances,function(b,d){a.element!==d&&d.data("jPlayer").status.srcSet&&d.jPlayer("pause")})},stop:function(){this.status.srcSet?this.html.active?this._html_pause(0):this.flash.active&&this._flash_pause(0):this._urlNotSetError("stop")},playHead:function(a){a=this._limitValue(a,0,100);
this.status.srcSet?this.html.active?this._html_playHead(a):this.flash.active&&this._flash_playHead(a):this._urlNotSetError("playHead")},_muted:function(a){this.options.muted=a;this.html.used&&this._html_mute(a);this.flash.used&&this._flash_mute(a);!this.html.video.gate&&!this.html.audio.gate&&(this._updateMute(a),this._updateVolume(this.options.volume),this._trigger(b.jPlayer.event.volumechange))},mute:function(a){a=a===f?!0:!!a;this._muted(a)},unmute:function(a){a=a===f?!0:!!a;this._muted(!a)},_updateMute:function(a){if(a===
f)a=this.options.muted;this.css.jq.mute.length&&this.css.jq.unmute.length&&(this.status.noVolume?(this.css.jq.mute.hide(),this.css.jq.unmute.hide()):a?(this.css.jq.mute.hide(),this.css.jq.unmute.show()):(this.css.jq.mute.show(),this.css.jq.unmute.hide()))},volume:function(a){a=this._limitValue(a,0,1);this.options.volume=a;this.html.used&&this._html_volume(a);this.flash.used&&this._flash_volume(a);!this.html.video.gate&&!this.html.audio.gate&&(this._updateVolume(a),this._trigger(b.jPlayer.event.volumechange))},
volumeBar:function(a){if(this.css.jq.volumeBar.length){var b=this.css.jq.volumeBar.offset(),d=a.pageX-b.left,e=this.css.jq.volumeBar.width(),a=this.css.jq.volumeBar.height()-a.pageY+b.top,b=this.css.jq.volumeBar.height();this.options.verticalVolume?this.volume(a/b):this.volume(d/e)}this.options.muted&&this._muted(!1)},volumeBarValue:function(a){this.volumeBar(a)},_updateVolume:function(a){if(a===f)a=this.options.volume;a=this.options.muted?0:a;this.status.noVolume?(this.css.jq.volumeBar.length&&this.css.jq.volumeBar.hide(),
this.css.jq.volumeBarValue.length&&this.css.jq.volumeBarValue.hide(),this.css.jq.volumeMax.length&&this.css.jq.volumeMax.hide()):(this.css.jq.volumeBar.length&&this.css.jq.volumeBar.show(),this.css.jq.volumeBarValue.length&&(this.css.jq.volumeBarValue.show(),this.css.jq.volumeBarValue[this.options.verticalVolume?"height":"width"](a*100+"%")),this.css.jq.volumeMax.length&&this.css.jq.volumeMax.show())},volumeMax:function(){this.volume(1);this.options.muted&&this._muted(!1)},_cssSelectorAncestor:function(a){var c=
this;this.options.cssSelectorAncestor=a;this._removeUiClass();this.ancestorJq=a?b(a):[];a&&this.ancestorJq.length!==1&&this._warning({type:b.jPlayer.warning.CSS_SELECTOR_COUNT,context:a,message:b.jPlayer.warningMsg.CSS_SELECTOR_COUNT+this.ancestorJq.length+" found for cssSelectorAncestor.",hint:b.jPlayer.warningHint.CSS_SELECTOR_COUNT});this._addUiClass();b.each(this.options.cssSelector,function(a,b){c._cssSelector(a,b)})},_cssSelector:function(a,c){var d=this;typeof c==="string"?b.jPlayer.prototype.options.cssSelector[a]?
(this.css.jq[a]&&this.css.jq[a].length&&this.css.jq[a].unbind(".jPlayer"),this.options.cssSelector[a]=c,this.css.cs[a]=this.options.cssSelectorAncestor+" "+c,this.css.jq[a]=c?b(this.css.cs[a]):[],this.css.jq[a].length&&this.css.jq[a].bind("click.jPlayer",function(c){d[a](c);b(this).blur();return!1}),c&&this.css.jq[a].length!==1&&this._warning({type:b.jPlayer.warning.CSS_SELECTOR_COUNT,context:this.css.cs[a],message:b.jPlayer.warningMsg.CSS_SELECTOR_COUNT+this.css.jq[a].length+" found for "+a+" method.",
hint:b.jPlayer.warningHint.CSS_SELECTOR_COUNT})):this._warning({type:b.jPlayer.warning.CSS_SELECTOR_METHOD,context:a,message:b.jPlayer.warningMsg.CSS_SELECTOR_METHOD,hint:b.jPlayer.warningHint.CSS_SELECTOR_METHOD}):this._warning({type:b.jPlayer.warning.CSS_SELECTOR_STRING,context:c,message:b.jPlayer.warningMsg.CSS_SELECTOR_STRING,hint:b.jPlayer.warningHint.CSS_SELECTOR_STRING})},seekBar:function(a){if(this.css.jq.seekBar){var b=this.css.jq.seekBar.offset(),a=a.pageX-b.left,b=this.css.jq.seekBar.width();
this.playHead(100*a/b)}},playBar:function(a){this.seekBar(a)},repeat:function(){this._loop(!0)},repeatOff:function(){this._loop(!1)},_loop:function(a){if(this.options.loop!==a)this.options.loop=a,this._updateButtons(),this._trigger(b.jPlayer.event.repeat)},currentTime:function(){},duration:function(){},gui:function(){},noSolution:function(){},option:function(a,c){var d=a;if(arguments.length===0)return b.extend(!0,{},this.options);if(typeof a==="string"){var e=a.split(".");if(c===f){for(var d=b.extend(!0,
{},this.options),g=0;g<e.length;g++)if(d[e[g]]!==f)d=d[e[g]];else return this._warning({type:b.jPlayer.warning.OPTION_KEY,context:a,message:b.jPlayer.warningMsg.OPTION_KEY,hint:b.jPlayer.warningHint.OPTION_KEY}),f;return d}for(var g=d={},h=0;h<e.length;h++)h<e.length-1?(g[e[h]]={},g=g[e[h]]):g[e[h]]=c}this._setOptions(d);return this},_setOptions:function(a){var c=this;b.each(a,function(a,b){c._setOption(a,b)});return this},_setOption:function(a,c){var d=this;switch(a){case "volume":this.volume(c);
break;case "muted":this._muted(c);break;case "cssSelectorAncestor":this._cssSelectorAncestor(c);break;case "cssSelector":b.each(c,function(a,b){d._cssSelector(a,b)});break;case "fullScreen":this.options[a]!==c&&(this._removeUiClass(),this.options[a]=c,this._refreshSize());break;case "size":!this.options.fullScreen&&this.options[a].cssClass!==c.cssClass&&this._removeUiClass();this.options[a]=b.extend({},this.options[a],c);this._refreshSize();break;case "sizeFull":this.options.fullScreen&&this.options[a].cssClass!==
c.cssClass&&this._removeUiClass();this.options[a]=b.extend({},this.options[a],c);this._refreshSize();break;case "autohide":this.options[a]=b.extend({},this.options[a],c);this._updateAutohide();break;case "loop":this._loop(c);break;case "nativeVideoControls":this.options[a]=b.extend({},this.options[a],c);this.status.nativeVideoControls=this._uaBlocklist(this.options.nativeVideoControls);this._restrictNativeVideoControls();this._updateNativeVideoControls();break;case "noFullScreen":this.options[a]=
b.extend({},this.options[a],c);this.status.nativeVideoControls=this._uaBlocklist(this.options.nativeVideoControls);this.status.noFullScreen=this._uaBlocklist(this.options.noFullScreen);this._restrictNativeVideoControls();this._updateButtons();break;case "noVolume":this.options[a]=b.extend({},this.options[a],c);this.status.noVolume=this._uaBlocklist(this.options.noVolume);this._updateVolume();this._updateMute();break;case "emulateHtml":this.options[a]!==c&&((this.options[a]=c)?this._emulateHtmlBridge():
this._destroyHtmlBridge())}return this},_refreshSize:function(){this._setSize();this._addUiClass();this._updateSize();this._updateButtons();this._updateAutohide();this._trigger(b.jPlayer.event.resize)},_setSize:function(){this.options.fullScreen?(this.status.width=this.options.sizeFull.width,this.status.height=this.options.sizeFull.height,this.status.cssClass=this.options.sizeFull.cssClass):(this.status.width=this.options.size.width,this.status.height=this.options.size.height,this.status.cssClass=
this.options.size.cssClass);this.element.css({width:this.status.width,height:this.status.height})},_addUiClass:function(){this.ancestorJq.length&&this.ancestorJq.addClass(this.status.cssClass)},_removeUiClass:function(){this.ancestorJq.length&&this.ancestorJq.removeClass(this.status.cssClass)},_updateSize:function(){this.internal.poster.jq.css({width:this.status.width,height:this.status.height});!this.status.waitForPlay&&this.html.active&&this.status.video||this.html.video.available&&this.html.used&&
this.status.nativeVideoControls?this.internal.video.jq.css({width:this.status.width,height:this.status.height}):!this.status.waitForPlay&&this.flash.active&&this.status.video&&this.internal.flash.jq.css({width:this.status.width,height:this.status.height})},_updateAutohide:function(){var a=this,b=function(){a.css.jq.gui.fadeIn(a.options.autohide.fadeIn,function(){clearTimeout(a.internal.autohideId);a.internal.autohideId=setTimeout(function(){a.css.jq.gui.fadeOut(a.options.autohide.fadeOut)},a.options.autohide.hold)})};
this.css.jq.gui.length&&(this.css.jq.gui.stop(!0,!0),clearTimeout(this.internal.autohideId),this.element.unbind(".jPlayerAutohide"),this.css.jq.gui.unbind(".jPlayerAutohide"),this.status.nativeVideoControls?this.css.jq.gui.hide():this.options.fullScreen&&this.options.autohide.full||!this.options.fullScreen&&this.options.autohide.restored?(this.element.bind("mousemove.jPlayer.jPlayerAutohide",b),this.css.jq.gui.bind("mousemove.jPlayer.jPlayerAutohide",b),this.css.jq.gui.hide()):this.css.jq.gui.show())},
fullScreen:function(){this._setOption("fullScreen",!0)},restoreScreen:function(){this._setOption("fullScreen",!1)},_html_initMedia:function(){this.htmlElement.media.src=this.status.src;this.options.preload!=="none"&&this._html_load();this._trigger(b.jPlayer.event.timeupdate)},_html_setAudio:function(a){var c=this;b.each(this.formats,function(b,e){if(c.html.support[e]&&a[e])return c.status.src=a[e],c.status.format[e]=!0,c.status.formatType=e,!1});this.htmlElement.media=this.htmlElement.audio;this._html_initMedia()},
_html_setVideo:function(a){var c=this;b.each(this.formats,function(b,e){if(c.html.support[e]&&a[e])return c.status.src=a[e],c.status.format[e]=!0,c.status.formatType=e,!1});if(this.status.nativeVideoControls)this.htmlElement.video.poster=this._validString(a.poster)?a.poster:"";this.htmlElement.media=this.htmlElement.video;this._html_initMedia()},_html_resetMedia:function(){this.htmlElement.media&&(this.htmlElement.media.id===this.internal.video.id&&!this.status.nativeVideoControls&&this.internal.video.jq.css({width:"0px",
height:"0px"}),this.htmlElement.media.pause())},_html_clearMedia:function(){if(this.htmlElement.media)this.htmlElement.media.src="",this.htmlElement.media.load()},_html_load:function(){if(this.status.waitForLoad)this.status.waitForLoad=!1,this.htmlElement.media.load();clearTimeout(this.internal.htmlDlyCmdId)},_html_play:function(a){var b=this;this._html_load();this.htmlElement.media.play();if(!isNaN(a))try{this.htmlElement.media.currentTime=a}catch(d){this.internal.htmlDlyCmdId=setTimeout(function(){b.play(a)},
100);return}this._html_checkWaitForPlay()},_html_pause:function(a){var b=this;a>0?this._html_load():clearTimeout(this.internal.htmlDlyCmdId);this.htmlElement.media.pause();if(!isNaN(a))try{this.htmlElement.media.currentTime=a}catch(d){this.internal.htmlDlyCmdId=setTimeout(function(){b.pause(a)},100);return}a>0&&this._html_checkWaitForPlay()},_html_playHead:function(a){var b=this;this._html_load();try{if(typeof this.htmlElement.media.seekable==="object"&&this.htmlElement.media.seekable.length>0)this.htmlElement.media.currentTime=
a*this.htmlElement.media.seekable.end(this.htmlElement.media.seekable.length-1)/100;else if(this.htmlElement.media.duration>0&&!isNaN(this.htmlElement.media.duration))this.htmlElement.media.currentTime=a*this.htmlElement.media.duration/100;else throw"e";}catch(d){this.internal.htmlDlyCmdId=setTimeout(function(){b.playHead(a)},100);return}this.status.waitForLoad||this._html_checkWaitForPlay()},_html_checkWaitForPlay:function(){if(this.status.waitForPlay)this.status.waitForPlay=!1,this.css.jq.videoPlay.length&&
this.css.jq.videoPlay.hide(),this.status.video&&(this.internal.poster.jq.hide(),this.internal.video.jq.css({width:this.status.width,height:this.status.height}))},_html_volume:function(a){if(this.html.audio.available)this.htmlElement.audio.volume=a;if(this.html.video.available)this.htmlElement.video.volume=a},_html_mute:function(a){if(this.html.audio.available)this.htmlElement.audio.muted=a;if(this.html.video.available)this.htmlElement.video.muted=a},_flash_setAudio:function(a){var c=this;try{if(b.each(this.formats,
function(b,d){if(c.flash.support[d]&&a[d]){switch(d){case "m4a":case "fla":c._getMovie().fl_setAudio_m4a(a[d]);break;case "mp3":c._getMovie().fl_setAudio_mp3(a[d])}c.status.src=a[d];c.status.format[d]=!0;c.status.formatType=d;return!1}}),this.options.preload==="auto")this._flash_load(),this.status.waitForLoad=!1}catch(d){this._flashError(d)}},_flash_setVideo:function(a){var c=this;try{if(b.each(this.formats,function(b,d){if(c.flash.support[d]&&a[d]){switch(d){case "m4v":case "flv":c._getMovie().fl_setVideo_m4v(a[d])}c.status.src=
a[d];c.status.format[d]=!0;c.status.formatType=d;return!1}}),this.options.preload==="auto")this._flash_load(),this.status.waitForLoad=!1}catch(d){this._flashError(d)}},_flash_resetMedia:function(){this.internal.flash.jq.css({width:"0px",height:"0px"});this._flash_pause(NaN)},_flash_clearMedia:function(){try{this._getMovie().fl_clearMedia()}catch(a){this._flashError(a)}},_flash_load:function(){try{this._getMovie().fl_load()}catch(a){this._flashError(a)}this.status.waitForLoad=!1},_flash_play:function(a){try{this._getMovie().fl_play(a)}catch(b){this._flashError(b)}this.status.waitForLoad=
!1;this._flash_checkWaitForPlay()},_flash_pause:function(a){try{this._getMovie().fl_pause(a)}catch(b){this._flashError(b)}if(a>0)this.status.waitForLoad=!1,this._flash_checkWaitForPlay()},_flash_playHead:function(a){try{this._getMovie().fl_play_head(a)}catch(b){this._flashError(b)}this.status.waitForLoad||this._flash_checkWaitForPlay()},_flash_checkWaitForPlay:function(){if(this.status.waitForPlay)this.status.waitForPlay=!1,this.css.jq.videoPlay.length&&this.css.jq.videoPlay.hide(),this.status.video&&
(this.internal.poster.jq.hide(),this.internal.flash.jq.css({width:this.status.width,height:this.status.height}))},_flash_volume:function(a){try{this._getMovie().fl_volume(a)}catch(b){this._flashError(b)}},_flash_mute:function(a){try{this._getMovie().fl_mute(a)}catch(b){this._flashError(b)}},_getMovie:function(){return document[this.internal.flash.id]},_checkForFlash:function(a){var b=!1,d;if(window.ActiveXObject)try{new ActiveXObject("ShockwaveFlash.ShockwaveFlash."+a),b=!0}catch(e){}else navigator.plugins&&
navigator.mimeTypes.length>0&&(d=navigator.plugins["Shockwave Flash"])&&navigator.plugins["Shockwave Flash"].description.replace(/.*\s(\d+\.\d+).*/,"$1")>=a&&(b=!0);return b},_validString:function(a){return a&&typeof a==="string"},_limitValue:function(a,b,d){return a<b?b:a>d?d:a},_urlNotSetError:function(a){this._error({type:b.jPlayer.error.URL_NOT_SET,context:a,message:b.jPlayer.errorMsg.URL_NOT_SET,hint:b.jPlayer.errorHint.URL_NOT_SET})},_flashError:function(a){var c;c=this.internal.ready?"FLASH_DISABLED":
"FLASH";this._error({type:b.jPlayer.error[c],context:this.internal.flash.swf,message:b.jPlayer.errorMsg[c]+a.message,hint:b.jPlayer.errorHint[c]});this.internal.flash.jq.css({width:"1px",height:"1px"})},_error:function(a){this._trigger(b.jPlayer.event.error,a);this.options.errorAlerts&&this._alert("Error!"+(a.message?"\n\n"+a.message:"")+(a.hint?"\n\n"+a.hint:"")+"\n\nContext: "+a.context)},_warning:function(a){this._trigger(b.jPlayer.event.warning,f,a);this.options.warningAlerts&&this._alert("Warning!"+
(a.message?"\n\n"+a.message:"")+(a.hint?"\n\n"+a.hint:"")+"\n\nContext: "+a.context)},_alert:function(a){alert("jPlayer "+this.version.script+" : id='"+this.internal.self.id+"' : "+a)},_emulateHtmlBridge:function(){var a=this;b.each(b.jPlayer.emulateMethods.split(/\s+/g),function(b,d){a.internal.domNode[d]=function(b){a[d](b)}});b.each(b.jPlayer.event,function(c,d){var e=!0;b.each(b.jPlayer.reservedEvent.split(/\s+/g),function(a,b){if(b===c)return e=!1});e&&a.element.bind(d+".jPlayer.jPlayerHtml",
function(){a._emulateHtmlUpdate();var b=document.createEvent("Event");b.initEvent(c,!1,!0);a.internal.domNode.dispatchEvent(b)})})},_emulateHtmlUpdate:function(){var a=this;b.each(b.jPlayer.emulateStatus.split(/\s+/g),function(b,d){a.internal.domNode[d]=a.status[d]});b.each(b.jPlayer.emulateOptions.split(/\s+/g),function(b,d){a.internal.domNode[d]=a.options[d]})},_destroyHtmlBridge:function(){var a=this;this.element.unbind(".jPlayerHtml");b.each((b.jPlayer.emulateMethods+" "+b.jPlayer.emulateStatus+
" "+b.jPlayer.emulateOptions).split(/\s+/g),function(b,d){delete a.internal.domNode[d]})}};b.jPlayer.error={FLASH:"e_flash",FLASH_DISABLED:"e_flash_disabled",NO_SOLUTION:"e_no_solution",NO_SUPPORT:"e_no_support",URL:"e_url",URL_NOT_SET:"e_url_not_set",VERSION:"e_version"};b.jPlayer.errorMsg={FLASH:"jPlayer's Flash fallback is not configured correctly, or a command was issued before the jPlayer Ready event. Details: ",FLASH_DISABLED:"jPlayer's Flash fallback has been disabled by the browser due to the CSS rules you have used. Details: ",
NO_SOLUTION:"No solution can be found by jPlayer in this browser. Neither HTML nor Flash can be used.",NO_SUPPORT:"It is not possible to play any media format provided in setMedia() on this browser using your current options.",URL:"Media URL could not be loaded.",URL_NOT_SET:"Attempt to issue media playback commands, while no media url is set.",VERSION:"jPlayer "+b.jPlayer.prototype.version.script+" needs Jplayer.swf version "+b.jPlayer.prototype.version.needFlash+" but found "};b.jPlayer.errorHint=
{FLASH:"Check your swfPath option and that Jplayer.swf is there.",FLASH_DISABLED:"Check that you have not display:none; the jPlayer entity or any ancestor.",NO_SOLUTION:"Review the jPlayer options: support and supplied.",NO_SUPPORT:"Video or audio formats defined in the supplied option are missing.",URL:"Check media URL is valid.",URL_NOT_SET:"Use setMedia() to set the media URL.",VERSION:"Update jPlayer files."};b.jPlayer.warning={CSS_SELECTOR_COUNT:"e_css_selector_count",CSS_SELECTOR_METHOD:"e_css_selector_method",
CSS_SELECTOR_STRING:"e_css_selector_string",OPTION_KEY:"e_option_key"};b.jPlayer.warningMsg={CSS_SELECTOR_COUNT:"The number of css selectors found did not equal one: ",CSS_SELECTOR_METHOD:"The methodName given in jPlayer('cssSelector') is not a valid jPlayer method.",CSS_SELECTOR_STRING:"The methodCssSelector given in jPlayer('cssSelector') is not a String or is empty.",OPTION_KEY:"The option requested in jPlayer('option') is undefined."};b.jPlayer.warningHint={CSS_SELECTOR_COUNT:"Check your css selector and the ancestor.",
CSS_SELECTOR_METHOD:"Check your method name.",CSS_SELECTOR_STRING:"Check your css selector is a string.",OPTION_KEY:"Check your option name."}})(jQuery);

// moment.js
// version : 1.6.1
// author : Tim Wood
// license : MIT
// momentjs.com
(function(a,b){function D(a,b){this._d=a,this._isUTC=!!b}function E(a){return a<0?Math.ceil(a):Math.floor(a)}function F(a){var b=this._data={},c=a.years||a.y||0,d=a.months||a.M||0,e=a.weeks||a.w||0,f=a.days||a.d||0,g=a.hours||a.h||0,h=a.minutes||a.m||0,i=a.seconds||a.s||0,j=a.milliseconds||a.ms||0;this._milliseconds=j+i*1e3+h*6e4+g*36e5,this._days=f+e*7,this._months=d+c*12,b.milliseconds=j%1e3,i+=E(j/1e3),b.seconds=i%60,h+=E(i/60),b.minutes=h%60,g+=E(h/60),b.hours=g%24,f+=E(g/24),f+=e*7,b.days=f%30,d+=E(f/30),b.months=d%12,c+=E(d/12),b.years=c}function G(a,b){var c=a+"";while(c.length<b)c="0"+c;return c}function H(a,b,c){var d=b._milliseconds,e=b._days,f=b._months,g;d&&a._d.setTime(+a+d*c),e&&a.date(a.date()+e*c),f&&(g=a.date(),a.date(1).month(a.month()+f*c).date(Math.min(g,a.daysInMonth())))}function I(a){return Object.prototype.toString.call(a)==="[object Array]"}function J(b){return new a(b[0],b[1]||0,b[2]||1,b[3]||0,b[4]||0,b[5]||0,b[6]||0)}function K(b,d){function q(d){var l,r;switch(d){case"M":return e+1;case"Mo":return e+1+o(e+1);case"MM":return G(e+1,2);case"MMM":return c.monthsShort[e];case"MMMM":return c.months[e];case"D":return f;case"Do":return f+o(f);case"DD":return G(f,2);case"DDD":return l=new a(g,e,f),r=new a(g,0,1),~~((l-r)/864e5+1.5);case"DDDo":return l=q("DDD"),l+o(l);case"DDDD":return G(q("DDD"),3);case"d":return h;case"do":return h+o(h);case"ddd":return c.weekdaysShort[h];case"dddd":return c.weekdays[h];case"w":return l=new a(g,e,f-h+5),r=new a(l.getFullYear(),0,4),~~((l-r)/864e5/7+1.5);case"wo":return l=q("w"),l+o(l);case"ww":return G(q("w"),2);case"YY":return G(g%100,2);case"YYYY":return g;case"a":return p?p(i,j,!1):i>11?"pm":"am";case"A":return p?p(i,j,!0):i>11?"PM":"AM";case"H":return i;case"HH":return G(i,2);case"h":return i%12||12;case"hh":return G(i%12||12,2);case"m":return j;case"mm":return G(j,2);case"s":return k;case"ss":return G(k,2);case"S":return~~(m/100);case"SS":return G(~~(m/10),2);case"SSS":return G(m,3);case"Z":return(n<0?"-":"+")+G(~~(Math.abs(n)/60),2)+":"+G(~~(Math.abs(n)%60),2);case"ZZ":return(n<0?"-":"+")+G(~~(10*Math.abs(n)/6),4);case"L":case"LL":case"LLL":case"LLLL":case"LT":return K(b,c.longDateFormat[d]);default:return d.replace(/(^\[)|(\\)|\]$/g,"")}}var e=b.month(),f=b.date(),g=b.year(),h=b.day(),i=b.hours(),j=b.minutes(),k=b.seconds(),m=b.milliseconds(),n=-b.zone(),o=c.ordinal,p=c.meridiem;return d.replace(l,q)}function L(a){switch(a){case"S":return n;case"SS":return q;case"SSS":case"DDDD":return r;case"YYYY":return s;case"DDD":return p;case"MMM":case"MMMM":case"ddd":case"dddd":case"a":case"A":return t;case"Z":case"ZZ":return u;case"T":return v;case"MM":case"DD":case"dd":case"YY":case"HH":case"hh":case"mm":case"ss":case"M":case"D":case"d":case"H":case"h":case"m":case"s":return o;default:return new RegExp(a.replace("\\",""))}}function M(a,b,d,e){var f;switch(a){case"M":case"MM":d[1]=~~b-1;break;case"MMM":case"MMMM":for(f=0;f<12;f++)if(c.monthsParse[f].test(b)){d[1]=f;break}break;case"D":case"DD":case"DDD":case"DDDD":d[2]=~~b;break;case"YY":b=~~b,d[0]=b+(b>70?1900:2e3);break;case"YYYY":d[0]=~~Math.abs(b);break;case"a":case"A":e.isPm=b.toLowerCase()==="pm";break;case"H":case"HH":case"h":case"hh":d[3]=~~b;break;case"m":case"mm":d[4]=~~b;break;case"s":case"ss":d[5]=~~b;break;case"S":d[6]=~~b*100;break;case"SS":d[6]=~~b*10;break;case"SSS":d[6]=~~b;break;case"Z":case"ZZ":e.isUTC=!0,f=(b+"").match(z),f&&f[1]&&(e.tzh=~~f[1]),f&&f[2]&&(e.tzm=~~f[2]),f&&f[0]==="+"&&(e.tzh=-e.tzh,e.tzm=-e.tzm)}}function N(b,c){var d=[0,0,1,0,0,0,0],e={tzh:0,tzm:0},f=c.match(l),g,h;for(g=0;g<f.length;g++)h=(L(f[g]).exec(b)||[0])[0],b=b.replace(L(f[g]),""),M(f[g],h,d,e);return e.isPm&&d[3]<12&&(d[3]+=12),e.isPm===!1&&d[3]===12&&(d[3]=0),d[3]+=e.tzh,d[4]+=e.tzm,e.isUTC?new a(a.UTC.apply({},d)):J(d)}function O(a,b){var c=Math.min(a.length,b.length),d=Math.abs(a.length-b.length),e=0,f;for(f=0;f<c;f++)~~a[f]!==~~b[f]&&e++;return e+d}function P(a,b){var c,d=a.match(m),e,f=99,g,h,i;for(g=0;g<b.length;g++)h=N(a,b[g]),e=K(new D(h),b[g]).match(m),i=O(d,e),i<f&&(f=i,c=h);return c}function Q(b){var c="YYYY-MM-DDT",d;if(w.exec(b)){for(d=0;d<3;d++)if(y[d][1].exec(b)){c+=y[d][0];break}return u.exec(b)?N(b,c+" Z"):N(b,c)}return new a(b)}function R(a,b,d,e){var f=c.relativeTime[a];return typeof f=="function"?f(b||1,!!d,a,e):f.replace(/%d/i,b||1)}function S(a,b){var c=e(Math.abs(a)/1e3),d=e(c/60),f=e(d/60),g=e(f/24),h=e(g/365),i=c<45&&["s",c]||d===1&&["m"]||d<45&&["mm",d]||f===1&&["h"]||f<22&&["hh",f]||g===1&&["d"]||g<=25&&["dd",g]||g<=45&&["M"]||g<345&&["MM",e(g/30)]||h===1&&["y"]||["yy",h];return i[2]=b,i[3]=a>0,R.apply({},i)}function T(a,b){c.fn[a]=function(a){var c=this._isUTC?"UTC":"";return a!=null?(this._d["set"+c+b](a),this):this._d["get"+c+b]()}}function U(a){c.duration.fn[a]=function(){return this._data[a]}}function V(a,b){c.duration.fn["as"+a]=function(){return+this/b}}var c,d="1.6.1",e=Math.round,f,g={},h="en",i=typeof module!="undefined",j="months|monthsShort|monthsParse|weekdays|weekdaysShort|longDateFormat|calendar|relativeTime|ordinal|meridiem".split("|"),k=/^\/?Date\((\-?\d+)/i,l=/(\[[^\[]*\])|(\\)?(Mo|MM?M?M?|Do|DDDo|DD?D?D?|dddd?|do?|w[o|w]?|YYYY|YY|a|A|hh?|HH?|mm?|ss?|SS?S?|zz?|ZZ?|LT|LL?L?L?)/g,m=/([0-9a-zA-Z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)/gi,n=/\d/,o=/\d\d?/,p=/\d{1,3}/,q=/\d\d/,r=/\d{3}/,s=/\d{4}/,t=/[0-9a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+/i,u=/[\+\-]\d\d:?\d\d/i,v=/T/i,w=/^\s*\d{4}-\d\d-\d\d(T(\d\d(:\d\d(:\d\d)?)?)?([\+\-]\d\d:?\d\d)?)?/,x="YYYY-MM-DDTHH:mm:ssZ",y=[["HH:mm:ss",/T\d\d:\d\d:\d\d/],["HH:mm",/T\d\d:\d\d/],["HH",/T\d\d/]],z=/([\+\-]|\d\d)/gi,A="Month|Date|Hours|Minutes|Seconds|Milliseconds".split("|"),B="years|months|days|hours|minutes|seconds|milliseconds".split("|"),C={Milliseconds:1,Seconds:1e3,Minutes:6e4,Hours:36e5,Days:864e5,Weeks:6048e5,Months:2592e6,Years:31536e6};c=function(d,e){if(d===null||d==="")return null;var f,g,h;return c.isMoment(d)?(f=new a(+d._d),h=d._isUTC):e?I(e)?f=P(d,e):f=N(d,e):(g=k.exec(d),f=d===b?new a:g?new a(+g[1]):d instanceof a?d:I(d)?J(d):typeof d=="string"?Q(d):new a(d)),new D(f,h)},c.utc=function(b,d){return I(b)?new D(new a(a.UTC.apply({},b)),!0):d&&b?c(b+" +0000",d+" Z").utc():c(u.exec(b)?b:b+"+0000").utc()},c.unix=function(a){return c(a*1e3)},c.duration=function(a,b){var d=c.isDuration(a),e=typeof a=="number",f=d?a._data:e?{}:a;return e&&(b?f[b]=a:f.milliseconds=a),new F(f)},c.humanizeDuration=function(a,b,d){return c.duration(a,b).humanize(d)},c.version=d,c.defaultFormat=x,c.lang=function(a,b){var d,e,f=[];if(!a)return h;if(b){for(d=0;d<12;d++)f[d]=new RegExp("^"+b.months[d]+"|^"+b.monthsShort[d].replace(".",""),"i");b.monthsParse=b.monthsParse||f,g[a]=b}if(g[a]){for(d=0;d<j.length;d++)c[j[d]]=g[a][j[d]]||g.en[j[d]];h=a}else i&&(e=require("./lang/"+a),c.lang(a,e))},c.lang("en",{months:"January_February_March_April_May_June_July_August_September_October_November_December".split("_"),monthsShort:"Jan_Feb_Mar_Apr_May_Jun_Jul_Aug_Sep_Oct_Nov_Dec".split("_"),weekdays:"Sunday_Monday_Tuesday_Wednesday_Thursday_Friday_Saturday".split("_"),weekdaysShort:"Sun_Mon_Tue_Wed_Thu_Fri_Sat".split("_"),longDateFormat:{LT:"h:mm A",L:"MM/DD/YYYY",LL:"MMMM D YYYY",LLL:"MMMM D YYYY LT",LLLL:"dddd, MMMM D YYYY LT"},meridiem:!1,calendar:{sameDay:"[Today at] LT",nextDay:"[Tomorrow at] LT",nextWeek:"dddd [at] LT",lastDay:"[Yesterday at] LT",lastWeek:"[last] dddd [at] LT",sameElse:"L"},relativeTime:{future:"in %s",past:"%s ago",s:"a few seconds",m:"a minute",mm:"%d minutes",h:"an hour",hh:"%d hours",d:"a day",dd:"%d days",M:"a month",MM:"%d months",y:"a year",yy:"%d years"},ordinal:function(a){var b=a%10;return~~(a%100/10)===1?"th":b===1?"st":b===2?"nd":b===3?"rd":"th"}}),c.isMoment=function(a){return a instanceof D},c.isDuration=function(a){return a instanceof F},c.fn=D.prototype={clone:function(){return c(this)},valueOf:function(){return+this._d},unix:function(){return Math.floor(+this._d/1e3)},toString:function(){return this._d.toString()},toDate:function(){return this._d},utc:function(){return this._isUTC=!0,this},local:function(){return this._isUTC=!1,this},format:function(a){return K(this,a?a:c.defaultFormat)},add:function(a,b){var d=b?c.duration(+b,a):c.duration(a);return H(this,d,1),this},subtract:function(a,b){var d=b?c.duration(+b,a):c.duration(a);return H(this,d,-1),this},diff:function(a,b,d){var f=this._isUTC?c(a).utc():c(a).local(),g=(this.zone()-f.zone())*6e4,h=this._d-f._d-g,i=this.year()-f.year(),j=this.month()-f.month(),k=this.date()-f.date(),l;return b==="months"?l=i*12+j+k/30:b==="years"?l=i+(j+k/30)/12:l=b==="seconds"?h/1e3:b==="minutes"?h/6e4:b==="hours"?h/36e5:b==="days"?h/864e5:b==="weeks"?h/6048e5:h,d?l:e(l)},from:function(a,b){return c.duration(this.diff(a)).humanize(!b)},fromNow:function(a){return this.from(c(),a)},calendar:function(){var a=this.diff(c().sod(),"days",!0),b=c.calendar,d=b.sameElse,e=a<-6?d:a<-1?b.lastWeek:a<0?b.lastDay:a<1?b.sameDay:a<2?b.nextDay:a<7?b.nextWeek:d;return this.format(typeof e=="function"?e.apply(this):e)},isLeapYear:function(){var a=this.year();return a%4===0&&a%100!==0||a%400===0},isDST:function(){return this.zone()<c([this.year()]).zone()||this.zone()<c([this.year(),5]).zone()},day:function(a){var b=this._isUTC?this._d.getUTCDay():this._d.getDay();return a==null?b:this.add({d:a-b})},sod:function(){return this.clone().hours(0).minutes(0).seconds(0).milliseconds(0)},eod:function(){return this.sod().add({d:1,ms:-1})},zone:function(){return this._isUTC?0:this._d.getTimezoneOffset()},daysInMonth:function(){return this.clone().month(this.month()+1).date(0).date()}};for(f=0;f<A.length;f++)T(A[f].toLowerCase(),A[f]);T("year","FullYear"),c.duration.fn=F.prototype={weeks:function(){return E(this.days()/7)},valueOf:function(){return this._milliseconds+this._days*864e5+this._months*2592e6},humanize:function(a){var b=+this,d=c.relativeTime,e=S(b,!a);return a&&(e=(b<=0?d.past:d.future).replace(/%s/i,e)),e}};for(f=0;f<B.length;f++)U(B[f]);for(f in C)C.hasOwnProperty(f)&&V(f,C[f]);i&&(module.exports=c),typeof window!="undefined"&&typeof ender=="undefined"&&(window.moment=c),typeof define=="function"&&define.amd&&define("moment",[],function(){return c})})(Date);