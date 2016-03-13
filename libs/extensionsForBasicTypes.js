Array.prototype.intersecSortArr = function (B){
    var M = this.length, N = B.length, C = [],
        m = 1, n = 1, k = 0, a = 0, b = 0;
    for (var i = 1, t = this[0]; i < M; i++)
    {
        if (this[i] !== t)
        {
            this[m++] = this[i]; t = this[i];
        }
    }

    for ( i = 1, t = B[0]; i < N; i++)
    {
        if (B[i] !== t){
            B[n++] = B[i]; t = B[i];
        }
    }

    while (a < m && b < n)
    {
        if (this[a] < B[b]) ++a;
        else if (this[a] > B[b]) ++b;
        else C[k++] = this[a++];
    }
    return C;
}

Array.prototype.diffSortArr = function (B){
    var C = this.intersecSortArr(B),
        M = this.length,
        N = C.length;

    for (var i=0, k=0, a=0, c=0; i<M+N; i++)
    {
        if (this[a] === C[c]){
            ++a; ++c;
        }
        else{
            this[k] = this[i];
            k++; a++;
        }
    }
    this.length = k;
    return this;
}

Array.prototype.unique = function(){
    var obj = {};
    for (var i = 0; i < this.length; i++) {
        var str = this[i];
        obj[str] = true;
    };

    return Object.keys(obj);
}

exports.Array = Array;


String.prototype.capitilizeFirstLetter = function(){
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};
exports.String = String;