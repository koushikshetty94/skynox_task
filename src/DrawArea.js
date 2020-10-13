import React from "react";
import Immutable from "immutable";
import "./DrawArea.css";

class DrawArea extends React.Component {
  constructor() {
    super();

    this.state = {
      lines: new Immutable.List(),
      isDrawing: false
    };

    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
  }

  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  handleMouseDown(mouseEvent) {
    if (mouseEvent.button != 0) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);

    this.setState(prevState => ({
      lines: prevState.lines.push(new Immutable.List([point])),
      isDrawing: true
    }));
  }

  handleMouseMove(mouseEvent) {
    if (!this.state.isDrawing) {
      return;
    }

    const point = this.relativeCoordinatesForEvent(mouseEvent);
    
    this.setState(prevState =>  ({
      lines: prevState.lines.updateIn([prevState.lines.size - 1], line => line.push(point))
    }));
  }

  handleMouseUp() {
    this.setState({ isDrawing: false });
  }

  relativeCoordinatesForEvent(mouseEvent) {
    const boundingRect = this.refs.drawArea.getBoundingClientRect();
    return new Immutable.Map({
      x: mouseEvent.clientX - boundingRect.left,
      y: mouseEvent.clientY - boundingRect.top,
    });
  }

  doc = React.createRef()

  render() {

    return (
      <>
        <div className="colors" >
          <button
            className="colors__selection"
            style={{ border: "2px solid red" }}
            onClick={() => {
              // this.doc.print()
              console.log(this.doc)
              
              this.changeColor("red");
              // color = "red";
            }}
          ></button>
          <button
            className="colors__selection"
            style={{ border: "2px solid blue" }}
            onClick={() => {
              this.changeColor("blue");
              // color = "blue";
            }}
          ></button>
          <button
            className="colors__selection"
            style={{ border: "2px solid green" }}
            onClick={() => {
              this.changeColor("green");
              // color = "green";
            }}
          ></button>
          <button
            className="colors__selection"
            style={{ border: "2px solid violet" }}
            onClick={() => {
              this.changeColor("violet");
              // color = "violet";
            }}
          ></button>
        </div>
        <div
          className="drawArea"
          ref="drawArea"
          onMouseDown={this.handleMouseDown}
          onMouseMove={this.handleMouseMove} 
          ref={this.doc}
        >
          <Drawing lines={this.state.lines} color={this.state.color} />
        </div>
      </>
    );
  }
}

function Drawing({ lines, color }) {
  return (
    <svg className="drawing">
      {lines.map((line, index) => (
        <DrawingLine key={index} line={line} color={color} />
      ))}
    </svg>
  );
}

function DrawingLine({ line, color }) {
  const pathData =
    "M " +
    line
      .map((p) => {
        return `${p.get("x")} ${p.get("y")}`;
      })
      .join(" L ");

  return <path className="path" style={{ stroke: color }} d={pathData} />;
}

export default DrawArea;
