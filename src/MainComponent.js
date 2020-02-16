import React from "react";
import "./MainComponent.css";
import Register from "./Register";
import LineNumber from "./LineNumber";

export default class MainComponent extends React.Component {
  constructor(props) {
    super(props);
    const registers = require("./registers.json");
    for (let i = 0; i < registers.length; ++i) {
      registers[i].valueBi = new Array(registers[i].size).fill(0);
    }
    this.state = {
      registers: registers,
      lineNumbers: [{ name: 1, current: true, error: false }],
      currentInstruction: 0,
      numInstructions: 0,
      runAllInterval: null
    };
    this.runStep = this.runStep.bind(this);
    this.randomValue = this.randomValue.bind(this);
    this.clearRegisters = this.clearRegisters.bind(this);
    this.updateLineNumbers = this.updateLineNumbers.bind(this);
    this.processNextInstruction = this.processNextInstruction.bind(this);
    this.runAll = this.runAll.bind(this);
    this.runAllInstructions = this.runAllInstructions.bind(this);
    this.findDestinationAndSource = this.findDestinationAndSource.bind(this);
    this.immToBi = this.immToBi.bind(this);
  }

  componentWillUnmount() {
    clearInterval(this.state.runAllInterval);
  }

  processNextInstruction() {
    var instruction,
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
      var destinationAndSource = this.findDestinationAndSource(
        registers,
        destination,
        source
      );
      var dIx = destinationAndSource.destinationIx,
        sdIx = destinationAndSource.subDestinationIx,
        sourceValue = destinationAndSource.source;
      //console.log(dIx, sdIx, sourceValue);
      if (dIx !== null && sourceValue !== null) {
        error = false;
        if (sdIx !== null) {
          while (
            sourceValue.length <
            registers[dIx].size / registers[dIx].subRegisters.length
          ) {
            sourceValue.unshift(0);
          }
          while (
            sourceValue.length >
            registers[dIx].size / registers[dIx].subRegisters.length
          ) {
            sourceValue.splice(0, 1);
          }
        } else {
          while (sourceValue.length < registers[dIx].size) {
            sourceValue.unshift(0);
          }
          while (sourceValue.length > registers[dIx].size) {
            sourceValue.splice(0, 1);
          }
        }
        var startIx, endIx;
        switch (instruction) {
          case "MOV":
            if (sdIx !== null) {
              startIx =
                sdIx *
                (registers[dIx].size / registers[dIx].subRegisters.length);
              endIx =
                (sdIx + 1) *
                (registers[dIx].size / registers[dIx].subRegisters.length);
              for (let i = startIx; i < endIx; ++i) {
                registers[dIx].valueBi[i] = sourceValue[i - startIx];
              }
            } else {
              for (let i = 0; i < registers[dIx].size; ++i) {
                registers[dIx].valueBi[i] = sourceValue[i];
              }
            }
            break;
          case "AND":
            if (sdIx !== null) {
              startIx =
                sdIx *
                (registers[dIx].size / registers[dIx].subRegisters.length);
              endIx =
                (sdIx + 1) *
                (registers[dIx].size / registers[dIx].subRegisters.length);
              for (let i = startIx; i < endIx; ++i) {
                registers[dIx].valueBi[i] =
                  registers[dIx].valueBi[i] & sourceValue[i - startIx];
              }
            } else {
              for (let i = 0; i < registers[dIx].size; ++i) {
                registers[dIx].valueBi[i] =
                  registers[dIx].valueBi[i] & sourceValue[i];
              }
            }
            break;
          case "NAND":
            if (sdIx !== null) {
              startIx =
                sdIx *
                (registers[dIx].size / registers[dIx].subRegisters.length);
              endIx =
                (sdIx + 1) *
                (registers[dIx].size / registers[dIx].subRegisters.length);
              for (let i = startIx; i < endIx; ++i) {
                registers[dIx].valueBi[i] = !(
                  registers[dIx].valueBi[i] & sourceValue[i - startIx]
                )
                  ? 1
                  : 0;
              }
            } else {
              for (let i = 0; i < registers[dIx].size; ++i) {
                registers[dIx].valueBi[i] = !(
                  registers[dIx].valueBi[i] & sourceValue[i]
                )
                  ? 1
                  : 0;
              }
            }
            break;
          case "OR":
            if (sdIx !== null) {
              startIx =
                sdIx *
                (registers[dIx].size / registers[dIx].subRegisters.length);
              endIx =
                (sdIx + 1) *
                (registers[dIx].size / registers[dIx].subRegisters.length);
              for (let i = startIx; i < endIx; ++i) {
                registers[dIx].valueBi[i] =
                  registers[dIx].valueBi[i] | sourceValue[i - startIx];
              }
            } else {
              for (let i = 0; i < registers[dIx].size; ++i) {
                registers[dIx].valueBi[i] =
                  registers[dIx].valueBi[i] | sourceValue[i];
              }
            }
            break;
          case "NOR":
            if (sdIx !== null) {
              startIx =
                sdIx *
                (registers[dIx].size / registers[dIx].subRegisters.length);
              endIx =
                (sdIx + 1) *
                (registers[dIx].size / registers[dIx].subRegisters.length);
              for (let i = startIx; i < endIx; ++i) {
                registers[dIx].valueBi[i] = !(
                  registers[dIx].valueBi[i] | sourceValue[i - startIx]
                )
                  ? 1
                  : 0;
              }
            } else {
              for (let i = 0; i < registers[dIx].size; ++i) {
                registers[dIx].valueBi[i] = !(
                  registers[dIx].valueBi[i] | sourceValue[i]
                )
                  ? 1
                  : 0;
              }
            }
            break;
          case "XOR":
            if (sdIx !== null) {
              startIx =
                sdIx *
                (registers[dIx].size / registers[dIx].subRegisters.length);
              endIx =
                (sdIx + 1) *
                (registers[dIx].size / registers[dIx].subRegisters.length);
              for (let i = startIx; i < endIx; ++i) {
                registers[dIx].valueBi[i] =
                  registers[dIx].valueBi[i] ^ sourceValue[i - startIx] ? 1 : 0;
              }
            } else {
              for (let i = 0; i < registers[dIx].size; ++i) {
                registers[dIx].valueBi[i] =
                  registers[dIx].valueBi[i] ^ sourceValue[i] ? 1 : 0;
              }
            }
            break;
          default:
            break;
        }
      }
    }
    return { registers: registers, error: error };
  }

  findDestinationAndSource(registers, destination, source) {
    if (isNaN(parseInt(destination))) {
      var destinationIx = null,
        sourceIx = null,
        subSourceIx = null,
        subDestinationIx = null,
        sourceValue = null;
      if (
        isNaN(parseInt(source)) &&
        source[source.length - 1] !== "b" &&
        source[source.length - 1] !== "h"
      ) {
        for (let i = 0; i < registers.length; ++i) {
          if (registers[i].name === source) {
            sourceIx = i;
          } else if (registers[i].name === destination) {
            destinationIx = i;
          }
          if (registers[i].subRegisters) {
            for (let j = 0; j < registers[i].subRegisters.length; ++j) {
              if (registers[i].subRegisters[j] === source) {
                sourceIx = i;
                subSourceIx = j;
              } else if (registers[i].subRegisters[j] === destination) {
                destinationIx = i;
                subDestinationIx = j;
              }
            }
          }
        }
        if (sourceIx !== null && destinationIx !== null) {
          if (subSourceIx === null && subDestinationIx === null) {
            sourceValue = registers[sourceIx].valueBi;
            // console.log("mainSource & mainDestination");
          } else if (subSourceIx !== null && subDestinationIx === null) {
            sourceValue = registers[sourceIx].valueBi.slice(
              subSourceIx *
                (registers[sourceIx].size /
                  registers[sourceIx].subRegisters.length),
              (subSourceIx + 1) *
                (registers[sourceIx].size /
                  registers[sourceIx].subRegisters.length)
            );
            // console.log("subSource & mainDestination");
          } else if (subSourceIx === null && destinationIx !== null) {
            sourceValue = registers[sourceIx].valueBi;
            // console.log("mainSource & subDestination");
          } else if (subSourceIx !== null && subDestinationIx !== null) {
            sourceValue = registers[sourceIx].valueBi.slice(
              subSourceIx *
                (registers[sourceIx].size /
                  registers[sourceIx].subRegisters.length),
              (subSourceIx + 1) *
                (registers[sourceIx].size /
                  registers[sourceIx].subRegisters.length)
            );
            // console.log("subSource & subDestination");
          }
        }
      } else {
        sourceValue = this.immToBi(source);
        for (let i = 0; i < registers.length; ++i) {
          if (registers[i].name === destination) {
            destinationIx = i;
            // console.log("immediate & mainDestination");
          }
          if (registers[i].subRegisters) {
            for (let j = 0; j < registers[i].subRegisters.length; ++j) {
              if (registers[i].subRegisters[j] === destination) {
                subDestinationIx = j;
                destinationIx = i;
                // console.log("immediate and subDestination");
              }
            }
          }
        }
      }
    }
    return {
      destinationIx: destinationIx,
      subDestinationIx: subDestinationIx,
      source: sourceValue
    };
  }

  immToBi(source) {
    var sourceValue = [];
    if (source[source.length - 1] === "h") {
      var sourceHex = source.slice(0, source.length - 1).split("");
      for (let i = 0; i < sourceHex.length; ++i) {
        switch (sourceHex[i]) {
          case "0":
            sourceValue.push(0, 0, 0, 0);
            break;
          case "1":
            sourceValue.push(0, 0, 0, 1);
            break;
          case "2":
            sourceValue.push(0, 0, 1, 0);
            break;
          case "3":
            sourceValue.push(0, 0, 1, 1);
            break;
          case "4":
            sourceValue.push(0, 1, 0, 0);
            break;
          case "5":
            sourceValue.push(0, 1, 0, 1);
            break;
          case "6":
            sourceValue.push(0, 1, 1, 0);
            break;
          case "7":
            sourceValue.push(0, 1, 1, 1);
            break;
          case "8":
            sourceValue.push(1, 0, 0, 0);
            break;
          case "9":
            sourceValue.push(1, 0, 0, 1);
            break;
          case "A":
            sourceValue.push(1, 0, 1, 0);
            break;
          case "B":
            sourceValue.push(1, 0, 1, 1);
            break;
          case "C":
            sourceValue.push(1, 1, 0, 0);
            break;
          case "D":
            sourceValue.push(1, 1, 0, 1);
            break;
          case "E":
            sourceValue.push(1, 1, 1, 0);
            break;
          case "F":
            sourceValue.push(1, 1, 1, 1);
            break;
          default:
            return null;
        }
      }
    } else if (source[source.length - 1] === "b") {
      sourceValue = source.slice(0, source.length - 1).split("");
      for (let i = 0; i < sourceValue.length; ++i) {
        sourceValue[i] = parseInt(sourceValue[i]);
        if (sourceValue[i] !== 0 && sourceValue[i] !== 1) {
          return null;
        }
      }
    } else {
      for (let i = 0; i < source.length; ++i) {
        if (isNaN(parseInt(source[i]))) {
          return null;
        }
      }
      source = parseInt(source);
      while (source) {
        sourceValue.unshift(source % 2);
        source = Math.floor(source / 2);
      }
    }
    return sourceValue;
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

  randomValue() {
    var registers = [...this.state.registers];
    var ix = Math.round(Math.random() * 1000000) % registers.length;
    for (let i = 0; i < registers[ix].valueBi.length; ++i) {
      registers[ix].valueBi[i] = Math.round(Math.random() * 1000000) % 2;
    }
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
      registers[i].valueBi = new Array(registers[i].size).fill(0);
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
            <button onClick={this.randomValue}>Random Value</button>
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
              valueBi={register.valueBi}
              subRegisters={register.subRegisters}
            ></Register>
          ))}
        </div>
      </>
    );
  }
}
