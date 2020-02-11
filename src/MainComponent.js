import React from "react";
import "./MainComponent.css";
import Register from "./Register";

export default class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    const registers = require("./registers.json")["registers"];
    for (let i = 0; i < registers.length; ++i) {
      registers[i].value = 0;
    }
    this.state = {
      registers: registers,
      lineNumbers: [{ name: 1, current: false }],
      currentInstruction: 0
    };
    this.incrementInstruction = this.incrementInstruction.bind(this);
    this.changeValues = this.changeValues.bind(this);
    this.zeroRegisters = this.zeroRegisters.bind(this);
    this.updateLineNumbers = this.updateLineNumbers.bind(this);
  }

  incrementInstruction() {
    console.log(document.getElementById("codeInput").value.split("\n").length);
    var lineNumbers = [...this.state.lineNumbers];
    if (this.state.currentInstruction === this.state.lineNumbers.length) {
      lineNumbers[this.state.currentInstruction - 1].current = false;
      this.setState({
        lineNumbers,
        currentInstruction: 0
      });
      return;
    }
    lineNumbers[this.state.currentInstruction].current = true;
    if (this.state.currentInstruction) {
      lineNumbers[this.state.currentInstruction - 1].current = false;
    }
    this.setState({
      lineNumbers,
      currentInstruction: this.state.currentInstruction + 1
    });
  }

  updateLineNumbers() {
    var numLines = document.getElementById("codeInput").value.split("\n")
      .length;
    if (numLines === this.state.lineNumbers.length || numLines === 0) {
      return;
    }
    var lineNumbers = new Array(numLines);
    for (let i = 0; i < lineNumbers.length; ++i) {
      lineNumbers[i] = { name: i + 1, current: false };
    }
    this.setState({ lineNumbers });
  }

  changeValues() {
    var registers = [...this.state.registers];
    var ix = Math.round(Math.random() * 1000000) % registers.length;
    registers[ix].value =
      Math.round(Math.random() * 1000000) % Math.pow(2, registers[ix].size * 8);
    this.setState({ registers });
  }

  zeroRegisters() {
    var registers = [...this.state.registers];
    for (let i = 0; i < registers.length; ++i) {
      registers[i].value = 0;
    }
    this.setState({ registers });
  }

  render() {
    return (
      <>
        <div className="MainComponent-header">ASM Simulator</div>
        <div className="MainComponent-codeInputContainer">
          <div>
            <button onClick={this.incrementInstruction}>RUN STEP</button>
            <button onClick={this.changeValues}>Random Value</button>
            <button onClick={this.zeroRegisters}>Zero registers</button>
          </div>
          <div className="MainComponent-lineNumbers">
            {this.state.lineNumbers.map(line => (
              <div key={"lineNumber" + line.name}>
                {line.current && (
                  <div className="MainComponent-currentLineNumber">
                    {line.name}
                  </div>
                )}
                {!line.current && <div>{line.name}</div>}
              </div>
            ))}
          </div>
          <textarea
            id="codeInput"
            onChange={this.updateLineNumbers}
            className="MainComponent-codeInput"
          ></textarea>
        </div>
        <div className="MainComponent-registers">
          {this.state.registers.map(register => (
            <Register
              key={"register" + register.name}
              name={register.name}
              size={register.size}
              value={register.value}
            ></Register>
          ))}
        </div>
      </>
    );
  }
}
