/*if (!Object.assign) {
  Object.defineProperty(Object, 'assign', {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function(target) {
      'use strict';
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert first argument to object');
      }

      var to = Object(target);
      for (var i = 1; i < arguments.length; i++) {
        var nextSource = arguments[i];
        if (nextSource === undefined || nextSource === null) {
          continue;
        }
        nextSource = Object(nextSource);

        var keysArray = Object.keys(nextSource);
        for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
          var nextKey = keysArray[nextIndex];
          var desc = Object.getOwnPropertyDescriptor(nextSource, nextKey);
          if (desc !== undefined && desc.enumerable) {
            to[nextKey] = nextSource[nextKey];
          }
        }
      }
      return to;
    }
  });
}*/

function expand(obj, predicate) {
  var outObj = {};
  for (var o in obj){
    var temp = null;
    if (typeof obj[o] === 'object') {
      temp = expand(obj[o], predicate);
    }
    if (temp) {
      Object.keys(temp).forEach(function(i) {
        var val = predicate ? predicate(temp[i]) : temp[i];
        outObj[i] = val;
      })
    }
    else {
      var val = predicate ? predicate(obj[o]) : obj[o];
      outObj[o] = obj[o];
    }
  }
  return outObj;
}

module.exports = {
  
  assign: function(source, target){
    if (!source || !target || (typeof source !== 'object' || typeof target !== 'object' )) {
      throw new TypeError('Cannot convert arguments to object');
    }

    var source = Object(source);
    var to = Object(target);
    var keysArray = Object.keys(target);
    for (var nextIndex = 0, len = keysArray.length; nextIndex < len; nextIndex++) {
      var nextKey = keysArray[nextIndex];
      var desc = Object.getOwnPropertyDescriptor(source, nextKey);
      if (desc !== undefined && desc.enumerable) {
        to[nextKey] = source[nextKey];
      }
    }
    return to;
  },

  expand: expand
}