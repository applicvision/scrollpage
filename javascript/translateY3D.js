module.exports = function translateY3d(elem, amount) {
    var styleString = "translate3d(0," + amount + "px, 0)";

    ["webkit", "Moz", "o", "ms"].forEach(function (prefix) {
        elem.style[prefix + "Transform"] = styleString;
    });
};
