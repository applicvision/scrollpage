var React = require("react");

module.exports = React.createClass({
    render: function () {
        return (
            <section style={{textAlign: "center", height: "100%", fontSize: "3em"}}>
                <img src={this.props.image} />
                <br />
                V
            </section>
        );
    }
});
