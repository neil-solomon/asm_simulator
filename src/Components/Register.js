import React from "react";
import gsap from "gsap";
import powersOfTwo from "./powersOfTwo.json";
import "./Register.css";

export default class Register extends React.Component {
  constructor(props) {
    super(props);
    var subRegisters;
    if (this.props.subRegisters) {
      subRegisters = new Array(this.props.subRegisters.length);
      var subValueBi = new Array(this.props.size / subRegisters.length).fill(0),
        subValueDec = new Array(1).fill(0),
        subValueHex = new Array(
          this.props.size / (subRegisters.length * 4)
        ).fill("0");
      for (let i = 0; i < subRegisters.length; ++i) {
        subRegisters[i] = {
          name: this.props.subRegisters[i],
          valueDec: subValueDec,
          valueBi: subValueBi,
          valueHex: subValueHex
        };
      }
    }
    var valueDec = new Array(1).fill(0),
      valueHex = new Array(this.props.size / 4).fill("0");
    this.state = {
      valueBi: [...this.props.valueBi],
      valueDec: valueDec,
      valueHex: valueHex,
      subRegisters: subRegisters
    };
    this.biToDec = this.biToDec.bind(this);
    this.biToHex = this.biToHex.bind(this);
  }

  componentDidUpdate() {
    if (
      JSON.stringify(this.state.valueBi) !== JSON.stringify(this.props.valueBi)
    ) {
      var valueDec = this.biToDec(this.props.valueBi),
        valueHex = this.biToHex(this.props.valueBi);
      if (this.state.subRegisters) {
        var subRegisters = [...this.state.subRegisters];
        for (let i = 0; i < subRegisters.length; ++i) {
          subRegisters[i].valueBi = this.props.valueBi.slice(
            i * (this.props.valueBi.length / subRegisters.length),
            i * (this.props.valueBi.length / subRegisters.length) +
              this.props.valueBi.length / subRegisters.length
          );
          subRegisters[i].valueHex = valueHex.slice(
            i * (valueHex.length / subRegisters.length),
            i * (valueHex.length / subRegisters.length) +
              valueHex.length / subRegisters.length
          );
          subRegisters[i].valueDec = this.biToDec(subRegisters[i].valueBi);
        }
      }
      var timeline = gsap.timeline();
      timeline
        .set("#" + this.props.id, {
          // backgroundColor: "rgb(255, 87, 34)"
          color: "rgb(255,87,34)"
        })
        .to(
          "#" + this.props.id,
          {
            duration: 0.5,
            // backgroundColor: null
            color: "rgb(33,33,33)"
          },
          "+=.25"
        );
      this.setState({
        valueBi: [...this.props.valueBi],
        valueDec,
        valueHex,
        subRegisters
      });
    }
  }

  biToHex(valueBi) {
    var valueHex = new Array(this.props.size / 4).fill("0"),
      hexDigit;
    var valueHexIx = valueHex.length - 1;
    for (let i = valueBi.length - 1; i >= 0; i -= 4) {
      hexDigit =
        valueBi[i] +
        valueBi[i - 1] * 2 +
        valueBi[i - 2] * 4 +
        valueBi[i - 3] * 8;
      if (hexDigit === 10) {
        hexDigit = "A";
      } else if (hexDigit === 11) {
        hexDigit = "B";
      } else if (hexDigit === 12) {
        hexDigit = "C";
      } else if (hexDigit === 13) {
        hexDigit = "D";
      } else if (hexDigit === 14) {
        hexDigit = "E";
      } else if (hexDigit === 15) {
        hexDigit = "F";
      } else {
        hexDigit = hexDigit.toString();
      }
      valueHex[valueHexIx] = hexDigit;
      valueHexIx -= 1;
    }
    return valueHex;
  }

  biToDec(valueBi) {
    var valueDec = new Array(Math.ceil(valueBi.length / 3)).fill(0);
    for (let i = valueBi.length - 1; i > 0; --i) {
      if (valueBi[i]) {
        for (let j = 0; j < powersOfTwo[valueBi.length - i - 1].length; ++j) {
          valueDec[
            valueDec.length - powersOfTwo[valueBi.length - i - 1].length + j
          ] += parseInt(powersOfTwo[valueBi.length - i - 1][j]);
        }
        for (let j = 0; j < valueDec.length; ++j) {
          if (valueDec[j] > 9) {
            valueDec[j] = valueDec[j] % 10;
            valueDec[j - 1] += 1;
            --j;
          }
        }
      }
    }
    if (valueBi[0]) {
      for (let i = 0; i < powersOfTwo[valueBi.length - 1].length; ++i) {
        valueDec[valueDec.length - powersOfTwo[valueBi.length - 1].length + i] =
          powersOfTwo[valueBi.length - 1][i] -
          valueDec[
            valueDec.length - powersOfTwo[valueBi.length - 1].length + i
          ];
      }
      for (let i = valueDec.length - 1; i > 0; --i) {
        if (valueDec[i] < 0) {
          valueDec[i] = 10 + valueDec[i];
          valueDec[i - 1] -= 1;
        }
      }
    }
    var valueDecIx = 0;
    while (valueDec[valueDecIx] === 0 && valueDec.length > 1) {
      valueDec.splice(0, 1);
    }
    return valueDec;
  }

  render() {
    return (
      <div className="Register" id={this.props.id}>
        <div className="Register-mainRegister">
          <div>
            <span className="Register-name">{this.props.name}</span>
            <span className="Register-size">{this.props.size / 8} byte(s)</span>
          </div>
          <div>
            {this.state.valueBi[0] === 1 && <>-</>}
            {this.state.valueDec}
            <sub className="Register-baseSubscript">10</sub>
          </div>
          <div>
            {this.state.valueHex}
            <sub className="Register-baseSubscript">16</sub>
          </div>
          <div>
            {this.state.valueBi}
            <sub className="Register-baseSubscript">2</sub>
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
                {subRegister.valueBi[0] === 1 && <>-</>}
                {subRegister.valueDec}
                <sub className="Register-baseSubscript">10</sub>
              </div>
              <div>
                {subRegister.valueHex}
                <sub className="Register-baseSubscript">16</sub>
              </div>
              <div>
                {subRegister.valueBi}
                <sub className="Register-baseSubscript">2</sub>
              </div>
            </div>
          ))}
      </div>
    );
  }
}
