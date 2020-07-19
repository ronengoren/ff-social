/**
 * @license Copyright 2015 Logentries.
 * Please view license at https://raw.github.com/logentries/le_js/master/LICENSE
 */

/* jslint browser:true */
/* global define, module, exports, console, global */

/** @param {Object} window */
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(() => factory(root));
  } else if (typeof exports === 'object') {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    if (typeof global === 'object') {
      // Browserify. The calling object `this` does not reference window.
      // `global` and `this` are equivalent in Node, preferring global
      // adds support for Browserify.
      root = global;
    }
    module.exports = factory(root);
  } else {
    // Browser globals (root is window)
    root.LE = factory(root);
  }
}(this, (window) => {
  // cross-browser indexOf fix
  const _indexOf = function (array, obj) {
    for (let i = 0; i < array.length; i++) {
      if (obj === array[i]) {
        return i;
      }
    }
    return -1;
  };

  // Obtain a browser-specific XHR object
  const _getAjaxObject = function () {
    if (typeof XDomainRequest !== 'undefined') {
      // We're using IE8/9
      return new XDomainRequest();
    }
    return new XMLHttpRequest();
  };

  /**
   * A single log event stream.
   * @constructor
   * @param {Object} options
   */
  function LogStream(options) {
    /**
     * @const
     * @type {string} */
    const _traceCode = options.trace ? (Math.random() + Math.PI).toString(36).substring(2, 10) : null;
    /** @type {string} */
    const _pageInfo = options.page_info;
    /** @type {string} */
    const _token = options.token;
    /** @type {boolean} */
    const _print = options.print;
    /** @type {boolean} */
    const _noFormat = true;
    /** @type {boolean} */
    const _SSL = (function () {
      if (typeof XDomainRequest === 'undefined') {
        return options.ssl;
      }
      // If we're relying on XDomainRequest, we
      // must adhere to the page's encryption scheme.
      return window.location.protocol === 'https:';
    }());
    /** @type {string} */
    let _endpoint;
    if (window.LEENDPOINT) {
      _endpoint = window.LEENDPOINT;
    } else if (_noFormat) {
      _endpoint = 'webhook.logentries.com/noformat';
    } else {
      _endpoint = 'js.logentries.com/v1';
    }
    _endpoint = `${(_SSL ? 'https://' : 'http://') + _endpoint}/logs/${_token}`;

    /**
     * Flag to prevent further invocations on network err
     ** @type {boolean} */
    const _shouldCall = true;
    /** @type {Array.<string>} */
    const _backlog = [];
    /** @type {boolean} */
    let _active = false;
    /** @type {boolean} */
    let _sentPageInfo = false;

    if (options.catchall) {
      const oldHandler = window.onerror;
      const newHandler = function (msg, url, line) {
        _rawLog({ error: msg, line, location: url }).level('ERROR').send();
        if (oldHandler) {
          return oldHandler(msg, url, line);
        } else {
          return false;
        }
      };
      window.onerror = newHandler;
    }

    const _agentInfo = function () {
      const nav = window.navigator || { doNotTrack: undefined };
      const screen = window.screen || {};
      const location = window.location || {};

      return {
        url: location.pathname,
        referrer: document.referrer,
        screen: {
          width: screen.width,
          height: screen.height
        },
        window: {
          width: window.innerWidth,
          height: window.innerHeight
        },
        browser: {
          name: nav.appName,
          version: nav.appVersion,
          cookie_enabled: nav.cookieEnabled,
          do_not_track: nav.doNotTrack
        },
        platform: nav.platform
      };
    };

    const _getEvent = function () {
      let raw = null;
      const args = Array.prototype.slice.call(arguments);
      if (args.length === 0) {
        throw new Error('No arguments!');
      } else if (args.length === 1) {
        raw = args[0];
      } else {
        // Handle a variadic overload,
        // e.g. _rawLog("some text ", x, " ...", 1);
        raw = args;
      }
      return raw;
    };

    // Single arg stops the compiler arity warning
    var _rawLog = function (msg) {
      const event = _getEvent.apply(this, arguments);

      const data = { ...event };

      // Add agent info if required
      if (_pageInfo !== 'never') {
        if (!_sentPageInfo || _pageInfo === 'per-entry') {
          _sentPageInfo = true;
          if (typeof event.screen === 'undefined' &&
            typeof event.browser === 'undefined') {
            _rawLog(_agentInfo()).level('PAGE').send();
          }
        }
      }

      if (_traceCode) {
        data.trace = _traceCode;
      }

      return {
        level(l) {
          // Don't log PAGE events to console
          // PAGE events are generated for the agentInfo function
          if (_print && typeof console !== 'undefined' && l !== 'PAGE') {
            let serialized = null;
            if (typeof XDomainRequest !== 'undefined') {
              // We're using IE8/9
              serialized = `${data.trace} ${data.event}`;
            }
            try {
              console[l.toLowerCase()].call(console, (serialized || data));
            } catch (ex) {
              // IE compat fix
              console.log((serialized || data));
            }
          }
          // data.level = l;

          return {
            send() {
              const cache = [];
              const serialized = JSON.stringify(data, (key, value) => {
                if (typeof value === 'undefined') {
                  return 'undefined';
                } else if (typeof value === 'object' && value !== null) {
                  if (_indexOf(cache, value) !== -1) {
                    // We've seen this object before;
                    // return a placeholder instead to prevent
                    // cycles
                    return '<?>';
                  }
                  cache.push(value);
                }
                return value;
              });

              if (_active) {
                _backlog.push(serialized);
              } else {
                _apiCall(_token, serialized);
              }
            }
          };
        }
      };
    };

    /** @expose */
    this.log = _rawLog;

    var _apiCall = function (token, data) {
      _active = true;

      const request = _getAjaxObject();

      if (_shouldCall) {
        if (request.constructor === XMLHttpRequest) {
          // Currently we don't support fine-grained error
          // handling in older versions of IE
          request.onreadystatechange = function () {
            if (request.readyState === 4) {
              // Handle any errors
              if (request.status >= 400) {
                console.error('Couldn\'t submit events.');
                if (request.status === 410) {
                  // This API version has been phased out
                  console.warn('This version of le_js is no longer supported!');
                }
              } else {
                if (request.status === 301) {
                  // Server issued a deprecation warning
                  console.warn('This version of le_js is deprecated! Consider upgrading.');
                }
                if (_backlog.length > 0) {
                  // Submit the next event in the backlog
                  _apiCall(token, _backlog.shift());
                } else {
                  _active = false;
                }
              }
            }
          };
        } else {
          request.onload = function () {
            if (_backlog.length > 0) {
              // Submit the next event in the backlog
              _apiCall(token, _backlog.shift());
            } else {
              _active = false;
            }
          };
        }

        request.open('POST', _endpoint, true);
        if (request.constructor === XMLHttpRequest) {
          request.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
          request.setRequestHeader('Content-type', 'application/json');
        }

        if (request.overrideMimeType) {
          request.overrideMimeType('text');
        }

        request.send(data);
      }
    };
  }

  /**
   * A single log object
   * @constructor
   * @param {Object} options
   */
  function Logger(options) {
    let logger;

    // Default values
    const dict = {
      ssl: true,
      catchall: false,
      trace: false,
      page_info: 'never',
      print: false,
      endpoint: null,
      token: null
    };

    if (typeof options === 'object') {
      for (const k in options) {
        dict[k] = options[k];
      }
    } else {
      throw new Error('Invalid parameters for createLogStream()');
    }

    if (dict.token === null) {
      throw new Error('Token not present.');
    } else {
      logger = new LogStream(dict);
    }

    const _log = function (msg) {
      if (logger) {
        return logger.log.apply(this, arguments);
      } else {
        throw new Error('You must call LE.init(...) first.');
      }
    };

    // The public interface
    return {
      log() {
        _log.apply(this, arguments).level('LOG').send();
      },
      warn() {
        _log.apply(this, arguments).level('WARN').send();
      },
      error() {
        _log.apply(this, arguments).level('ERROR').send();
      },
      info() {
        _log.apply(this, arguments).level('INFO').send();
      }
    };
  }

  // Array of Logger elements
  const loggers = {};

  const _getLogger = function (name) {
    if (!loggers.hasOwnProperty(name)) {
      throw new Error('Invalid name for logStream');
    }

    return loggers[name];
  };

  const _createLogStream = function (options) {
    if (typeof options.name !== 'string') {
      throw new Error('Name not present.');
    }
    loggers[options.name] = new Logger(options);

    return true;
  };

  const _deprecatedInit = function (options) {
    const dict = {
      name: 'default'
    };

    if (typeof options === 'object') {
      for (const k in options) {
        dict[k] = options[k];
      }
    } else if (typeof options === 'string') {
      dict.token = options;
    } else {
      throw new Error('Invalid parameters for init()');
    }

    return _createLogStream(dict);
  };

  const _destroyLogStream = function (name) {
    if (typeof name === 'undefined') {
      name = 'default';
    }

    delete loggers[name];
  };

  // The public interface
  return {
    init: _deprecatedInit,
    createLogStream: _createLogStream,
    to: _getLogger,
    destroy: _destroyLogStream,
    log() {
      for (const k in loggers) {
        loggers[k].log.apply(this, arguments);
      }
    },
    warn() {
      for (const k in loggers) {
        loggers[k].warn.apply(this, arguments);
      }
    },
    error() {
      for (const k in loggers) {
        loggers[k].error.apply(this, arguments);
      }
    },
    info() {
      for (const k in loggers) {
        loggers[k].info.apply(this, arguments);
      }
    }
  };
}));
