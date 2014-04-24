var React = require("react");

module.exports = React.createClass({
    getInitialState: function () {
        return { scrollOffset: 0 };
    },
    scrollHandlerDirect: function () {
        requestAnimationFrame(this.rafScrollHandler.bind(this, window.scrollOffset));
    },
    rafScrollHandler : function (offset) {
        console.log("do some nice parallax", offset);
    },
    componentDidMount: function () {
        if (this.props.parallax) {
            window.onscroll = this.scrollHandlerDirect;
        }
    },
    render: function () {
        return <div className="backgroundimage"/>
    }
});
