var React = require("react");

module.exports = React.createClass({
    render: function () {
        var spanStyle = {width: "50%"};
        return (
            <section id={this.props.title.toLowerCase()} className="content">
                <span style={spanStyle} >
                    <img src={this.props.image} />
                </span>
                <span style={spanStyle} >
                    {this.props.text}
                </span>
            </section>
        );
    }
});
