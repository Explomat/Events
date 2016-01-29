(function(e){ 
"classList" in e||Object.defineProperty(e, 
    "classList", { get : function classList(){ 
        var newO = this.className.split(" ").filter(function(i){return i&&/^[^ ]*$/.test(i)}), then = this;

        function DOMTokenList(){ newO.forEach(function(v,k){this[k]=v}) } 
        DOMTokenList.prototype = { 
            add : function(){ 
                for(var i=0, a=arguments;i<a.length;i++) ~newO.indexOf(a[i])||newO.push(a[i]);
                then.className = newO.join(" ");
            },
            contains : function(cl){ 
                return !!~newO.indexOf(cl); 
            }, 
            remove : function(cl){ 
                for(var q=0,i,a=arguments;a[q];q++){ 
                    i = newO.indexOf(a[q]); 
                    if(i > -1){ 
                        newO.splice(i,1); 
                        then.className = newO.join(" "); 
                    } 
                } 
            }, 
            toggle : function(cl){
                var i = classList.call(then), b = i.contains(cl);
                i[b ? "remove" : "add"](cl);
                return !b;
            }, 
            item : function(i){ return newO[i]; }
        } 
        return new DOMTokenList(); 
    } 
});})(Element.prototype);