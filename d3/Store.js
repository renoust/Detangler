//pile de gestion d'Etat

var TP = TP || {};
(function () {


    var Store = function () {

        var __g__ = this;

        var cache = {};

        this.getData = function (name) {

            if (cache[name] != null)
                return cache[name];

            return null;

        }

        this.setData = function (name, elem) {

            if (typeof name === "object")
                if ((Object.getPrototypeOf(name) === Object.getPrototypeOf({})) && elem === null) //name is an array
                {
                    for (var key in name) {
                        if (cache[key] != null) {
                            assert(false, "object already exist : " + key);
                        }
                        else
                            cache[key] = name[key];
                    }

                }

            if ((typeof name === typeof "") && elem != null) {
                if (cache[name] != null) {
                    assert(false, "object already exist : " + name);
                }
                else
                    cache[name] = elem;
            }

            return cache;

        }

        this.removeData = function (name) {

            cache[name] = null; //provisory. Later, different object could have their own delete methode.

        }


        return __g__;
    }

    TP.Store = Store;
})(TP);
