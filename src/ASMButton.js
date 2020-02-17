import React from "react";
import gsap from "gsap";
import "./ASMButton.css";

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onHoverIn = this.onHoverIn.bind(this);
    this.onHoverOut = this.onHoverOut.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  onHoverIn() {
    gsap.to("#" + this.props.id, {
      duration: 0.5,
      backgroundColor: "rgb(209, 196, 233,.5)"
    });
  }

  onHoverOut() {
    gsap.to("#" + this.props.id, {
      duration: 0.5,
      backgroundColor: "white"
    });
  }

  onClick() {
    var timeline1 = gsap.timeline(),
      timeline2 = gsap.timeline();
    timeline1
      .to("#" + this.props.id, {
        duration: 0.15,
        boxShadow: "inset 1.5px 1.5px 1.5px rgb(117, 117, 117, 0.5)",
        backgroundColor: "rgb(209, 196, 233,.75)"
      })
      .to("#" + this.props.id, {
        duration: 0.25,
        boxShadow: "inset 0px 0px 0px rgb(117, 117, 117, 0.5)",
        backgroundColor: "rgb(209, 196, 233,.5)"
      });
    timeline2
      .to("#" + this.props.id + "Container", {
        duration: 0.15,
        boxShadow: "0px 0px 0px rgb(117, 117, 117, 0.5)"
      })
      .to("#" + this.props.id + "Container", {
        duration: 0.25,
        boxShadow: "1.5px 1.5px 1.5px rgb(117, 117, 117, 0.5)"
      });
    this.props.onClick();
  }

  render() {
    return (
      <div className="ASMButtonContainer" id={this.props.id + "Container"}>
        <div
          className="ASMButton"
          id={this.props.id}
          onClick={this.onClick}
          onMouseEnter={this.onHoverIn}
          onMouseLeave={this.onHoverOut}
        >
          {this.props.name}
        </div>
      </div>
    );
  }
}
