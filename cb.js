// CoolBreeze DOM Manipulator
(function(window, undefined) {

    // Handle DOMContentLoaded event
    var domReadyStack = [];

    function handleDOMReady(fn) {
        return document.readyState === 'complete' ? fn.call(document) : domReadyStack.push(fn);
    }

    document.addEventListener('DOMContentLoaded', function onDOMReady() {
        document.removeEventListener('DOMContentLoaded', onDOMReady);
        while (domReadyStack.length) {
            domReadyStack.shift().call(document);
        }
    });

    // cb constructor
    function cb(selector) {

        if (!(this instanceof cb)) {
            return new cb(selector);
        }

        if (typeof selector === 'function') {
            return handleDOMReady(selector);
        }

        // Number of elements in collection
        this.length = 0;

        // Nodes collection array
        this.nodes = [];

        // HTMLElements and NodeLists are wrapped in nodes array
        if (selector instanceof HTMLElement || selector instanceof NodeList) {
            this.nodes = selector.length > 1 ? [].slice.call(selector) : [selector];
        } else if (typeof selector === 'string') {
            if (selector[0] === '<' && selector[selector.length - 1] === ">") {
                // Create DOM elements
                this.nodes = [createNode(selector)];
            } else {
                // Query DOM
                this.nodes = [].slice.call(document.querySelectorAll(selector));
            }
        }

        if (this.nodes.length) {
            this.length = this.nodes.length;
            for (var i = 0; i < this.nodes.length; i++) {
                this[i] = this.nodes[i];
            }
        }
    }

    function createNode(html) {
        var div = document.createElement('div');
        div.innerHTML = html;
        return div.firstChild;
    }


    // Methods
    cb.fn = cb.prototype;

    cb.fn.each = function(callback) {
        for (var i = 0; i < this.length; i++) {
            callback.call(this[i], this, i);
        }
        return this;
    };

    cb.fn.addClass = function(classes) {
        return this.each(function() {
            this.className += ' ' + classes;
        });
    };

    cb.fn.removeClass = function(className) {
        return this.each(function() {
            this.className = this.className.replace(new RegExp('\\b' + className + '\\b', 'g'), '');
        });
    };

    cb.fn.text = function(str) {
        if (str) {
            return this.each(function() {
                this.innerText = str;
            });
        }
        return this.length && this[0].innerText;
    };

    cb.fn.on = function(name, handler) {
        return this.each(function() {
            this.addEventListener(name, handler, false);
        });
    };

    cb.fn.attr = function(key, value) {
        if (value) {
            return this.each(function() {
                this.setAttribute(key, value);
            });
        }
        return this.length && this[0].getAttribute(key);
    };

    window.cb = cb;

    window.$ = window.$ || cb;

})(window);