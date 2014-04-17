var React = require("react");
var Section = require("./section.jsx");
var BackgroundImage = require("./backgroundimage.jsx");

module.exports = React.createClass({
    getInitialState: function () {
        return { scrollOffset: 0 };
    },
    handleNewScrollOffset: function () {
        console.log("deal with scroll", window.scrollOffset);
        this.shouldHandleScroll = true;
    },
    shouldHandleScroll: true,
    componentDidMount: function () {
        window.onscroll = function () {
            if (this.shouldHandleScroll) {
                this.shouldHandleScroll = false;
                requestAnimationFrame(this.handleNewScrollOffset);
            } else {
                console.log("scroll stopped");
            }
        }.bind(this);
    },
    render: function () {
        return (
            <div>
                <BackgroundImage image="background.jpg" />
                <Section text="hello" />
                <Section text="page2" />
                <Section text="text3" />
            </div>
        );
    }
});
