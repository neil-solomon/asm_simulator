import React from "react";
import "./MainComponent.css";
import Register from "./Register";
import LineNumber from "./LineNumber";

export default class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    const registers = require("./registers.json")["registers"];
    for (let i = 0; i < registers.length; ++i) {
      registers[i].value = 0;
    }
    this.state = {
      registers: registers,
      lineNumbers: [{ name: 1, current: true, error: false }],
      currentInstruction: 0,
      numInstructions: 0,
      runAllInterval: null
    };
    this.runStep = this.runStep.bind(this);
    this.changeValues = this.changeValues.bind(this);
    this.clearRegisters = this.clearRegisters.bind(this);
    this.updateLineNumbers = this.updateLineNumbers.bind(this);
    this.processNextInstruction = this.processNextInstruction.bind(this);
    this.runAll = this.runAll.bind(this);
    this.runAllInstructions = this.runAllInstructions.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.state.runAllInterval);
  }

  processNextInstruction() {
    var codeInput,
      instruction,
      destination,
      source,
      error = true,
      registers = [...this.state.registers],
      codeInput = document.getElementById("codeInput").value.split("\n");
    if (codeInput.length >= this.state.currentInstruction) {
      codeInput = codeInput[this.state.currentInstruction].split(" ");
    }
    if (codeInput.length === 3) {
      if (codeInput[1][codeInput[1].length - 1] === ",") {
        instruction = codeInput[0];
        destination = codeInput[1].split(",")[0];
        source = codeInput[2];
      }
    } else if (codeInput.length === 1 && codeInput[0] === "") {
      error = false;
    }
    if (instruction && destination && source) {
      switch (instruction) {
        case "MOV":
          if (isNaN(parseInt(destination))) {
            var destinationIx = null,
              sourceIx = null;
            if (isNaN(parseInt(source))) {
              for (let i = 0; i < registers.length; ++i) {
                if (registers[i].name === source) {
                  sourceIx = i;
                } else if (registers[i].name === destination) {
                  destinationIx = i;
                }
              }
              if (sourceIx !== null && destinationIx !== null) {
                registers[destinationIx].value = registers[sourceIx].value;
                error = false;
              }
            } else {
              for (let i = 0; i < registers.length; ++i) {
                if (registers[i].name === destination) {
                  registers[i].value = parseInt(source);
                  error = false;
                  break;
                }
              }
            }
          }
          break;
        default:
          break;
      }
    }
    return { registers: registers, error: error };
  }

  runStep() {
    var lineNumbers = [...this.state.lineNumbers];
    if (this.state.currentInstruction === this.state.lineNumbers.length) {
      lineNumbers[this.state.currentInstruction - 1].current = false;
      lineNumbers[0].current = true;
      this.setState({
        lineNumbers,
        currentInstruction: 0
      });
      return;
    }
    lineNumbers[
      (this.state.currentInstruction + 1) % lineNumbers.length
    ].current = true;
    lineNumbers[this.state.currentInstruction].current = false;
    var instructionProcessed = this.processNextInstruction();
    if (instructionProcessed.error) {
      lineNumbers[this.state.currentInstruction].error = true;
    } else {
      lineNumbers[this.state.currentInstruction].error = false;
    }
    this.setState({
      lineNumbers,
      registers: instructionProcessed.registers,
      lineNumbers,
      currentInstruction: this.state.currentInstruction + 1
    });
  }

  runAll() {
    var numInstructions = document.getElementById("codeInput").value.split("\n")
      .length;
    var runAllInterval = setInterval(() => this.runAllInstructions(), 250);
    this.setState({ currentInstruction: 0, numInstructions, runAllInterval });
  }

  runAllInstructions() {
    if (this.state.numInstructions) {
      this.runStep();
      this.setState({ numInstructions: this.state.numInstructions - 1 });
    } else {
      clearInterval(this.state.runAllInterval);
      this.setState({ currentInstruction: 0 });
    }
  }

  updateLineNumbers() {
    var numLines = document.getElementById("codeInput").value.split("\n")
      .length;
    if (numLines === this.state.lineNumbers.length || numLines === 0) {
      return;
    }
    var lineNumbers = new Array(numLines);
    for (let i = 0; i < lineNumbers.length; ++i) {
      if (i === 0) {
        lineNumbers[i] = { name: i + 1, current: true, error: false };
      } else {
        lineNumbers[i] = { name: i + 1, current: false, error: false };
      }
    }
    this.setState({ lineNumbers, currentInstruction: 0 });
  }

  changeValues() {
    var registers = [...this.state.registers];
    var ix = Math.round(Math.random() * 10000000000) % registers.length;
    registers[ix].value =
      Math.round(Math.random() * 10000000000) %
      Math.pow(2, registers[ix].size * 8);
    this.setState({ registers });
  }

  clearRegisters() {
    var registers = [...this.state.registers],
      lineNumbers = [...this.state.lineNumbers];
    for (let i = 0; i < lineNumbers.length; ++i) {
      if (i === 0) {
        lineNumbers[i].current = true;
      } else {
        lineNumbers[i].current = false;
      }
      lineNumbers[i].error = false;
    }
    for (let i = 0; i < registers.length; ++i) {
      registers[i].value = 0;
    }
    this.setState({ registers, currentInstruction: 0 });
  }

  render() {
    return (
      <>
        <div className="MainComponent-header">ASM Simulator</div>
        <div className="MainComponent-codeInputContainer">
          <div>
            <button onClick={this.runStep}>RUN STEP</button>
            <button onClick={this.runAll}>RUN ALL</button>
            <button onClick={this.changeValues}>Random Value</button>
            <button onClick={this.clearRegisters}>Clear Registers</button>
          </div>
          <div className="MainComponent-lineNumbers">
            {this.state.lineNumbers.map(line => (
              <LineNumber
                key={"lineNumber" + line.name}
                current={line.current}
                error={line.error}
                name={line.name}
              ></LineNumber>
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
              subRegisters={register.subRegisters}
            ></Register>
          ))}
        </div>
      </>
    );
  }
}
