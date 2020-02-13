import React from "react";
import { Icon } from "antd";

export default class LineNumber extends React.Component {
  render() {
    return (
      <div>
        <span style={{ fontSize: "12px", color: "rgb(103, 58, 183)" }}>
          {!this.props.error && this.props.current && (
            <Icon type="right"></Icon>
          )}
        </span>
        <span style={{ fontSize: "12px", color: "rgb(255, 0, 0)" }}>
          {this.props.error && <Icon type="exclamation"></Icon>}
        </span>
        <span style={{ fontSize: "14px" }}>
          {!this.props.current && !this.props.error && this.props.name}
        </span>
      </div>
    );
  }
}
