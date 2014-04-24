var React = require("react");

module.exports = React.createClass({
    componentDidMount: function () {
        var scrollHandler = this.props.onScroll;
        window.onscroll = function () {
            window.requestAnimationFrame(scrollHandler);
        };
    },
    render: function () {
        <div>
            {this.props.children}
        </div>
    }
});
