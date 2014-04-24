var React = require("react");

module.exports = React.createClass({
    render: function () {
        var currentSection = this.props.currentSection;
        var links = this.props.sections.map(function(section, index) {
            var style = {};
            if (currentSection == index) {
                style.backgroundColor = "green";
            }
            return <a style={style} href={"#" + section.anchor} key={section.title} >{section.title}</a>
        });
        //Maybe use React class set add on.
        var className = "header " + (this.props.currentSection !== -1 ? "show" : "");
        return (
            <div className={className}>
                {links}
            </div>
        );
    }
});
