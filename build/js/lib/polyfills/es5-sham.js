!function(e){"function"==typeof define?define(e):"function"==typeof YUI?YUI.add("es5-sham",e):e()}(function(){function e(e){try{return e.sentinel=0,0===Object.getOwnPropertyDescriptor(e,"sentinel").value}catch(t){}}function t(e){try{return Object.defineProperty(e,"sentinel",{}),"sentinel"in e}catch(t){}}var r,n,o,c,i,f=Function.prototype.call,u=Object.prototype,p=f.bind(u.hasOwnProperty);if((i=p(u,"__defineGetter__"))&&(r=f.bind(u.__defineGetter__),n=f.bind(u.__defineSetter__),o=f.bind(u.__lookupGetter__),c=f.bind(u.__lookupSetter__)),Object.getPrototypeOf||(Object.getPrototypeOf=function(e){return e.__proto__||(e.constructor?e.constructor.prototype:u)}),Object.defineProperty){var l=e({}),b="undefined"==typeof document||e(document.createElement("div"));if(!b||!l)var a=Object.getOwnPropertyDescriptor}if(!Object.getOwnPropertyDescriptor||a){var _="Object.getOwnPropertyDescriptor called on a non-object: ";Object.getOwnPropertyDescriptor=function(e,t){if("object"!=typeof e&&"function"!=typeof e||null===e)throw new TypeError(_+e);if(a)try{return a.call(Object,e,t)}catch(r){}if(p(e,t)){var n={enumerable:!0,configurable:!0};if(i){var f=e.__proto__;e.__proto__=u;var l=o(e,t),b=c(e,t);if(e.__proto__=f,l||b)return l&&(n.get=l),b&&(n.set=b),n}return n.value=e[t],n.writable=!0,n}}}if(Object.getOwnPropertyNames||(Object.getOwnPropertyNames=function(e){return Object.keys(e)}),!Object.create){var d,y=null===Object.prototype.__proto__;d=y||"undefined"==typeof document?function(){return{__proto__:null}}:function(){function e(){}var t=document.createElement("iframe"),r=document.body||document.documentElement;t.style.display="none",r.appendChild(t),t.src="javascript:";var n=t.contentWindow.Object.prototype;return r.removeChild(t),t=null,delete n.constructor,delete n.hasOwnProperty,delete n.propertyIsEnumerable,delete n.isPrototypeOf,delete n.toLocaleString,delete n.toString,delete n.valueOf,n.__proto__=null,e.prototype=n,d=function(){return new e},new e},Object.create=function(e,t){function r(){}var n;if(null===e)n=d();else{if("object"!=typeof e&&"function"!=typeof e)throw new TypeError("Object prototype may only be an Object or null");r.prototype=e,n=new r,n.__proto__=e}return void 0!==t&&Object.defineProperties(n,t),n}}if(Object.defineProperty){var O=t({}),j="undefined"==typeof document||t(document.createElement("div"));if(!O||!j)var s=Object.defineProperty,v=Object.defineProperties}if(!Object.defineProperty||s){var w="Property description must be an object: ",P="Object.defineProperty called on non-object: ",m="getters & setters can not be defined on this javascript engine";Object.defineProperty=function(e,t,f){if("object"!=typeof e&&"function"!=typeof e||null===e)throw new TypeError(P+e);if("object"!=typeof f&&"function"!=typeof f||null===f)throw new TypeError(w+f);if(s)try{return s.call(Object,e,t,f)}catch(l){}if(p(f,"value"))if(i&&(o(e,t)||c(e,t))){var b=e.__proto__;e.__proto__=u,delete e[t],e[t]=f.value,e.__proto__=b}else e[t]=f.value;else{if(!i)throw new TypeError(m);p(f,"get")&&r(e,t,f.get),p(f,"set")&&n(e,t,f.set)}return e}}(!Object.defineProperties||v)&&(Object.defineProperties=function(e,t){if(v)try{return v.call(Object,e,t)}catch(r){}for(var n in t)p(t,n)&&"__proto__"!=n&&Object.defineProperty(e,n,t[n]);return e}),Object.seal||(Object.seal=function(e){return e}),Object.freeze||(Object.freeze=function(e){return e});try{Object.freeze(function(){})}catch(h){Object.freeze=function(e){return function(t){return"function"==typeof t?t:e(t)}}(Object.freeze)}Object.preventExtensions||(Object.preventExtensions=function(e){return e}),Object.isSealed||(Object.isSealed=function(e){return!1}),Object.isFrozen||(Object.isFrozen=function(e){return!1}),Object.isExtensible||(Object.isExtensible=function(e){if(Object(e)!==e)throw new TypeError;for(var t="";p(e,t);)t+="?";e[t]=!0;var r=p(e,t);return delete e[t],r})});