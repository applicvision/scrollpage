var React = require("react");

var App = require("./app.jsx");

var testData = {
    name: "My App",
    icon: "icon.png",
    background: "background.jpg",
    sections: [
        {image: "phone1.png", text: "My app can do many things", title: "Versatile"},
        {image: "phone2.png", text: "Useful all the time", title:"Useful"},
        {image: "phone3.png", text: "You wont regret it..", title:"Regretful"}
    ],
    options: {

    }
};

React.renderComponent(<App data={testData}/>, document.body);

