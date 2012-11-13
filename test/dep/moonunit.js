/*=es6now=*/(function(fn, deps) { if (typeof exports !== 'undefined') fn.call(typeof global === 'object' ? global : this, require, exports); else if (typeof MODULE === 'function') MODULE(fn, deps); else if (typeof define === 'function' && define.amd) define(['require', 'exports'].concat(deps), fn); else if (typeof window !== 'undefined' && "") fn.call(window, null, window[""] = {}); else fn.call(window || this, null, {}); })(function(require, exports) { 

var __modules = [], __exports = [], __global = this, __undef; 

function __require(i, obj) { 
  var e = __exports[i]; 
  
  if (e !== __undef) 
    return e; 
  
  __modules[i].call(__global, __exports[i] = (obj || {})); 
  
  if (e !== __undef) 
    __exports[i] = e; 
  
  return __exports[i]; 
} 

__modules[0] = function(exports) {
"use strict";

var Runner = __require(1).Runner;
var Logger = __require(5).Logger;

function run(tests) {

    return new Runner().run(tests);
}


exports.run = run;
exports.Runner = Runner;
};

__modules[1] = function(exports) {
var __this = this; "use strict";

var _M0 = __require(2), defer = _M0.defer, when = _M0.when;
var Test = __require(4).Test;
var Logger = __require(5).Logger;

var Runner = es6now.Class(null, function(__super) { return {

    constructor: function() {
    
        this.logger = new Logger;
        this.injections = {};
    },
    
    inject: function(obj) { var __this = this; 
    
        Object.keys(obj || {}).forEach((function(k) { "use strict"; return __this.injections[k] = obj[k]; }));
        return this;
    },
    
    run: function(tests) { var __this = this; 
    
        this.logger.clear();
        
        return this._visit(tests).then((function(val) { "use strict";
        
            __this.logger.end();
            return __this;
        }));
    },
    
    _exec: function(node, key) { var __this = this; 
    
        var test = new Test((function(data) { "use strict"; __this.logger.log(data); })),
            async = defer();
        
        // Inject dependencies into test object
        Object.keys(this.injections).forEach((function(k) { "use strict";
        
            if (test[k] === void 0)
                test[k] = __this.injections[k];
        }));
        
        test.name(key);
        
        return when(null, (function(val) { "use strict";
        
            if (node[key].length < 2) {
            
                node[key](test);
                async.resolve(null);
                
            } else {
            
                node[key](test, async.resolve);
            }
            
            return async.promise;
        }));
    },
    
    _visit: function(node) { var __this = this; 
        
        return Object.keys(node).reduce((function(prev, k) { "use strict"; return prev.then((function(val) { "use strict";
            
            if (typeof node[k] === "function") {
        
                return __this._exec(node, k);
            
            } else {
            
                __this.logger.pushGroup(k);
                return __this._visit(node[k]).then((function(val) { "use strict"; return __this.logger.popGroup(); }));
            }
            
        })); }), when()).then((function(val) { "use strict"; return __this; }));
    }
}});

exports.Runner = Runner;
};

__modules[2] = function(exports) {
var _M0 = __require(3); Object.keys(_M0).forEach(function(k) { exports[k] = _M0[k]; });
};

__modules[3] = function(exports) {
var __this = this; "use strict";

var identity = (function(obj) { "use strict"; return obj; }),
	freeze = Object.freeze || identity,
	queue = [],
	timer = 0,
	uid = 0,
	enqueue,
	undefined;

// UUID property names used for duck-typing
var ON_COMPLETE = "07b06b7e-3880-42b1-ad55-e68a77514eb9",
	IS_REJECTION = "7d24bf0f-d8b1-4783-b594-cec32313f6bc";

var EMPTY_LIST_MSG = "List cannot be empty.",
    CYCLE_MSG = "A promise cycle was detected.";

var THROW_DELAY = 50;

// Returns a new promise identifier
function newID() { return uid++; }

// Enqueues a message
function dispatch(promise, args) {

	queue.push({ promise: promise, args: args });
	timer = timer || enqueue(flush);
}

// Flushes the message queue
function flush() {

	var msg, count;
	
	timer = 0;

	// Send each message in queue
	for (count = queue.length; count > 0; --count) {
	
		msg = queue.shift();
		msg.promise[ON_COMPLETE].apply(undefined, msg.args);
	}
}

// Returns a cycle error rejection
function cycleError() {

	return rejection(CYCLE_MSG);
}

// Promise constructor
function Promise(onComplete, isRejection) { var __this = this; 
	
	this[ON_COMPLETE] = onComplete;
	this[IS_REJECTION] = !!isRejection;
	this.then = (function(fn) { "use strict"; return when(__this, fn); });
	
	freeze(this);
}

// Begins a deferred operation
function defer(onQueue) {

	var id = newID(),
		pending = [],
		throwable = true,
		resolved = null,
		promise;

	promise = new Promise((function(success, error, src) { "use strict";
	
		var msg = [success, error, src || id];
		
		if (error && throwable)
			throwable = false;
		
		if (pending) {
		
			pending.push(msg);
			
			if (onQueue)
				onQueue(success, error);
		
		} else {
		
			// If a cycle is detected, convert resolution to a rejection
			if (src === id) {
			
				resolved = cycleError();
				maybeThrow();
			}
			
			dispatch(resolved, msg);
		}
	}));
	
	return {
		promise: promise,
		resolve: resolve,
		reject: reject
	};
	
	// Resolves the promise
	function resolve(value) {
	
		var i, list;
	
		if (!pending)
			return;
		
		list = pending;
		pending = false;
		
		// Create promise from the resolved value
		resolved = toPromise(value);

		// Send internally queued messages to the resolved value
		for (i = 0; i < list.length; ++i)
			dispatch(resolved, list[i]);
		
		maybeThrow();
	}
	
	// Resolves the promise with a rejection
	function reject(error) {
	
		resolve(rejection(error));
	}
	
	// Throws an error if the promise is rejected and there
	// are no error handlers
	function maybeThrow() {
	
		if (!throwable || !isRejection(resolved))
			return;
		
		setTimeout((function() { "use strict";
		
			var error = null;
			
			// Get the error value
			resolved[ON_COMPLETE](null, (function(val) { "use strict"; error = val }));
			
			// Throw it
			if (error && throwable)
				throw error;
			
		}), THROW_DELAY);
	}
}

// Returns true if an object is a promise
function isPromise(obj) {

	return obj && obj[ON_COMPLETE];
}

// Returns true if a promise is a rejection
function isRejection(obj) {

	return obj && obj[IS_REJECTION] === true;
}

// Converts an object to a promise
function toPromise(obj) {

	if (isPromise(obj))
		return obj;
	
	// If object is tagged as a rejection, then interpret as a rejection
	if (isRejection(obj))
	    return rejection(obj);
	
	// Wrap a value in a self-resolving promise
	return new Promise((function(success) { "use strict"; success && success(obj) }));
}

// Creates a rejection Promise
function rejection(value) {

	// Convert falsey values to empty string
	value = value || "";
	
	// Convert strings to Error instances
	if (typeof value === "string")
		value = new Error(value);
	
	// Tag the value as a rejection so that it can be returned
	// from an error handler
	value[IS_REJECTION] = true;
	
	return new Promise((function(success, error) { "use strict"; error && error(value) }), true);
}

// Registers a callback for completion when a promise is resolved
function when(obj, onComplete) {

	var done = false, 
		d = defer(onQueue),
		f = toPromise(obj),
		onError = null;
	
	var resolve = (function(value) { "use strict"; finish(value, onComplete) }),
		reject = (function(value) { "use strict"; finish(value, onError) });

	// Set default transform
	onComplete = onComplete || identity;
	
	// Wrap error handling transform
	if (onComplete.length > 1)
		onError = (function(value) { "use strict"; return onComplete(undefined, value); });
	
	onQueue(onComplete, onError);
	
	return d.promise;
	
	function onQueue(success, error) {
	
		if (success && resolve) {
		
			dispatch(f, [ resolve, null ]);
			resolve = null;
		}
		
		if (error && reject) {
		
			dispatch(f, [ null, reject ]);
			reject = null;
		}
	}
	
	function finish(value, transform) {
	
		if (done) return;
		done = true;
		
		try { d.resolve((transform || rejection)(value)); }
		catch (ex) { d.reject(ex); }
	}
}

// Returns a promise for every resolved value in an array
function whenAll(list, onComplete) {

	var count = list.length,
		d = defer(),
		out = [],
		i;
	
	for (i = 0; i < list.length; ++i)
		waitFor(list[i], i);
	
	if (count === 0)
		d.resolve(out);
	
	return when(d.promise, onComplete);
	
	function waitFor(p, index) {
	
		when(p, (function(val, err) { "use strict";
		
			if (err) d.reject(err);
			else out[index] = val;
			
			if (--count === 0)
				d.resolve(out);
		}));
	}
}

// Returns a promise for the first resolved value in an array
function whenAny(list, onComplete) {

    if (list.length === 0)
		throw new Error(EMPTY_LIST_MSG);
	
	var d = defer(), i;
	
	for (i = 0; i < list.length; ++i)
		waitFor(list[i]);
	
	return when(d.promise, onComplete);
	
	function waitFor(p) {
	
		when(p, (function(val, err) { "use strict";
		
			if (err) d.reject(err);
			else d.resolve(val);
		}));
	}
}

// Begins a sequence of asynchronous operations
function begin(fn) { return when(null, fn); }


// === Event Loop API ===

enqueue = (function(global) { "use strict";
    
    var msg = "AsyncFlow-" + (+new Date()) + Math.floor(Math.random() * 999999),
        process = global.process,
        window = global.window,
        msgChannel = null,
        list = [];
    
    if (process && typeof process.nextTick === "function") {
    
        // NodeJS
        return process.nextTick;
   
    } else if (window && window.addEventListener && window.postMessage) {
    
        // Modern Browsers
        if (window.MessageChannel) {
        
            msgChannel = new window.MessageChannel();
            msgChannel.port1.onmessage = onmsg;
        
        } else {
        
            window.addEventListener("message", onmsg, true);
        }
        
        return (function(fn) { "use strict";
        
            list.push(fn);
            
            if (msgChannel !== null)
                msgChannel.port2.postMessage(msg);
            else
                window.postMessage(msg, "*");
            
            return 1;
        });
    
    } else {
    
        // Legacy
        return (function(fn) { "use strict"; return setTimeout(fn, 0); });
    }
        
    function onmsg(evt) {
    
        if (msgChannel || (evt.source === window && evt.data === msg)) {
        
            evt.stopPropagation();
            if (list.length) list.shift()();
        }
    }
    
})(this);



exports.defer = defer;
exports.begin = begin;
exports.when = when;
exports.whenAny = whenAny;
exports.whenAll = whenAll;
};

__modules[4] = function(exports) {
"use strict";

var OP_toString = Object.prototype.toString,
    OP_hasOwnProperty = Object.prototype.hasOwnProperty;

// Returns the internal class of an object
function getClass(o) {

	if (o === null || o === undefined) return "Object";
	return OP_toString.call(o).slice("[object ".length, -1);
}

// Returns true if the argument is a Date object
function isDate(obj) {

    return getClass(obj) === "Date";
}

// Returns true if the argument is an object
function isObject(obj) {

    return obj && typeof obj === "object";
}

// Returns true if the arguments are "equal"
function equal(a, b) {

	if (a === b)
		return true;

	// Dates must have equal time values
	if (isDate(a) && isDate(b))
		return a.getTime() === b.getTime();
	
	// Non-objects must be strictly equal (types must be equal)
	if (!isObject(a) || !isObject(b))
		return a === b;
	
	// Prototypes must be identical.  getPrototypeOf may throw on
	// ES3 engines that don't provide access to the prototype.
	try {
	
	    if (Object.getPrototypeOf(a) !== Object.getPrototypeOf(b))
		    return false;
	
	} catch (err) {}
	
	var aKeys = Object.keys(a),
		bKeys = Object.keys(b),
		i;
	
	// Number of own properties must be identical
	if (aKeys.length !== bKeys.length)
		return false;
	
	for (i = 0; i < aKeys.length; ++i) {
	
		// Names of own properties must be identical
		if (!OP_hasOwnProperty.call(b, aKeys[i]))
			return false;
		
		// Values of own properties must be equal
		if (!equal(a[aKeys[i]], b[aKeys[i]]))
			return false;
	}
	
	return true;
}

var Test = es6now.Class(null, function(__super) { return {

	constructor: function(log) {
	
		this._name = "";
		this._not = false;
		this._log = log;
	},
	
	name: function(name) {
	
		this._name = name;
		return this;
	},
	
	not: function() {
	
		this._not = !this._not;
		return this;
	},
	
	assert: function(val) {
	
		return this._assert(val, {
		
			method: "assert"
		});
	},
	
	equal: function(actual, expected) {
	
		return this._assert(equal(actual, expected), {
		
			actual: actual,
			expected: expected,
			method: "equal"
		});
	},
	
	throws: function(type, fn) {
	
		if (!fn) {
		
			fn = type;
			type = null;
		}
		
		var threw = false;
		
		// TODO: Most errors will just be of type "Error".  How can
		// we communicate type information, then?
		
		try { fn(); } 
		catch (x) { threw = (!type || x instanceof type); }
		
		return this._assert(threw, {
		
			method: "throws"
		});
	},
	
	_assert: function(pred, data) {
	
		var pass = !!pred, 
			method = data.method || "",
			obj;
		
		if (this._not) {
		
			pass = !pass;
			method = "not " + method;
		}
		
		obj = { name: this._name, pass: pass, method: method };
		Object.keys(data).forEach((function(k) { "use strict"; return obj[k] || (obj[k] = data[k]); }));
		
		this._log(obj);
		this._not = false;
		
		return this;
	}
}});

exports.Test = Test;
};

__modules[5] = function(exports) {
"use strict";

var HtmlLogger = __require(6).HtmlLogger;
var NodeLogger = __require(7).NodeLogger;

var Logger = (typeof this.process === "object" && process.cwd) ?
    NodeLogger :
    HtmlLogger;

exports.Logger = Logger;
};

__modules[6] = function(exports) {
"use strict";

var console = this.console || { log: function() {} },
    window = this.window;

var ELEMENT_ID = "unit-test-output";

function findTarget() {

    var e;
    
    for (var w = window; w; w = w.parent) {
    
        e = w.document.getElementById(ELEMENT_ID);
        
        if (e)
            return e;
    }
    
    return null;
}

var HtmlLogger = es6now.Class(null, function(__super) { return {

    constructor: function() {
    
        this.target = findTarget();
        this.clear();
    },
    
    clear: function() {
    
        this.depth = 0;
        this.html = "";
        
        if (this.target)
            this.target.innerHTML = "";
    },
    
    end: function() {
    
        this._flush();
    },
    
    pushGroup: function(name) {
    
        this.depth += 1;
        
        var line = "=".repeat(this.depth + 1);
        console.log("\n" + (line) + " " + (name) + " " + (line) + "");
        
        this._writeHeader(name, this.depth);
    },
    
    popGroup: function() {
    
        this.depth -= 1;
        this._flush();
    },
    
    log: function(result) {
    
        console.log("" + (result.name) + ": [" + (result.pass ? "OK" : "FAIL") + "]");
        
        this.html += 
        "<div class='" + (result.pass ? "pass" : "fail") + "'>\n            " + (result.name) + " <span class=\"status\">[" + (result.pass ? "OK" : "FAIL") + "]</span>\n        </div>";
    },
    
    error: function(err) {
    
    },
    
    _writeHeader: function(name) {
    
        var level = Math.min(Math.max(2, this.depth + 1), 6);
        this.html += "<h" + (level) + ">" + (name) + "</h" + (level) + ">";
    },
    
    _flush: function() {
    
        if (!this.target)
            return;
        
        var document = this.target.ownerDocument,
            div = document.createElement("div"), 
            frag = document.createDocumentFragment(),
            child;
        
        div.innerHTML = this.html;
        this.html = "";
        
        while (child = div.firstChild)
            frag.appendChild(child);
        
        if (this.target)
            this.target.appendChild(frag);
        
        div = null;
    }
}});
exports.HtmlLogger = HtmlLogger;
};

__modules[7] = function(exports) {
"use strict";

var NodeLogger = es6now.Class(null, function(__super) { return {

    constructor: function() {
    
        this.clear();
    },
    
    clear: function() {
    
        this.depth = 0;
    },
    
    end: function() {
    
        // Empty
    },
    
    pushGroup: function(name) {
    
        this.depth += 1;
        var line = "=".repeat(this.depth + 1);
        console.log("\n" + (line) + " " + (name) + " " + (line) + "");
    },
    
    popGroup: function() {
    
        this.depth -= 1;
    },
    
    log: function(result) {
    
        console.log("" + (result.name) + ": [" + (result.pass ? "OK" : "FAIL") + "]");
    },
    
    error: function(err) {
    
    }
}});
exports.NodeLogger = NodeLogger;
};

__require(0, exports);


}, []);