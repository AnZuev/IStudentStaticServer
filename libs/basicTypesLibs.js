
Array.prototype.unique = function(){
    var obj = {};
    for (var i = 0; i < this.length; i++) {
        var str = this[i];
        obj[str] = true;
    }
    return Object.keys(obj);
};

exports.Array = Array;
