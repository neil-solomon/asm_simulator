import React from "react";
import "./Register.css";

export default class Register extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      valueBi: "00000000",
      valueHex: "00",
      className: "Register",
      resetClassNameTimeout: null
    };
    this.resetClassName = this.resetClassName.bind(this);
  }

  componentWillUnmount() {
    clearTimeout(this.state.resetClassNameTimeout);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.value !== this.props.value) {
      var valueBi = "",
        valueHex = "",
        hexDigit = "",
        currentValue = this.props.value;
      while (currentValue) {
        hexDigit = (currentValue % 16).toString();
        if (hexDigit === "10") {
          hexDigit = "A";
        }
        if (hexDigit === "11") {
          hexDigit = "B";
        }
        if (hexDigit === "12") {
          hexDigit = "C";
        }
        if (hexDigit === "13") {
          hexDigit = "D";
        }
        if (hexDigit === "14") {
          hexDigit = "E";
        }
        if (hexDigit === "15") {
          hexDigit = "F";
        }
        valueHex = hexDigit + valueHex;
        currentValue = Math.floor(currentValue / 16);
      }
      while (valueHex.length < this.props.size * 2) {
        valueHex = "0" + valueHex;
      }
      currentValue = this.props.value;
      while (currentValue) {
        valueBi = (currentValue % 2).toString() + valueBi;
        currentValue = Math.floor(currentValue / 2);
      }
      while (valueBi.length < this.props.size * 8) {
        valueBi = "0" + valueBi;
      }
      var resetClassNameTimeout = setTimeout(() => this.resetClassName(), 1000);
      this.setState({
        valueBi,
        valueHex,
        className: "Register-change",
        resetClassNameTimeout
      });
    }
  }

  resetClassName() {
    this.setState({ className: "Register" });
  }

  render() {
    return (
      <div className={this.state.className}>
        <div>
          <span className="Register-name">{this.props.name}</span>
          <span className="Register-size">{this.props.size} byte(s)</span>
        </div>
        <div>
          {this.props.value}
          <sub>10</sub>
        </div>
        <div>
          {this.state.valueHex}
          <sub>16</sub>
        </div>
        <div>
          {this.state.valueBi}
          <sub>2</sub>
        </div>
      </div>
    );
  }
}
