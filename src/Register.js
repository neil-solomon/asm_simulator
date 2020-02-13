import React from "react";
import "./Register.css";

export default class Register extends React.PureComponent {
  constructor(props) {
    super(props);
    var subRegisters;
    if (this.props.subRegisters) {
      subRegisters = new Array(this.props.subRegisters.length);
      var subValueBi = "",
        subValueHex = "";
      for (let i = 0; i < (this.props.size * 8) / subRegisters.length; ++i) {
        subValueBi += "0";
        if (i % 4 === 0) {
          subValueHex += "0";
        }
      }
      for (let i = 0; i < subRegisters.length; ++i) {
        subRegisters[i] = {
          name: this.props.subRegisters[i],
          valueDec: 0,
          valueBi: subValueBi,
          valueHex: subValueHex
        };
      }
    }
    var valueBi = "",
      valueHex = "";
    for (let i = 0; i < this.props.size * 8; ++i) {
      valueBi += "0";
      if (i % 4 === 0) {
        valueHex += "0";
      }
    }
    this.state = {
      valueBi: valueBi,
      valueHex: valueHex,
      subRegisters: subRegisters,
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
      var subRegisters = null;
      if (this.state.subRegisters) {
        subRegisters = [...this.state.subRegisters];
        var valueHexArray, valueHexDigit;
        for (let i = 0; i < subRegisters.length; ++i) {
          subRegisters[i].valueBi = valueBi.slice(
            i * (valueBi.length / subRegisters.length),
            i * (valueBi.length / subRegisters.length) +
              valueBi.length / subRegisters.length
          );
          subRegisters[i].valueHex = valueHex.slice(
            i * (valueHex.length / subRegisters.length),
            i * (valueHex.length / subRegisters.length) +
              valueHex.length / subRegisters.length
          );
          subRegisters[i].valueDec = 0;
          valueHexArray = subRegisters[i].valueHex.split("");
          for (let j = 0; j < valueHexArray.length; ++j) {
            switch (valueHexArray[j]) {
              case "A":
                valueHexDigit = 10;
                break;
              case "B":
                valueHexDigit = 11;
                break;
              case "C":
                valueHexDigit = 12;
                break;
              case "D":
                valueHexDigit = 13;
                break;
              case "E":
                valueHexDigit = 14;
                break;
              case "F":
                valueHexDigit = 15;
                break;
              default:
                valueHexDigit = parseInt(valueHexArray[j]);
                break;
            }
            subRegisters[i].valueDec +=
              Math.pow(16, valueHexArray.length - j - 1) * valueHexDigit;
          }
        }
      }
      var resetClassNameTimeout = setTimeout(() => this.resetClassName(), 250);
      this.setState({
        valueBi,
        valueHex,
        subRegisters,
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
        <div className="Register-mainRegister">
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
        {this.state.subRegisters &&
          this.state.subRegisters.map(subRegister => (
            <div
              key={"subRegister" + subRegister.name}
              className="Register-subRegisters"
            >
              <div>
                <span className="Register-name">{subRegister.name}</span>
                {/* <span className="Register-size">
                  {this.props.size / this.props.subRegisters.length} byte(s)
                </span> */}
              </div>
              <div>
                {subRegister.valueDec}
                <sub>10</sub>
              </div>
              <div>
                {subRegister.valueHex}
                <sub>16</sub>
              </div>
              <div>
                {subRegister.valueBi}
                <sub>2</sub>
              </div>
            </div>
          ))}
      </div>
    );
  }
}
