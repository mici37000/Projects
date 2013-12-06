//template functions
function Template(html){
    var me = this,
        a = arguments,
        buf = [],
        v;

    if ($.isArray(html)) {
        html = html.join("");
    }
    html = html.replace(/>\s+</g,'><');

    /**@private*/
    me.html = html;
    if (me.compiled) {
        me.compile();
    }
};

Template.prototype = {
    /**
     * @cfg {RegExp} re The regular expression used to match template variables.
     * re : /\{([\w\-]+)\}/g                                     // for Core
     */
    re : /\{([\w\-]+)\}/g,
    /**
     * Returns an HTML fragment of this template with the specified <code>values</code> applied.
     */
    applyTemplate : function(values){
        var me = this;
        return me.compiled ?
            me.compiled(values) :
            me.html.replace(me.re, function(m, name){
                return values[name] !== undefined ? values[name] : "";
            });
    },
    /**
     * Sets the HTML used as the template and optionally compiles it.
     */
    set : function(html, compile){
        var me = this;
        me.html = html;
        me.compiled = null;
        return compile ? me.compile() : me;
    },
    /**
     * Compiles the template into an internal function, eliminating the RegEx overhead.
     */
    compile : function(){
        var me = this,
            ua = navigator.userAgent.toLowerCase(),
            check = function(r){
                return r.test(ua);
            },
            isGecko= !check(/webkit/) && check(/gecko/),
            sep = isGecko ? "+" : ",";

        function fn(m, name){
            name = "values['" + name + "']";
            return "'"+ sep + '(' + name + " == undefined ? '' : " + name + ')' + sep + "'";
        }

        eval("this.compiled = function(values){ return " + (isGecko ? "'" : "['") +
            me.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn) +
            (isGecko ?  "';};" : "'].join('');};"));
        return me;
    },

    before: function(el, values ){
        return $(el).before(this.applyTemplate(values)).prev();
    },

    after : function(el, values ){
        return $(el).after(this.applyTemplate(values)).next();
    },

    /**
     * Applies the supplied <code>values</code> to the template and appends
     */
    prepend:function (el, values){
        return $(el).prepend(this.applyTemplate(values)).children(':first-child');
    },
    append : function(el, values ){
        return $(el).append(this.applyTemplate(values)).children(':last-child');
    },
    /**
     * Applies the supplied values to the template and overwrites the content of el with the new node(s).
     */
    overwrite : function(el, values, returnElement){
        el = $(el);
        el.html(this.applyTemplate(values));
        return returnElement ? $(el.firstChild) : el.firstChild;
    }
};

//error handling
function handleError(errData , arg){
    console.error("error when call function ", arguments.callee.caller.name , "with this data ", arg," error: ", errData);
}

//opens the leaderboard
function openLeaderboard(key, roomId, callback){
    try{
        Leaderboard.defAjax.done(function(res){
            if(!(res.leaderboard_key_map[key] && res.leaderboard_key_map[key][0])){
                var error = {num:10, desc:'this category or leaderboard number is not exist'};
                handleError(error, arguments);
                callback && applyCallback(callback,{error:error});
            }
            else{
                Leaderboard.init(key, roomId);
            }
        });
    }catch(err){
        handleError(err, arguments);
        callback && applyCallback(callback);
    }
}