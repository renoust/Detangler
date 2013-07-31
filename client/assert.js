/************************************************************************
 * This module is used for testing
 * @authors Benjamin Renoust
 * @created February 2013
 ***********************************************************************/
var TP = TP || {};
(function () {
    var mute = true;

    this.assert = function (test, message) {
        if(mute) return;
        if (test) console.log("%c\t" + message, "color: green");
        else console.log("%c\t" + message, "color: red");
    };

    this.Test = function (name, fn) {
        if(mute) return;
        //console.log("%c" + name + ":", "color: blue");
        if (fn !== undefined) fn();
    };

    this.profile = function (fn, iterations) {
        if(mute) return;
        var start = new Date().getTime();
        if (fn === undefined) return
        if (iterations === undefined) iterations = 1

        for (var i = 0; i < iterations; i++) {
            fn();
        }

        var elapsed = new Date().getTime() - start;
        //console.log("%cElapsed time: " + elapsed + " on " + iterations + " iteration(s)", "color: blue");
    }


})(TP);
