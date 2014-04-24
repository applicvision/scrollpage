var React = require("react");
var Section = require("./section.jsx");
var TitleSection = require("./titlesection.jsx");
var BackgroundImage = require("./backgroundimage.jsx");
var Header = require("./header.jsx");

module.exports = React.createClass({
    getInitialState: function () {
        return { currentSection: this.getCurrentSection() };
    },
    getCurrentSection: function () {
        return Math.floor(Math.abs(window.pageYOffset) / window.innerHeight) - 1;
    },
    handleNewScrollOffset: function () {
        var newSection = this.getCurrentSection();
        this.setState({ currentSection: this.getCurrentSection() });
    },
    componentDidMount: function () {
        //window.onscroll = requestAnimationFrame.bind(this, this.handleNewScrollOffset);
    },  
    shouldComponentUpdate: function (newProps, newState) {
        return newState.currentSection !== this.state.currentSection;
    },
    render: function () {
        console.log("render");
        var data = this.props.data;
        var currentSectionIndex = this.state.currentSection;
        var currentSection = data.sections[currentSectionIndex];
        var hash = currentSection ? "#" + currentSection.title.toLowerCase() : "";
        history.replaceState(null, null, hash);
        var sections = data.sections.map(function (section) {
            return <Section text={section.text} image={section.image} key={section.title} title={section.title} />;
        });
        var headerLinks = data.sections.map(function (section) {
            return {"anchor": section.title.toLowerCase(), "title": section.title};
        });
        return (
            <div>
                <BackgroundImage image={data.background} />
                <Header sections={headerLinks} currentSection={currentSectionIndex} />
                <TitleSection image={data.icon} />
                {sections}
            </div>
        );
    }
});
