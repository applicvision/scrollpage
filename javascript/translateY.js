var propertyName;

function findPropertyName (elem, property) {
    //First check without prefix
    if (elem.style.hasOwnProperty(property)) {
        propertyName = property;
        return true;
    }
    //Then capitalize property and check for prefixed property.
    var property = property.charAt(0).toUpperCase() + property.slice(1);
    return ["webkit", "Moz", "o", "ms"].some(function (prefix) {
        if (elem.style.hasOwnProperty(prefix + property)) {
            propertyName = prefix + property;
            return true;
        }
    });
}

module.exports = function translateY3d(elem, amount) {
    var styleString = "translateY(" + amount + "px)";
    if (propertyName || findPropertyName(elem, "transform")) {
        elem.style[propertyName] = styleString;
    } else {
        //fallback to changing top property
        elem.style.top = amount + "px";
    }
};

