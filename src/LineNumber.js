import React from "react";
import { Icon } from "antd";
import gsap from "gsap";
import "./LineNumber.css";

export default class LineNumber extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tooltipText: ""
    };
    this.showTooltip = this.showTooltip.bind(this);
    this.hideTooltip = this.hideTooltip.bind(this);
  }

  showTooltip() {
    var tooltipText = "Line " + this.props.name + " : ";
    if (this.props.error.parsing) {
      tooltipText += "Can't parse line. ";
    }
    if (this.props.error.instruction) {
      tooltipText += "Instruction not supported. ";
    }
    if (this.props.error.destination) {
      tooltipText += "Destination not found. ";
    }
    if (this.props.error.source) {
      tooltipText += "Source not found. ";
    }
    if (this.props.error.overflow) {
      tooltipText +=
        "Executing this instruction caused signed integer overflow.";
    }
    if (tooltipText.split(" ").length > 4) {
      var timeline = gsap.timeline();
      timeline.to("#LineNumber" + this.props.name + "Tooltip", {
        duration: 0.5,
        opacity: 1,
        left: 20
      });
      this.setState({
        tooltipText
      });
    }
  }

  hideTooltip() {
    var timeline = gsap.timeline();
    timeline.to("#LineNumber" + this.props.name + "Tooltip", {
      duration: 0.5,
      opacity: 0,
      left: -50
    });
  }

  render() {
    return (
      <>
        <div
          id={"LineNumber" + this.props.name + "Tooltip"}
          style={{
            position: "absolute",
            fontSize: 10,
            color: "white",
            backgroundColor: "rgb(33,33,33,.75)",
            padding: 5,
            borderRadius: 5,
            cursor: "normal",
            opacity: 0,
            zIndex: 1,
            top: 50,
            left: -50,
            maxWidth: 200,
            textAlign: "center"
          }}
        >
          {this.state.tooltipText}
        </div>
        <div
          id={"LineNumber" + this.props.name}
          style={{ cursor: "pointer" }}
          onMouseEnter={this.showTooltip}
          onMouseLeave={this.hideTooltip}
          onClick={this.hideTooltip}
        >
          <div className="LineNumber-error">
            {this.props.error.parsing && <Icon type="read"></Icon>}
          </div>
          <div className="LineNumber-error">
            {this.props.error.instruction && <Icon type="close-circle"></Icon>}
          </div>
          <div
            className="LineNumber-error"
            style={{ transform: "rotate(90deg)" }}
          >
            {this.props.error.destination && <Icon type="import"></Icon>}
          </div>
          <div
            className="LineNumber-error"
            style={{ transform: "rotate(90deg)" }}
          >
            {this.props.error.source && <Icon type="export"></Icon>}
          </div>
          <div className="LineNumber-error">
            {this.props.error.overflow && <Icon type="bg-color"></Icon>}
          </div>
          <div className="LineNumber-current">
            {this.props.current && <Icon type="right"></Icon>}
          </div>
          <div className="LineNumber-name">{this.props.name}</div>
        </div>
      </>
    );
  }
}
